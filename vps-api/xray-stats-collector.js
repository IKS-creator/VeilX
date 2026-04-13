// Collects traffic stats from Xray Stats API via CLI, parses into per-user data
const { execFileSync } = require('node:child_process')

// Parse xray statsquery output into { users: { [uuid]: { up, down, online } } }
// Each stat line looks like: stat: { name: "user>>>uuid>>>traffic>>>uplink" value: 12345 }
function parseStatsOutput(stdout) {
  const users = {}
  const lines = stdout.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const nameLine = lines[i]
    const nameMatch = nameLine.match(/name:\s*"user>>>([^>]+)>>>traffic>>>(uplink|downlink)"/)
    if (!nameMatch) continue

    const uuid = nameMatch[1]
    const direction = nameMatch[2]

    // Value is on the next line
    const valueLine = lines[i + 1] || ''
    const valueMatch = valueLine.match(/value:\s*(\d+)/)
    const value = valueMatch ? parseInt(valueMatch[1], 10) : 0

    if (!users[uuid]) {
      users[uuid] = { up: 0, down: 0, online: false }
    }

    if (direction === 'uplink') {
      users[uuid].up = value
    } else {
      users[uuid].down = value
    }

    // Any non-zero traffic since last reset means user was online
    if (value > 0) {
      users[uuid].online = true
    }
  }

  return { users }
}

// Execute xray api statsquery with --reset flag to collect and reset counters
function collectStats() {
  try {
    const stdout = execFileSync(
      'xray', ['api', 'statsquery', '--server=127.0.0.1:10085', '--reset'],
      { encoding: 'utf8', timeout: 10_000 },
    )
    return parseStatsOutput(stdout)
  } catch (err) {
    console.error('[stats] xray statsquery failed:', err.message)
    const error = new Error('Stats collection failed')
    error.statusCode = 502
    throw error
  }
}

module.exports = { collectStats, parseStatsOutput }

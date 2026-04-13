// Reads/writes Xray config.json and reloads Xray via SIGHUP
const fs = require('node:fs')
const { execFileSync } = require('node:child_process')

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function configPath() {
  const p = process.env.XRAY_CONFIG_PATH
  if (!p) throw new Error('XRAY_CONFIG_PATH not configured')
  return p
}

function readConfig() {
  try {
    return JSON.parse(fs.readFileSync(configPath(), 'utf8'))
  } catch (err) {
    console.error('[xray-config] Failed to read config:', err.message)
    const error = new Error('Failed to read Xray config')
    error.statusCode = 500
    throw error
  }
}

// Atomic write: tmp file + rename (safe on same filesystem)
function writeConfig(config) {
  const target = configPath()
  const tmp = target + '.tmp.' + process.pid
  try {
    fs.writeFileSync(tmp, JSON.stringify(config, null, 2), 'utf8')
    fs.renameSync(tmp, target)
  } catch (err) {
    // Clean up tmp on failure
    try { fs.unlinkSync(tmp) } catch { /* ignore */ }
    console.error('[xray-config] Failed to write config:', err.message)
    const error = new Error('Failed to write Xray config')
    error.statusCode = 500
    throw error
  }
}

// Get clients array reference from config with validation
function getClients(config) {
  const clients = config?.inbounds?.[0]?.settings?.clients
  if (!Array.isArray(clients)) {
    const err = new Error('Xray config invalid: inbounds[0].settings.clients not found')
    err.statusCode = 500
    throw err
  }
  return clients
}

// Reload Xray via SIGHUP — throws 503 on failure so callers can report warning
function reloadXray() {
  try {
    const raw = execFileSync('pidof', ['xray'], { encoding: 'utf8' }).trim()
    const pid = raw.split(/\s+/)[0]
    if (pid && /^\d+$/.test(pid)) {
      execFileSync('kill', ['-SIGHUP', pid])
      return
    }
  } catch { /* pidof failed — xray not running, try restart */ }

  try {
    execFileSync('systemctl', ['restart', 'xray'])
  } catch (err) {
    console.error('[xray-config] Reload failed:', err.message)
    const error = new Error('Xray reload failed')
    error.statusCode = 503
    throw error
  }
}

function isValidUuid(uuid) {
  return UUID_REGEX.test(uuid)
}

// Try reload, return warning string if it fails (config is already written)
function tryReload() {
  try {
    reloadXray()
    return null
  } catch {
    return 'Xray reload failed — config saved, will apply on next restart'
  }
}

// Add a UUID to Xray config clients[]. Returns { added, warning? } or throws.
function addUser(uuid) {
  const config = readConfig()
  const clients = getClients(config)

  if (clients.some((c) => c.id === uuid)) {
    const err = new Error('UUID already exists')
    err.statusCode = 409
    throw err
  }

  clients.push({ id: uuid, email: uuid, flow: 'xtls-rprx-vision' })
  writeConfig(config)
  const warning = tryReload()
  const result = { added: true }
  if (warning) result.warning = warning
  return result
}

// Remove a UUID from Xray config clients[]. Returns { removed, warning? } or throws.
function removeUser(uuid) {
  const config = readConfig()
  const clients = getClients(config)
  const idx = clients.findIndex((c) => c.id === uuid)

  if (idx === -1) {
    const err = new Error('UUID not found')
    err.statusCode = 404
    throw err
  }

  clients.splice(idx, 1)
  writeConfig(config)
  const warning = tryReload()
  const result = { removed: true }
  if (warning) result.warning = warning
  return result
}

// Full rewrite of clients[] with given UUIDs. Returns { synced, warning? }.
function syncUsers(uuids) {
  const config = readConfig()
  // Validate config structure before overwriting
  getClients(config)
  config.inbounds[0].settings.clients = uuids.map((id) => ({
    id,
    email: id,
    flow: 'xtls-rprx-vision',
  }))
  writeConfig(config)
  const warning = tryReload()
  const result = { synced: uuids.length }
  if (warning) result.warning = warning
  return result
}

module.exports = { isValidUuid, addUser, removeUser, syncUsers }

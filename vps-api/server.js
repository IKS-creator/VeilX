// VeilX VPS API — HTTPS Express server managing Xray users and traffic stats
const https = require('node:https')
const fs = require('node:fs')
const express = require('express')
const authBearer = require('./auth-bearer-middleware')
const { isValidUuid, addUser, removeUser, syncUsers } = require('./xray-config-manager')
const { collectStats } = require('./xray-stats-collector')

const app = express()
app.use(express.json())
app.use(authBearer)

// Errors with explicit statusCode have sanitized messages; unexpected throws get generic
function safeErrorMessage(err) {
  if (err.statusCode) return err.message
  return 'Internal server error'
}

// POST /users — add UUID to Xray config
app.post('/users', (req, res) => {
  try {
    const { uuid } = req.body || {}
    if (!uuid || !isValidUuid(uuid)) {
      return res.status(400).json({ error: 'Invalid or missing UUID' })
    }
    const result = addUser(uuid)
    res.json({ ok: true, ...result })
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: safeErrorMessage(err) })
  }
})

// DELETE /users/:uuid — remove UUID from Xray config
app.delete('/users/:uuid', (req, res) => {
  try {
    const { uuid } = req.params
    if (!isValidUuid(uuid)) {
      return res.status(400).json({ error: 'Invalid UUID format' })
    }
    const result = removeUser(uuid)
    res.json({ ok: true, ...result })
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: safeErrorMessage(err) })
  }
})

// GET /stats — collect traffic stats from Xray (resets counters)
app.get('/stats', (req, res) => {
  try {
    const stats = collectStats()
    res.json({ ok: true, ...stats })
  } catch (err) {
    res.status(err.statusCode || 502).json({ error: safeErrorMessage(err) })
  }
})

// POST /sync — full rewrite of Xray clients[] array
app.post('/sync', (req, res) => {
  try {
    const { uuids } = req.body || {}
    if (!Array.isArray(uuids) || !uuids.every(isValidUuid)) {
      return res.status(400).json({ error: 'Invalid or missing uuids array' })
    }
    const result = syncUsers(uuids)
    res.json({ ok: true, ...result })
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: safeErrorMessage(err) })
  }
})

// Start HTTPS server
const port = parseInt(process.env.API_PORT || '8443', 10)
const certPath = process.env.TLS_CERT_PATH
const keyPath = process.env.TLS_KEY_PATH

if (!certPath || !keyPath) {
  console.error('TLS_CERT_PATH and TLS_KEY_PATH must be set')
  process.exit(1)
}

let cert, key
try {
  cert = fs.readFileSync(certPath)
  key = fs.readFileSync(keyPath)
} catch (err) {
  console.error('Failed to read TLS files:', err.message)
  process.exit(1)
}

const server = https.createServer({ cert, key }, app)

server.listen(port, () => {
  console.log(`VeilX API listening on https://0.0.0.0:${port}`)
})

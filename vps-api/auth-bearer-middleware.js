// Bearer token auth middleware — validates Authorization header via crypto.timingSafeEqual
const crypto = require('node:crypto')

function authBearer(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' })
  }

  const token = header.slice(7)
  const expected = process.env.API_TOKEN
  if (!expected) {
    return res.status(500).json({ error: 'API_TOKEN not configured' })
  }

  // Constant-time comparison — pad to equal length so timingSafeEqual always runs,
  // then check real length AFTER to prevent length-leak timing side-channel
  const tokenBuf = Buffer.from(token)
  const expectedBuf = Buffer.from(expected)
  const len = Math.max(tokenBuf.length, expectedBuf.length)
  const a = Buffer.alloc(len)
  const b = Buffer.alloc(len)
  tokenBuf.copy(a)
  expectedBuf.copy(b)

  if (!crypto.timingSafeEqual(a, b) || tokenBuf.length !== expectedBuf.length) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  next()
}

module.exports = authBearer

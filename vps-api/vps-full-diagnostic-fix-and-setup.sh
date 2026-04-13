#!/usr/bin/env bash
# VeilX — Complete VPS diagnostic + fix + setup
# Paste this into SSH on your VPS as root.
#
# What it does:
#   1. Checks if Xray is installed/running
#   2. Fixes Xray config (adds DNS, generates keys if needed, adds test user)
#   3. Generates self-signed TLS cert for VPS API
#   4. Sets up VPS API (Node.js + systemd)
#   5. Prints everything you need for .env.local
#
# Usage:
#   ssh root@70.34.204.16
#   # paste this script and press Enter

set -euo pipefail

XRAY_BIN="/usr/local/bin/xray"
XRAY_CONFIG="/usr/local/etc/xray/config.json"
VPS_API_DIR="/opt/veilx-api"
REALITY_SNI="dl.google.com"
API_PORT="8443"

echo "============================================"
echo "  VeilX VPS — Diagnostic + Fix + Setup"
echo "============================================"
echo ""

# ── 1. Check Xray ────────────────────────────────
echo "=== 1/6 Checking Xray ==="

if [ ! -f "$XRAY_BIN" ]; then
  echo "[!] Xray not installed. Installing..."
  apt-get update -qq && apt-get install -y -qq unzip curl ufw jq

  ufw allow 22/tcp
  ufw allow 443/tcp
  ufw allow 8443/tcp
  ufw --force enable

  XRAY_VERSION=$(curl -s https://api.github.com/repos/XTLS/Xray-core/releases/latest | grep '"tag_name"' | cut -d'"' -f4)
  ARCH=$(uname -m)
  case "$ARCH" in
    x86_64)  XRAY_ARCH="64" ;;
    aarch64) XRAY_ARCH="arm64-v8a" ;;
    *)       echo "Unsupported arch: $ARCH"; exit 1 ;;
  esac
  curl -fSL -o /tmp/xray.zip "https://github.com/XTLS/Xray-core/releases/download/${XRAY_VERSION}/Xray-linux-${XRAY_ARCH}.zip"
  mkdir -p /usr/local/etc/xray
  unzip -o /tmp/xray.zip xray -d /usr/local/bin/
  chmod +x "$XRAY_BIN"
  rm -f /tmp/xray.zip
  echo "[OK] Xray ${XRAY_VERSION} installed"
else
  echo "[OK] Xray binary found: $($XRAY_BIN version 2>/dev/null | head -1 || echo 'unknown version')"
fi

# Install jq if missing (needed for config manipulation)
command -v jq >/dev/null || apt-get install -y -qq jq

# ── 2. Generate Reality keys ─────────────────────
echo ""
echo "=== 2/6 Reality keys ==="

# Check if config exists and has valid keys already
NEED_NEW_KEYS=true
if [ -f "$XRAY_CONFIG" ]; then
  EXISTING_PK=$(jq -r '.inbounds[0].streamSettings.realitySettings.privateKey // empty' "$XRAY_CONFIG" 2>/dev/null || true)
  if [ -n "$EXISTING_PK" ] && [ "$EXISTING_PK" != "REALITY_PRIVATE_KEY" ] && [ ${#EXISTING_PK} -gt 10 ]; then
    echo "[OK] Existing Reality keys found, reusing"
    PRIVATE_KEY="$EXISTING_PK"
    # Derive public key from private key
    PUBLIC_KEY=$("$XRAY_BIN" x25519 -i "$PRIVATE_KEY" 2>/dev/null | grep 'Public' | awk '{print $NF}')
    SHORT_ID=$(jq -r '.inbounds[0].streamSettings.realitySettings.shortIds[0] // empty' "$XRAY_CONFIG" 2>/dev/null || true)
    if [ -z "$SHORT_ID" ]; then
      SHORT_ID=$(openssl rand -hex 4)
    fi
    NEED_NEW_KEYS=false
  fi
fi

if [ "$NEED_NEW_KEYS" = true ]; then
  echo "[*] Generating new Reality keypair..."
  KEYS=$("$XRAY_BIN" x25519)
  PRIVATE_KEY=$(echo "$KEYS" | grep 'Private' | awk '{print $NF}')
  PUBLIC_KEY=$(echo "$KEYS" | grep 'Public' | awk '{print $NF}')
  SHORT_ID=$(openssl rand -hex 4)
  echo "[OK] New keys generated"
fi

# ── 3. Generate test user UUID ───────────────────
echo ""
echo "=== 3/6 Test user ==="

# Check if there are existing users
EXISTING_USERS=""
if [ -f "$XRAY_CONFIG" ]; then
  EXISTING_USERS=$(jq -r '.inbounds[0].settings.clients[]?.id // empty' "$XRAY_CONFIG" 2>/dev/null || true)
fi

if [ -n "$EXISTING_USERS" ]; then
  TEST_UUID=$(echo "$EXISTING_USERS" | head -1)
  echo "[OK] Existing user found: $TEST_UUID"
else
  TEST_UUID=$(cat /proc/sys/kernel/random/uuid)
  echo "[OK] Generated test user: $TEST_UUID"
fi

# ── 4. Write fixed Xray config ──────────────────
echo ""
echo "=== 4/6 Writing Xray config ==="

cat > "$XRAY_CONFIG" << XEOF
{
  "log": {
    "loglevel": "warning"
  },
  "dns": {
    "servers": [
      "https+local://1.1.1.1/dns-query",
      "https+local://8.8.8.8/dns-query",
      "localhost"
    ],
    "queryStrategy": "UseIP"
  },
  "stats": {},
  "api": {
    "tag": "api",
    "services": ["StatsService"]
  },
  "policy": {
    "levels": {
      "0": {
        "statsUserUplink": true,
        "statsUserDownlink": true
      }
    },
    "system": {
      "statsInboundUplink": true,
      "statsInboundDownlink": true
    }
  },
  "inbounds": [
    {
      "tag": "vless-reality",
      "listen": "0.0.0.0",
      "port": 443,
      "protocol": "vless",
      "settings": {
        "decryption": "none",
        "clients": [
          {
            "id": "${TEST_UUID}",
            "flow": "xtls-rprx-vision"
          }
        ]
      },
      "streamSettings": {
        "network": "tcp",
        "security": "reality",
        "realitySettings": {
          "show": false,
          "dest": "${REALITY_SNI}:443",
          "xver": 0,
          "serverNames": ["${REALITY_SNI}"],
          "privateKey": "${PRIVATE_KEY}",
          "shortIds": ["${SHORT_ID}"]
        }
      },
      "sniffing": {
        "enabled": true,
        "destOverride": ["http", "tls", "quic"],
        "routeOnly": false
      }
    },
    {
      "tag": "api-inbound",
      "listen": "127.0.0.1",
      "port": 10085,
      "protocol": "dokodemo-door",
      "settings": {
        "address": "127.0.0.1"
      }
    }
  ],
  "outbounds": [
    {
      "tag": "direct",
      "protocol": "freedom"
    },
    {
      "tag": "blocked",
      "protocol": "blackhole"
    }
  ],
  "routing": {
    "domainStrategy": "AsIs",
    "rules": [
      {
        "type": "field",
        "inboundTag": ["api-inbound"],
        "outboundTag": "api"
      },
      {
        "type": "field",
        "outboundTag": "blocked",
        "protocol": ["bittorrent"]
      }
    ]
  }
}
XEOF

chmod 600 "$XRAY_CONFIG"
echo "[OK] Config written with DNS + test user"

# ── 5. Systemd unit for Xray + restart ───────────
echo ""
echo "=== 5/6 Xray systemd ==="

cat > /etc/systemd/system/xray.service << 'EOF'
[Unit]
Description=Xray-core VLESS+Reality
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/usr/local/bin/xray run -config /usr/local/etc/xray/config.json
Restart=on-failure
RestartSec=5
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable xray
systemctl restart xray
sleep 2

if systemctl is-active --quiet xray; then
  echo "[OK] Xray is running"
else
  echo "[FAIL] Xray failed to start:"
  journalctl -u xray -n 10 --no-pager
  exit 1
fi

# ── 6. VPS API setup ────────────────────────────
echo ""
echo "=== 6/6 VPS API setup ==="

# Install Node.js if missing
if ! command -v node >/dev/null; then
  echo "[*] Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y -qq nodejs
fi
echo "[OK] Node.js $(node --version)"

# Generate API token
VPS_API_TOKEN=$(openssl rand -hex 32)

# Generate self-signed TLS cert for VPS API
TLS_DIR="/etc/veilx-api"
mkdir -p "$TLS_DIR"
if [ ! -f "$TLS_DIR/cert.pem" ]; then
  openssl req -x509 -newkey rsa:2048 -keyout "$TLS_DIR/key.pem" -out "$TLS_DIR/cert.pem" \
    -days 3650 -nodes -subj "/CN=veilx-api" 2>/dev/null
  echo "[OK] Self-signed TLS cert generated"
else
  echo "[OK] TLS cert already exists"
fi

# Create VPS API directory and files
mkdir -p "$VPS_API_DIR"

# Write env file
cat > /etc/veilx-api.env << ENVEOF
API_PORT=${API_PORT}
API_TOKEN=${VPS_API_TOKEN}
XRAY_CONFIG_PATH=${XRAY_CONFIG}
TLS_CERT_PATH=${TLS_DIR}/cert.pem
TLS_KEY_PATH=${TLS_DIR}/key.pem
ENVEOF
chmod 600 /etc/veilx-api.env

# Write package.json
cat > "$VPS_API_DIR/package.json" << 'PKGEOF'
{
  "name": "veilx-api",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "express": "^4.21.0"
  }
}
PKGEOF

# Write auth middleware
cat > "$VPS_API_DIR/auth-bearer-middleware.js" << 'AUTHEOF'
const crypto = require('node:crypto')

const TOKEN = process.env.API_TOKEN
if (!TOKEN) {
  console.error('API_TOKEN not set')
  process.exit(1)
}

const TOKEN_BUF = Buffer.from(TOKEN)

module.exports = function authBearer(req, res, next) {
  const auth = req.headers.authorization || ''
  const match = auth.match(/^Bearer\s+(.+)$/i)
  if (!match) {
    return res.status(401).json({ error: 'Missing Authorization header' })
  }
  const provided = Buffer.from(match[1])
  if (provided.length !== TOKEN_BUF.length || !crypto.timingSafeEqual(provided, TOKEN_BUF)) {
    return res.status(403).json({ error: 'Invalid token' })
  }
  next()
}
AUTHEOF

# Write config manager
cat > "$VPS_API_DIR/xray-config-manager.js" << 'CFGEOF'
const fs = require('node:fs')
const { execFileSync } = require('node:child_process')

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function configPath() {
  const p = process.env.XRAY_CONFIG_PATH
  if (!p) throw new Error('XRAY_CONFIG_PATH not configured')
  return p
}

function readConfig() {
  return JSON.parse(fs.readFileSync(configPath(), 'utf8'))
}

function writeConfig(config) {
  const target = configPath()
  const tmp = target + '.tmp.' + process.pid
  fs.writeFileSync(tmp, JSON.stringify(config, null, 2), 'utf8')
  fs.renameSync(tmp, target)
}

function getClients(config) {
  const clients = config?.inbounds?.[0]?.settings?.clients
  if (!Array.isArray(clients)) throw new Error('clients not found in config')
  return clients
}

function reloadXray() {
  try {
    const raw = execFileSync('pidof', ['xray'], { encoding: 'utf8' }).trim()
    const pid = raw.split(/\s+/)[0]
    if (pid && /^\d+$/.test(pid)) {
      execFileSync('kill', ['-SIGHUP', pid])
      return
    }
  } catch {}
  execFileSync('systemctl', ['restart', 'xray'])
}

function isValidUuid(uuid) { return UUID_REGEX.test(uuid) }

function tryReload() {
  try { reloadXray(); return null }
  catch { return 'Xray reload failed — config saved, will apply on restart' }
}

function addUser(uuid) {
  const config = readConfig()
  const clients = getClients(config)
  if (clients.some(c => c.id === uuid)) {
    const err = new Error('UUID already exists'); err.statusCode = 409; throw err
  }
  clients.push({ id: uuid, flow: 'xtls-rprx-vision' })
  writeConfig(config)
  return { added: true, warning: tryReload() }
}

function removeUser(uuid) {
  const config = readConfig()
  const clients = getClients(config)
  const idx = clients.findIndex(c => c.id === uuid)
  if (idx === -1) { const err = new Error('UUID not found'); err.statusCode = 404; throw err }
  clients.splice(idx, 1)
  writeConfig(config)
  return { removed: true, warning: tryReload() }
}

function syncUsers(uuids) {
  const config = readConfig()
  getClients(config)
  config.inbounds[0].settings.clients = uuids.map(id => ({ id, flow: 'xtls-rprx-vision' }))
  writeConfig(config)
  return { synced: uuids.length, warning: tryReload() }
}

module.exports = { isValidUuid, addUser, removeUser, syncUsers }
CFGEOF

# Write stats collector
cat > "$VPS_API_DIR/xray-stats-collector.js" << 'STATSEOF'
const { execFileSync } = require('node:child_process')

function collectStats() {
  let raw
  try {
    raw = execFileSync('/usr/local/bin/xray', [
      'api', 'statsquery', '--server=127.0.0.1:10085', '-reset'
    ], { encoding: 'utf8', timeout: 5000 })
  } catch (err) {
    return { users: {}, error: 'Failed to query Xray stats API' }
  }

  const stats = {}
  try {
    const parsed = JSON.parse(raw)
    const entries = parsed.stat || []
    for (const entry of entries) {
      const match = entry.name?.match(/^user>>>([^>]+)>>>traffic>>>(uplink|downlink)$/)
      if (!match) continue
      const [, email, dir] = match
      if (!stats[email]) stats[email] = { up: 0, down: 0 }
      stats[email][dir === 'uplink' ? 'up' : 'down'] = parseInt(entry.value || '0', 10)
    }
  } catch {}
  return { users: stats }
}

module.exports = { collectStats }
STATSEOF

# Write server
cat > "$VPS_API_DIR/server.js" << 'SRVEOF'
const https = require('node:https')
const fs = require('node:fs')
const express = require('express')
const authBearer = require('./auth-bearer-middleware')
const { isValidUuid, addUser, removeUser, syncUsers } = require('./xray-config-manager')
const { collectStats } = require('./xray-stats-collector')

const app = express()
app.use(express.json())
app.use(authBearer)

app.post('/users', (req, res) => {
  try {
    const { uuid } = req.body || {}
    if (!uuid || !isValidUuid(uuid)) return res.status(400).json({ error: 'Invalid UUID' })
    res.json({ ok: true, ...addUser(uuid) })
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
})

app.delete('/users/:uuid', (req, res) => {
  try {
    if (!isValidUuid(req.params.uuid)) return res.status(400).json({ error: 'Invalid UUID' })
    res.json({ ok: true, ...removeUser(req.params.uuid) })
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
})

app.get('/stats', (req, res) => {
  try { res.json({ ok: true, ...collectStats() }) }
  catch (err) { res.status(502).json({ error: err.message }) }
})

app.post('/sync', (req, res) => {
  try {
    const { uuids } = req.body || {}
    if (!Array.isArray(uuids) || !uuids.every(isValidUuid))
      return res.status(400).json({ error: 'Invalid uuids array' })
    res.json({ ok: true, ...syncUsers(uuids) })
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message })
  }
})

const port = parseInt(process.env.API_PORT || '8443', 10)
const cert = fs.readFileSync(process.env.TLS_CERT_PATH)
const key = fs.readFileSync(process.env.TLS_KEY_PATH)
https.createServer({ cert, key }, app).listen(port, () => {
  console.log('VeilX API listening on :' + port)
})
SRVEOF

# Install dependencies
cd "$VPS_API_DIR" && npm install --production 2>/dev/null
echo "[OK] VPS API files written to $VPS_API_DIR"

# Systemd unit for VPS API
cat > /etc/systemd/system/veilx-api.service << EOF
[Unit]
Description=VeilX API
After=network-online.target xray.service
Wants=network-online.target

[Service]
Type=simple
EnvironmentFile=/etc/veilx-api.env
WorkingDirectory=${VPS_API_DIR}
ExecStart=/usr/bin/node ${VPS_API_DIR}/server.js
Restart=on-failure
RestartSec=5
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now veilx-api
sleep 2

if systemctl is-active --quiet veilx-api; then
  echo "[OK] VeilX API is running on :${API_PORT}"
else
  echo "[WARN] VeilX API failed to start. Check: journalctl -u veilx-api -n 20"
fi

# ── Final output ─────────────────────────────────
VPS_IP=$(curl -s4 ifconfig.me || hostname -I | awk '{print $1}')

VLESS_LINK="vless://${TEST_UUID}@${VPS_IP}:443?encryption=none&flow=xtls-rprx-vision&type=tcp&security=reality&sni=${REALITY_SNI}&fp=chrome&pbk=${PUBLIC_KEY}&sid=${SHORT_ID}#VeilX"

echo ""
echo "============================================"
echo "  ALL DONE! Save these values:"
echo "============================================"
echo ""
echo "── For .env.local (Vercel) ──"
echo ""
echo "VPS_IP=${VPS_IP}"
echo "VPS_API_URL=https://${VPS_IP}:${API_PORT}"
echo "VPS_API_TOKEN=${VPS_API_TOKEN}"
echo "REALITY_PUBLIC_KEY=${PUBLIC_KEY}"
echo "REALITY_SHORT_ID=${SHORT_ID}"
echo "REALITY_SNI=${REALITY_SNI}"
echo "JWT_SECRET=$(openssl rand -hex 32)"
echo "CRON_SECRET=$(openssl rand -hex 32)"
echo ""
echo "── Test VLESS link (paste into Streisand) ──"
echo ""
echo "${VLESS_LINK}"
echo ""
echo "── Verify ──"
echo ""
echo "  Xray:     systemctl status xray"
echo "  VPS API:  curl -sk https://localhost:${API_PORT}/stats -H 'Authorization: Bearer ${VPS_API_TOKEN}'"
echo "  Port 443: ss -tlnp | grep 443"
echo "  Logs:     journalctl -u xray -f"
echo ""
echo "============================================"

#!/usr/bin/env bash
# VeilX Phase 1 — Xray-core setup on VPS (Ubuntu/Debian)
# Run as root on the target VPS via SSH.
#
# What this script does:
#   1. System update + UFW firewall (22, 443, 8443)
#   2. Download & install latest Xray-core
#   3. Generate Reality keypair + short ID
#   4. Write Xray config from template (empty clients[])
#   5. Install systemd unit + start Xray
#
# Usage:
#   scp vps-setup-xray-phase1.sh xray-config-template-vless-reality-stats.json root@VPS_IP:/tmp/
#   ssh root@VPS_IP 'bash /tmp/vps-setup-xray-phase1.sh'
#
# After running, save the printed REALITY_PUBLIC_KEY and REALITY_SHORT_ID
# into your Vercel env vars.

set -euo pipefail

XRAY_BIN="/usr/local/bin/xray"
XRAY_CONFIG_DIR="/usr/local/etc/xray"
XRAY_CONFIG="$XRAY_CONFIG_DIR/config.json"
TEMPLATE="/tmp/xray-config-template-vless-reality-stats.json"
REALITY_SNI="dl.google.com"

echo "=== 1/5 System update + UFW ==="
export DEBIAN_FRONTEND=noninteractive
export NEEDRESTART_MODE=a
apt-get update && apt-get upgrade -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold"
apt-get install -y unzip curl ufw

ufw allow 22/tcp
ufw allow 443/tcp
ufw allow 8443/tcp
ufw --force enable
echo "[OK] UFW enabled: 22, 443, 8443"

echo "=== 2/5 Install Xray-core ==="
XRAY_VERSION=$(curl -s https://api.github.com/repos/XTLS/Xray-core/releases/latest | grep '"tag_name"' | cut -d'"' -f4)
ARCH=$(uname -m)
case "$ARCH" in
  x86_64)  XRAY_ARCH="64" ;;
  aarch64) XRAY_ARCH="arm64-v8a" ;;
  *)       echo "Unsupported arch: $ARCH"; exit 1 ;;
esac

XRAY_URL="https://github.com/XTLS/Xray-core/releases/download/${XRAY_VERSION}/Xray-linux-${XRAY_ARCH}.zip"
echo "Downloading $XRAY_URL"
curl -fSL -o /tmp/xray.zip "$XRAY_URL"
curl -fSL -o /tmp/xray.zip.dgst "${XRAY_URL}.dgst"
EXPECTED=$(grep 'SHA2-256' /tmp/xray.zip.dgst | awk '{print $NF}')
ACTUAL=$(sha256sum /tmp/xray.zip | awk '{print $1}')
if [ "$EXPECTED" != "$ACTUAL" ]; then
  echo "FATAL: SHA256 mismatch. Expected $EXPECTED, got $ACTUAL"
  rm -f /tmp/xray.zip /tmp/xray.zip.dgst
  exit 1
fi
echo "[OK] SHA256 verified"
mkdir -p "$XRAY_CONFIG_DIR"
unzip -o /tmp/xray.zip xray -d /usr/local/bin/
chmod +x "$XRAY_BIN"
rm -f /tmp/xray.zip /tmp/xray.zip.dgst
echo "[OK] Xray ${XRAY_VERSION} installed"

echo "=== 3/5 Generate Reality keys + short ID ==="
KEYS=$("$XRAY_BIN" x25519)
PRIVATE_KEY=$(echo "$KEYS" | grep 'Private' | awk '{print $NF}')
PUBLIC_KEY=$(echo "$KEYS" | grep 'Public' | awk '{print $NF}')
SHORT_ID=$(openssl rand -hex 4)

echo "=== 4/5 Write Xray config ==="
if [ ! -f "$TEMPLATE" ]; then
  echo "ERROR: Template not found at $TEMPLATE"
  echo "Copy xray-config-template-vless-reality-stats.json to /tmp/ first."
  exit 1
fi

sed \
  -e "s|REALITY_PRIVATE_KEY|${PRIVATE_KEY}|g" \
  -e "s|REALITY_SNI|${REALITY_SNI}|g" \
  -e "s|REALITY_SHORT_ID|${SHORT_ID}|g" \
  "$TEMPLATE" > "$XRAY_CONFIG"
chmod 600 "$XRAY_CONFIG"

echo "[OK] Config written to $XRAY_CONFIG (mode 600)"

echo "=== 5/5 Systemd unit ==="
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
StartLimitBurst=3
StartLimitIntervalSec=60
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now xray
sleep 2

if systemctl is-active --quiet xray; then
  echo "[OK] Xray is running"
else
  echo "[FAIL] Xray failed to start. Check: journalctl -u xray -n 30"
  exit 1
fi

echo ""
echo "=========================================="
echo "  Phase 1 complete. Save these values:"
echo "=========================================="
echo ""
echo "  REALITY_PUBLIC_KEY=${PUBLIC_KEY}"
echo "  REALITY_SHORT_ID=${SHORT_ID}"
echo "  REALITY_SNI=${REALITY_SNI}"
echo ""
echo "  Add them to Vercel env vars + .env.local"
echo "=========================================="
echo ""
echo "Verify: ss -tlnp | grep 443"
echo "Logs:   journalctl -u xray -f"

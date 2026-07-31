#!/bin/bash
# B2B LinkedIn Contact Extractor - One-Click Setup
# Run: chmod +x SETUP.sh && ./SETUP.sh

set -e
echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║  B2B LinkedIn Contact Extractor v4.0        ║"
echo "║  One-Click Setup & Run                       ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# 1. Install dependencies
echo "[1/4] Installing dependencies..."
npm install --silent 2>/dev/null || npm install

# 2. Generate Prisma client
echo "[2/4] Setting up database..."
npx prisma generate --schema=prisma/schema.prisma 2>/dev/null
npx prisma db push --schema=prisma/schema.prisma 2>/dev/null || true

# 3. Build
echo "[3/4] Building production bundle..."
npx next build

# 4. Start
echo "[4/4] Starting server on http://localhost:3000 ..."
echo ""
echo "  ✅ Open http://localhost:3000 in your browser"
echo "  ✅ Press Ctrl+C to stop"
echo ""
node .next/standalone/server.js -p 3000
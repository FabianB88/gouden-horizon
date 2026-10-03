#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
if ! command -v node >/dev/null; then
  echo 'Install Node.js 22 or newer from https://nodejs.org, then start again.'
  exit 1
fi
if [ ! -f node_modules/ws/package.json ]; then npm ci --omit=dev; fi
npm run lan

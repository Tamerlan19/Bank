#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR"
docker-compose up -d db

cd "$ROOT_DIR/backend"
yarn install
yarn db:setup

cd "$ROOT_DIR/bank-app"
yarn install

echo "Bootstrap completed."
echo "Start backend:  $ROOT_DIR/scripts/start-backend.sh"
echo "Start frontend: $ROOT_DIR/scripts/start-frontend.sh"

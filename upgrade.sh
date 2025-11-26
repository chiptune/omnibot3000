#!/bin/bash
clear

PNPM_PIDS=$(pgrep -f "pnpm")

if [ ! -z "$PNPM_PIDS" ]; then
    pkill -TERM -f "pnpm"
    sleep 2
    REMAINING_PIDS=$(pgrep -f "pnpm")
    if [ ! -z "$REMAINING_PIDS" ]; then
        pkill -KILL -f "pnpm"
        sleep 1
    fi
fi

if [ -d "node_modules" ]; then
  rm -rf node_modules
fi
timeout 10s pnpm self-update
pnpm up --latest

echo

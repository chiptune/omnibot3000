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

NODE_PIDS=$(pgrep -f "server.ts")

if [ ! -z "$NODE_PIDS" ]; then
    pkill -TERM -f "server.ts"
    sleep 2
    REMAINING_NODE_PIDS=$(pgrep -f "server.ts")
    if [ ! -z "$REMAINING_NODE_PIDS" ]; then
        pkill -KILL -f "server.ts"
        sleep 1
    fi
fi

if [ -d "node_modules" ]; then
    rm -rf node_modules
fi

if [ -f ".env" ]; then
    NPMJS_TOKEN=$(grep -v '^#' .env | grep '^NPMJS_TOKEN=' | cut -d '=' -f2-)
    export NPMJS_TOKEN
fi

timeout 10s pnpm self-update
pnpm up --latest

echo

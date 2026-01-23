#!/bin/bash

# FlowPay Development Start Script
# Runs backend, frontend, and telegram bot concurrently

echo "🚀 Starting FlowPay Development Environment..."
echo ""

# Check if required directories exist
if [ ! -d "backend" ] || [ ! -d "frontend" ] || [ ! -d "telegram-bot" ]; then
    echo "❌ Error: Required directories not found."
    echo "Make sure you're running this from the FlowPay root directory."
    exit 1
fi

# Detect package manager
detect_package_manager() {
    if command -v pnpm &> /dev/null && [ -f "$1/pnpm-lock.yaml" ]; then
        echo "pnpm"
    elif command -v npm &> /dev/null; then
        echo "npm"
    else
        echo "npm"
    fi
}

# Check if node_modules exist
echo "📦 Checking dependencies..."

BACKEND_PM=$(detect_package_manager "backend")
FRONTEND_PM=$(detect_package_manager "frontend")
TELEGRAM_PM=$(detect_package_manager "telegram-bot")

if [ ! -d "backend/node_modules" ]; then
    echo "⚠️  Backend dependencies not installed. Running $BACKEND_PM install..."
    cd backend && $BACKEND_PM install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "⚠️  Frontend dependencies not installed. Running $FRONTEND_PM install..."
    cd frontend && $FRONTEND_PM install && cd ..
fi

if [ ! -d "telegram-bot/node_modules" ]; then
    echo "⚠️  Telegram bot dependencies not installed. Running $TELEGRAM_PM install..."
    cd telegram-bot && $TELEGRAM_PM install && cd ..
fi

echo ""
echo "✅ All dependencies installed!"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down all services..."
    kill 0
    exit 0
}

# Trap CTRL+C and call cleanup
trap cleanup SIGINT SIGTERM

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Starting all services..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Backend:      http://localhost:3000"
echo "🌐 Frontend:     http://localhost:5173"
echo "🤖 Telegram Bot: Running in background"
echo ""
echo "Press CTRL+C to stop all services"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start backend in background
(
    cd backend
    echo "[Backend] Starting NestJS server..."
    $BACKEND_PM run dev 2>&1 | while IFS= read -r line; do
        echo "[Backend] $line"
    done
) &

# Start frontend in background
(
    cd frontend
    echo "[Frontend] Starting Vite dev server..."
    $FRONTEND_PM run dev 2>&1 | while IFS= read -r line; do
        echo "[Frontend] $line"
    done
) &

# Start telegram bot in background
(
    cd telegram-bot
    echo "[Telegram] Starting bot..."
    $TELEGRAM_PM run dev 2>&1 | while IFS= read -r line; do
        echo "[Telegram] $line"
    done
) &

# Wait for all background processes
wait

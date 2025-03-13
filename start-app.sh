#!/bin/bash

# Kill any existing Next.js processes
echo "Stopping any running Next.js processes..."
pkill -f "next dev" || true

# Clear any port conflicts
for port in 3000 3001 3002 3003 3004 3005; do
  pid=$(lsof -t -i:$port)
  if [ ! -z "$pid" ]; then
    echo "Killing process on port $port (PID: $pid)"
    kill -9 $pid || true
  fi
done

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "Creating .env.local file..."
  echo "XAI_API_KEY=your-api-key-here" > .env.local
  echo "Please edit .env.local to add your actual API key"
fi

# Start the application
echo "Starting the application..."
npm run dev

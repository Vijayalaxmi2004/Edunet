#!/bin/bash

echo "Installing backend dependencies..."
cd backend
npm install
node src/initDatabase.js

echo "Installing frontend dependencies..."
cd ../client
npm install

echo "Setup complete!"
echo ""
echo "To start development:"
echo "  Backend:  cd backend && npm start"
echo "  Frontend: cd client && npm start"
echo ""
echo "Or use Docker Compose:"
echo "  docker-compose up"

# Build the React frontend
FROM node:18-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client ./
RUN npm run build

# Build the backend and copy the frontend build
FROM node:18-alpine AS backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --production
COPY backend ./
COPY --from=client-build /app/client/build ./client/build

EXPOSE 5000
CMD ["node", "src/server.js"]

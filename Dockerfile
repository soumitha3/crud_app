# Use Node LTS
FROM node:18-alpine

# App folder
WORKDIR /usr/src/app

# Copy package files and install (production)
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production

# Copy app
COPY backend ./backend
COPY frontend ./frontend

# Run from backend folder
WORKDIR /usr/src/app/backend
EXPOSE 3000

CMD ["node", "server.js"]

# ------------------------------------                                                                                                                                                                             
# Stage 1 — Build the application                                                                                                                                                                                  
# ------------------------------------
FROM node:22.21.1-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN yarn install

COPY . .
RUN yarn build:web


# ------------------------------------
# Stage 2 — Serve using Node.js
# ------------------------------------
FROM node:22.21.1-alpine

WORKDIR /app

# Copy the built dist folder from builder stage
COPY --from=builder /app/dist ./dist

# Copy the custom server.js file
COPY --from=builder /app/server.js ./server.js

EXPOSE 3000

# Use custom Node.js server instead of serve package
# This ensures proper SPA routing support
CMD ["node", "server.js"]
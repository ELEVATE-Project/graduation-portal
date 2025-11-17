# ------------------------------------
# Stage 1 — Build the application
# ------------------------------------
FROM node:22.21.1-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build:web
# ------------------------------------
# Stage 2 — Serve using NGINX
# ------------------------------------
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

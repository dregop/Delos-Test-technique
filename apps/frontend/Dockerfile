# Base image
FROM node:23-slim

# Create app directory
WORKDIR /app

# Install deps
COPY ../../pnpm-lock.yaml ../../pnpm-workspace.yaml ./
COPY ../../apps/frontend ./apps/frontend
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Build
WORKDIR /app/apps/frontend
RUN pnpm build

# Start app
EXPOSE 3000
CMD ["pnpm", "start"]

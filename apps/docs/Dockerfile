# Multi-stage build for Websmith Kit Documentation
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY apps/docs/package.json ./package.json
COPY package.json package-lock.json ./

# Install dependencies (skip prepare script)
RUN npm ci --omit=dev --ignore-scripts

# Build stage
FROM base AS builder
WORKDIR /app

# Copy package files and install all dependencies for building
COPY apps/docs/package.json ./apps/docs/package.json
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Copy docs app source
COPY apps/docs ./apps/docs

# Build the docs app
RUN cd apps/docs && npm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the built application
COPY --from=builder --chown=nextjs:nodejs /app/apps/docs/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/docs/.next/static ./apps/docs/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/docs/public ./apps/docs/public

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
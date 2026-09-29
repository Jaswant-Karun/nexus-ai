# Multi-stage production build for NEXUS AI Web App
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app

# Install standard Alpine compatibility library
RUN apk add --no-cache libc6-compat

# Copy workspace configuration and shared tsconfig
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json tsconfig.base.json global.d.ts* ./
COPY packages ./packages
COPY apps/web ./apps/web

# Install all workspace dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma Client and build production assets
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN pnpm --filter @nexus-ai/web build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Copy built workspace
COPY --from=builder /app /app

EXPOSE 3000

CMD ["pnpm", "--filter", "@nexus-ai/web", "start"]

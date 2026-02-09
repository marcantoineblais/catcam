FROM node:20-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_DOMAIN_NAME
ENV NEXT_PUBLIC_DOMAIN_NAME=$NEXT_PUBLIC_DOMAIN_NAME

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Standalone output is self-contained; no npm ci needed
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Env file for runtime (SERVER_URL, DOMAIN_NAME, etc.)
COPY stack.env .env

CMD ["node", "server.js"]

FROM node:24-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.30.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# ------- Dependencies -------
FROM base AS deps
RUN pnpm install --frozen-lockfile

# ------- Build -------
FROM deps AS build
COPY . .
# Ensure prisma client is generated before build
RUN pnpm prisma generate && pnpm run build

# ------- Production -------
FROM base AS production
COPY package.json pnpm-lock.yaml ./
# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

COPY --from=build /app/dist ./dist
COPY --from=build /app/src/generated ./dist/generated
# Also need the prisma schema for runtime if needed by the adapter? 
# Usually just the generated client is enough, but some adapters need the engine or more.
COPY --from=build /app/prisma ./prisma

EXPOSE 8080

CMD ["node", "dist/index.js"]


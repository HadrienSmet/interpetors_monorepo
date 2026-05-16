# ─── Builder ──────────────────────────────────────────────────────────────────
FROM node:22-slim AS builder

# python3/make/g++ : compilation native d'argon2
# openssl          : génération du binaire Prisma engine
RUN apt-get update \
    && apt-get install -y python3 make g++ openssl \
    && rm -rf /var/lib/apt/lists/*

# Active la version pnpm déclarée dans package.json#packageManager
RUN corepack enable

WORKDIR /app

# Manifests workspace — copiés en premier pour profiter du cache Docker sur l'install
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Requis par packages/types/tsconfig.json ("extends": "../../tsconfig.base.json")
COPY tsconfig.base.json ./

# Package partagé — dist/ exclu via .dockerignore, reconstruit ci-dessous
COPY packages/types/ ./packages/types/

# Application serveur (source + config + schéma Prisma)
COPY apps/server/ ./apps/server/

# Installation de toutes les dépendances (dev + prod)
RUN pnpm install --frozen-lockfile

# Compilation de @repo/types depuis les sources
# typescript est une devDep racine → node_modules/.bin/tsc disponible après install
RUN node_modules/.bin/tsc -b packages/types/tsconfig.json

# Génération du client Prisma pour Linux
# binaryTarget "native" = Debian Bookworm sur node:22-slim, compatible avec le runner
RUN pnpm --filter app-server exec prisma generate

# Compilation NestJS → apps/server/dist/
RUN pnpm --filter app-server build

# ─── Migrator — image dédiée aux migrations Prisma ────────────────────────────
# Utilise le builder complet (avec devDeps) pour avoir accès au CLI prisma.
#
# Build :  docker build --target migrator -t leonor-migrator -f apps/server/Dockerfile .
# Exécution avant chaque déploiement avec changements de schéma :
#          docker run --rm -e DATABASE_URL=<url-prod> leonor-migrator
FROM builder AS migrator
WORKDIR /app/apps/server
CMD ["node_modules/.bin/prisma", "migrate", "deploy"]

# ─── Pruned — builder sans les devDependencies ────────────────────────────────
FROM builder AS pruned
ENV CI=true
RUN pnpm prune --prod

# ─── Runner ───────────────────────────────────────────────────────────────────
FROM node:22-slim AS runner

# Le binaire Prisma engine lie contre libssl au runtime
RUN apt-get update \
    && apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Manifests workspace (pour la résolution des symlinks pnpm dans node_modules)
COPY pnpm-workspace.yaml package.json ./

# Shared types : package.json stub + dist compilé
# Nécessaire car node_modules/@repo/types → packages/types (symlink pnpm workspace)
COPY packages/types/package.json ./packages/types/
COPY --from=pruned /app/packages/types/dist ./packages/types/dist

# Manifest du serveur (pour la résolution des modules Node)
COPY apps/server/package.json ./apps/server/

# node_modules de production depuis pruned (sans devDeps, binaires natifs compilés pour Linux)
COPY --from=pruned /app/node_modules ./node_modules

# Output compilé NestJS
COPY --from=pruned /app/apps/server/dist ./apps/server/dist

# Schéma Prisma + migrations (présents pour référence ; migrations via image migrator)
COPY --from=pruned /app/apps/server/prisma ./apps/server/prisma

ENV NODE_ENV=production
WORKDIR /app/apps/server

# Utilisateur non-root fourni par l'image node:22-slim (uid=1000)
# Les fichiers copiés sont 644/755 (world-readable), pas de chown nécessaire
USER node

EXPOSE 3000
CMD ["node", "dist/main.js"]

# Development Dockerfile - No build required
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install all dependencies (including dev dependencies for development)
RUN yarn install --frozen-lockfile

# Copy application source
COPY . .

# Set dummy DATABASE_URL for Prisma Client generation
ENV DATABASE_URL="postgresql://dummy:dummy@dummy:5432/dummy?schema=public"

# Generate Prisma Client
RUN npx prisma generate --schema prisma/schema_merged.prisma

# Expose port
EXPOSE 3000

# Development mode - uses ts-node via NestJS
CMD ["yarn", "start:dev"]

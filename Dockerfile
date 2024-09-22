### Build stage
FROM node:20.11 AS builder

# Create app directory
WORKDIR /app

# Install bun (to run bun scripts)
RUN npm i -g bun

# Install app dependencies
COPY package*.json yarn.lock .npmrc ./
RUN yarn install

# Copy app source
COPY . .

# Install git
RUN apt-get update && apt-get install -y git

# Init components submodules (Should be done by coolify automatically)
# RUN git submodule update --init --recursive --remote

# Run necessary scripts
RUN yarn zenstack:generate

# Build app
RUN yarn build


### Production stage
FROM node:20.11

# Create app directory
WORKDIR /usr/src/app

# Prepare directories for files and logs
RUN mkdir -p files/avatars logs errors

# Copy built assets from the builder stage
COPY --from=builder /app/.env /.env
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules

# Expose the port the app runs on
EXPOSE 3000

# Start the app after waiting for the database to be ready
CMD node .output/server/index.mjs

# Use the official Node.js 22 Alpine lightweight base image for security and speed
FROM node:22-alpine

# Set environment variable to production mode to optimize dependencies and runtime performance
ENV NODE_ENV=production

# Set the working directory inside the container for all subsequent commands
WORKDIR /app

# Copy package.json and package-lock.json first to maximize Docker layer caching efficiency
# Set ownership to the non-root 'node' user for security best practices
COPY --chown=node:node package*.json ./

# Install only production dependencies cleanly using 'npm ci' to guarantee deterministic builds
RUN npm ci --only=production

# Copy the rest of the backend application source code into the container
# Ensure all files are owned by the non-root 'node' user
COPY --chown=node:node . .

# Switch from root user to the non-privileged 'node' user provided by Node Alpine image for security
USER node

# Document that the application listens on port 5000 inside the container
EXPOSE 5000

# Exec form CMD to launch the server directly with Node, ensuring proper OS signal forwarding (SIGTERM/SIGINT)
CMD ["node", "server.js"]

# ==============================================================================
# Stage 1: Build Stage
# ==============================================================================
# Use official Node.js 22 Alpine image as the builder stage
FROM node:22-alpine AS build

# Set the working directory inside the container for the build stage
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker layer caching
COPY package*.json ./

# Install all dependencies (including devDependencies required by Vite to build the app)
RUN npm ci

# Copy the rest of the application source code into the container
COPY . .

# Execute Vite build script to generate production-ready bundle in /app/dist
RUN npm run build

# ==============================================================================
# Stage 2: Production Serving Stage
# ==============================================================================
# Use lightweight Nginx Alpine base image for serving static production assets
FROM nginx:alpine

# Copy custom Nginx configuration to handle SPA client-side routing and performance
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from the build stage into Nginx's default public HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to receive web traffic
EXPOSE 80

# Run Nginx in the foreground to keep the container active and enable process monitoring
CMD ["nginx", "-g", "daemon off;"]

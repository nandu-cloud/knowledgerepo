# Base image
FROM node:12.18.3-alpine3.9 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json .

# Install dependencies
RUN npm install --force

# Copy the application
COPY . .

# Build the application
RUN npm run build --prod

# Create the final image
FROM nginx:1.19.8-alpine

# Copy the build artifacts to the nginx directory
COPY --from=builder /app/dist/* /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

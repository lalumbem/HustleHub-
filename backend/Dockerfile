
FROM node:20-alpine

# Set the application directory
WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source code
COPY --chown=node:node src ./src

# Run as a non-root user
USER node

# Backend HTTPS port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

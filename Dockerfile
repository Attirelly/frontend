# Use official Node.js image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy everything
COPY . .

# Install dependencies
RUN npm install

# Disable linting to bypass build errors
# ENV NEXT_DISABLE_ESLINT=true

# Build the app for production
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
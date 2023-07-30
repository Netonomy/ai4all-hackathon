# Base Image
FROM node:18.16.0

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
# RUN npm ci --only=production
RUN npm install --legacy-peer-deps

# Bundle app source
COPY . .    

# Build the Next.js application
RUN npm run build

# Expose the port the app runs in
EXPOSE 3300

# Serve the app
CMD ["npm", "start"]

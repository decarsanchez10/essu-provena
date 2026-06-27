FROM node:22-alpine

WORKDIR /app

COPY package*.json quasar.config.js .quasarrc.json* ./

RUN npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm install -g @quasar/cli && \
    npm install --legacy-peer-deps --ignore-scripts

COPY . .

# Accept and expose build args as env vars
ARG VITE_API_BASE_URL=http://localhost:8000
ARG VITE_WALLETCONNECT_PROJECT_ID
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_WALLETCONNECT_PROJECT_ID=$VITE_WALLETCONNECT_PROJECT_ID

EXPOSE 9000
CMD ["quasar", "dev", "--port", "9000", "--hostname", "0.0.0.0"]
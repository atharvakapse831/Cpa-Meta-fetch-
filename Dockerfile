FROM node:18-slim

# Install Python + pip for yt-dlp, plus ffmpeg (yt-dlp uses it for merging streams)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    ffmpeg \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp
RUN pip3 install --no-cache-dir --break-system-packages yt-dlp

WORKDIR /app

# Install Node deps first (better layer caching)
COPY package.json yarn.lock* package-lock.json* ./
RUN if [ -f yarn.lock ]; then yarn install --production; else npm install --omit=dev; fi

# Copy source
COPY . .

ENV NODE_ENV=production
ENV PORT=4001

EXPOSE 4001

CMD ["node", "src/server.js"]
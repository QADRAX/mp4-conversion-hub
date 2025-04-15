FROM node:22-bookworm AS builder

WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM node:22-bookworm

RUN apt-get update && \
    apt-get install -y ffmpeg clamav && \
    freshclam && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN useradd --create-home --shell /bin/bash appuser
RUN mkdir -p /input /output && \
    chown -R appuser:appuser /input /output

USER appuser

WORKDIR /home/appuser/app
COPY --from=builder /app .

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/api/healthcheck || exit 1

ENTRYPOINT ["node"]
CMD ["packages/app/dist/index.js"]
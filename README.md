<p align="center">
  <img src="./logo.png" alt="MP4 Conversion Hub logo" width="400"/>
</p>

[![OSV-Scanner](https://github.com/QADRAX/mp4-conversion-hub/actions/workflows/osv-scanner.yaml/badge.svg?branch=main)](https://github.com/QADRAX/mp4-conversion-hub/actions/workflows/osv-scanner.yaml)
[![CI Build](https://github.com/QADRAX/mp4-conversion-hub/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/QADRAX/mp4-conversion-hub/actions/workflows/ci.yml)

# MP4 Conversion Hub

A lightweight, Dockerized media processing hub designed for home servers like [CasaOS](https://www.casaos.io/). It watches folders, scans files for viruses using ClamAV, and converts videos to MP4 format with FFmpeg. Includes a web UI for monitoring, uploading, and managing jobs.

## Why MP4 Conversion Hub?

MP4 Conversion Hub is an ideal tool for home media servers where families or groups of friends want to share and consume video content easily.

Whether you're running Jellyfin, Plex, or a custom file server, one of the main challenges is ensuring that videos are in a format that can be streamed efficiently and organized properly for direct playback. That’s where MP4 Conversion Hub fits in.

MP4 Conversion Hub automatically:
- Converts videos to MP4 format if needed (or copies if already MP4).
- Scans files with ClamAV antivirus before processing.
- Extracts metadata using AI (Gemini + TMDB) for smart organization.
- Sorts files into a **Jellyfin-friendly folder structure**:
  - Movies → `/movies/{movie title}/{movie title}.mp4`
  - TV Shows → `/series/{series title}/season {season}/{series title}.S{season}E{episode}.mp4`
- Generates `.nfo` files and poster images automatically for Jellyfin metadata scraping.
- Sends a webhook notification after processing each file.

MP4 Conversion Hub is Dockerized and designed to work seamlessly with other containers by sharing volumes.

On a home server setup (e.g., CasaOS, Portainer, or manual Docker Compose), it's easy to:

* Mount a common input folder from your SFTP server (where users drop videos).
* Let MP4 Conversion Hub scan and process the files into a structured output.
* Point Jellyfin directly to the output folder to serve perfectly organized and optimized content to all users.

```
# Example folder structure after processing:
📂 input        # Shared with SFTP and MP4 Hub (input files go here)
📂 output       # Shared with Jellyfin and MP4 Hub
    📂 movies
    └── 📂 Gladiator (2000)
        📄 Gladiator (2000).mp4
        📄 Gladiator (2000).nfo
        📄 Gladiator (2000)-poster.jpg
    📂 series
    └── 📂 Breaking Bad
        📄 tvshow.nfo                     # Metadata for the entire series
        📄 poster.jpg                     # Poster for the entire series
        📂 Season 01
            📄 season01.nfo               # Metadata for Season 1
            📄 season01-poster.jpg        # Poster for Season 1
            📄 BreakingBad.S01E01.mp4
            📄 BreakingBad.S01E01.nfo      # Metadata for Episode 1
            📄 BreakingBad.S01E01-poster.jpg  # Poster for Episode 1
            📄 BreakingBad.S01E02.mp4
            📄 BreakingBad.S01E02.nfo
            📄 BreakingBad.S01E02-poster.jpg
        📂 Season 02
            📄 season02.nfo
            📄 season02-poster.jpg
            📄 BreakingBad.S02E01.mp4
            📄 BreakingBad.S02E01.nfo
            📄 BreakingBad.S02E01-poster.jpg
```

## 🚀 Features

- 📂 **Active folder watching** – Monitors input folders for new video files  
- 🛡️ **ClamAV virus scanning** – Every file is scanned before conversion  
- 🎞️ **MP4 conversion** – Uses customizable FFmpeg presets and CRF  
- 🌐 **Web UI** – Monitor progress, upload files, and browse history  
- 🔒 **Basic authentication** – Secures the interface with credentials  
- 🐳 **Optimized for Docker** – Ideal for CasaOS, Portainer, or any home server  
- 🚫 **Rate limiting** – Prevents abuse from uploads or logins  
- 🤖 **AI-powered metadata enrichment** – Uses Gemini and TMDB to classify videos and generate `.nfo` metadata files automatically  
- 🔔 **Webhook support** – Send processing results to your own endpoints via `WEBHOOK_URL`  
- 🔄 **Automatic ClamAV database updates** – Runs daily antivirus definition updates

## 📦 Installation (Docker)

### Option 1: Pull from Docker Hub

```bash
docker pull qadraxdev/mp4-conversion-hub:latest
```

### Option 2: With `docker-compose`

```yml
services:
  mp4-conversion-hub:
    image: qadraxdev/mp4-conversion-hub:latest
    cpus: 2
    mem_limit: 1g
    ports:
      - "3000:3000"
    volumes:
      - ./input:/input
      - ./output:/output
    environment:
      TRUST_PROXY: false
      CONCURRENCY: 1
      VIDEO_ENCODING_PRESET: ultrafast
      VIDEO_CRF: 28
      ADMIN_USER: admin
      ADMIN_PASSWORD: changeme
      CORS_ALLOWED_ORIGINS: "*"
      UPLOAD_RATE_LIMIT_MAX_ATTEMPTS: 5
      UPLOAD_RATE_LIMIT_COOLDOWN_MINUTES: 1
      UPLOAD_SIZE_LIMIT_MB: 3000
      AUTH_RATE_LIMIT_MAX_ATTEMPTS: 3
      AUTH_RATE_LIMIT_COOLDOWN_MINUTES: 5
      GENERAL_RATE_LIMIT_MAX_ATTEMPTS: 100
      GENERAL_RATE_LIMIT_COOLDOWN_MINUTES: 1
      GEMINI_API_KEY: your-gemini-api-key
      TMDB_API_KEY: your-tmdb-api-key
      GEMINI_MODEL: gemini-2.0-flash
      LANGUAGE: es-ES
      WEBHOOK_URL: https://your-service.com/webhook-endpoint
      DAILY_TASK_CRON: "0 2 * * *"
      DAILY_TASK_TIMEZONE: "UTC"
```

## ⚙️ Environment Variables

| Variable                              | Default     | Description                                                                                   |
|---------------------------------------|-------------|-----------------------------------------------------------------------------------------------|
| `TRUST_PROXY`                         | `false`     | Enables proxy trust for proper IP, protocol, and secure cookie handling. Avoid using `true` directly in production. Instead, specify the IP or CIDR of your reverse proxy (e.g., `192.168.1.1`, `192.168.1.0/24`, or `loopback`). |
| `CONCURRENCY`                         | `1`         | Maximum number of video conversion jobs to run at the same time. Increase to use more CPU/RAM. |
| `VIDEO_ENCODING_PRESET`              | `ultrafast` | FFmpeg encoding preset. Valid options: `ultrafast`, `superfast`, `fast`, `medium`, `slow`, etc. |
| `VIDEO_CRF`                           | `28`        | Constant Rate Factor: lower = higher quality. Range: 0–51. Recommended: 23–28.                |
| `ADMIN_USER`                          | `admin`     | Username for accessing the web interface.                                                     |
| `ADMIN_PASSWORD`                      | `changeme`  | Password for the web interface. Change it in production!                                      |
| `CORS_ALLOWED_ORIGINS`               | `*`         | Comma-separated origins allowed for CORS. Use `*` to allow all.                              |
| `UPLOAD_SIZE_LIMIT_MB`               | `3000`      | Maximum file size allowed for uploads (in megabytes).                                        |
| `UPLOAD_RATE_LIMIT_MAX_ATTEMPTS`     | `5`         | Number of upload requests allowed before cooldown applies.                                   |
| `UPLOAD_RATE_LIMIT_COOLDOWN_MINUTES` | `1`         | Cooldown duration (in minutes) after reaching upload limit.                                  |
| `AUTH_RATE_LIMIT_MAX_ATTEMPTS`       | `3`         | Max failed login attempts before cooldown.                                                   |
| `AUTH_RATE_LIMIT_COOLDOWN_MINUTES`   | `5`         | Login cooldown period after failed attempts.                                                 |
| `GENERAL_RATE_LIMIT_MAX_ATTEMPTS`    | `100`       | General API request limit per IP.                                                            |
| `GENERAL_RATE_LIMIT_COOLDOWN_MINUTES`| `1`         | Cooldown duration once general rate limit is hit.                                            |
| `GEMINI_API_KEY`                     | –           | API key for Google Gemini LLM. Required for AI-based classification and metadata.            |
| `TMDB_API_KEY`                       | –           | API key for The Movie Database. Used to enrich metadata.                                     |
| `GEMINI_MODEL`                       | `gemini-2.0-flash` | Gemini model to use. Valid options include `gemini-1.5-pro`, `gemini-2.0-pro`, etc.       |
| `LANGUAGE`                           | `en-US`     | Preferred language for metadata from TMDB and Gemini.                                        |
| `WEBHOOK_URL`                        | –           | Optional URL to receive POST requests with detailed processing job summaries. |
| `DAILY_TASK_CRON`                    | `0 2 * * *` | Cron expression defining when the ClamAV DB update should run. |
| `DAILY_TASK_TIMEZONE`                | `UTC`       | Timezone to use for the scheduled update task (e.g. `Europe/Madrid`, `America/New_York`). |

## 🌐 Web UI

The MP4 Conversion Hub includes a built-in web interface that runs on port 3000 inside the container.
After launching the container, access the web UI:

```
http://localhost:3000
```

Use the credentials from your `.env` file to log in.

## 📚 More Info

🔗 [Configuration Reference — GitHub Wiki](https://github.com/QADRAX/mp4-conversion-hub/wiki/Configuration-Reference)  

🔗 [Install MP4 Conversion Hub on CasaOS — GitHub Wiki](https://github.com/QADRAX/mp4-conversion-hub/wiki/Install-MP4-Conversion-Hub-on-CasaOS)  

🔗 [Webhook Payload Specification — GitHub Wiki](https://github.com/QADRAX/mp4-conversion-hub/wiki/Webhook-Payload-Specification)

🔗 [AI-Powered Metadata Enrichment — GitHub Wiki](https://github.com/QADRAX/mp4-conversion-hub/wiki/AI%E2%80%90Powered-Metadata-Enrichment)

## 📜 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a full list of changes.

## 📄 License

[MIT](./LICENSE)
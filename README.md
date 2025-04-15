# MP4 Conversion Hub

A lightweight, Dockerized media processing hub designed for home servers like [CasaOS](https://www.casaos.io/). It watches folders, scans files for viruses using ClamAV, and converts videos to MP4 format with FFmpeg. Includes a web UI for monitoring, uploading, and managing jobs.

---

## ❓ Why MP4 Conversion Hub?

MP4 Conversion Hub is an ideal tool for home media servers where families or groups of friends want to share and consume video content easily.

Whether you're running Jellyfin, Plex, or a custom file server, one of the main challenges is ensuring that videos are in a format that can be streamed efficiently and universally. That’s where MP4 Conversion Hub fits in.

MP4 Conversion Hub is Dockerized and designed to work seamlessly with other containers by sharing volumes. On a home server setup (e.g., CasaOS, Portainer, or manual Docker Compose), it's easy to:

* Mount a common input folder from your SFTP server (where users drop videos).

* Let MP4 Conversion Hub scan and convert those files to MP4 in a shared output folder.

* Point Jellyfin directly to that output folder to serve optimized content to all users.

```
# Example structure:
📂 /mnt/media
├── 📂 input     # Shared with SFTP and MP4 Hub
├── 📂 output    # Shared with Jellyfin and MP4 Hub
```

## 🚀 Features

- 📂 **Active folder watching** – Monitors input folders for new video files  
- 🛡️ **ClamAV virus scanning** – Every file is scanned before conversion  
- 🎞️ **MP4 conversion** – Uses customizable FFmpeg presets and CRF  
- 🌐 **Web UI** – Monitor progress, upload files, and browse history  
- 🔒 **Basic authentication** – Secures the interface with credentials  
- 🐳 **Optimized for Docker** – Ideal for CasaOS, Portainer, or any home server  
- 🧩 **Rate limiting** – Prevents abuse from uploads or logins  

---

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
```


---

## ⚙️ Environment Variables

Create a `.env` file (see `.env.template`) to customize configuration:

| Variable                              | Default     | Description                                       |
|---------------------------------------|-------------|---------------------------------------------------|
| `TRUST_PROXY`                         | `false`     | Trust proxy headers (e.g., when behind Nginx)     |
| `CONCURRENCY`                         | `1`         | Max number of concurrent jobs                     |
| `VIDEO_ENCODING_PRESET`              | `ultrafast` | FFmpeg encoding preset                            |
| `VIDEO_CRF`                           | `28`        | Constant Rate Factor for video quality            |
| `ADMIN_USER`                          | `admin`     | Username for the web UI                           |
| `ADMIN_PASSWORD`                      | `changeme`  | Password for the web UI                           |
| `CORS_ALLOWED_ORIGINS`               | `*`         | Allowed origins for CORS requests                 |
| `UPLOAD_SIZE_LIMIT_MB`               | `3000`      | Max upload size per file (in MB)                  |
| `UPLOAD_RATE_LIMIT_MAX_ATTEMPTS`     | `5`         | Max upload attempts before cooldown               |
| `UPLOAD_RATE_LIMIT_COOLDOWN_MINUTES` | `1`         | Upload cooldown period (minutes)                  |
| `AUTH_RATE_LIMIT_MAX_ATTEMPTS`       | `3`         | Max failed login attempts                         |
| `AUTH_RATE_LIMIT_COOLDOWN_MINUTES`   | `5`         | Login cooldown period (minutes)                   |
| `GENERAL_RATE_LIMIT_MAX_ATTEMPTS`    | `100`       | Max general requests per IP                       |
| `GENERAL_RATE_LIMIT_COOLDOWN_MINUTES`| `1`         | General rate limiting cooldown                    |

---

## 🌐 Web UI

After launching the container, access the web UI:

```
http://localhost:3000
```

Use the credentials from your `.env` file to log in.

---

## 📁 Folder Structure

- `input/` – Drop your video files here  
- `output/` – Converted MP4 files will appear here  

---

## 📜 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a full list of changes.

---

## 📄 License

[MIT](./LICENSE)

---

## 💬 Feedback & Contributions

PRs and issues are welcome. Feel free to open one if you have suggestions or feature requests!

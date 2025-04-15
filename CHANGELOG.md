# Changelog

---

## [v1.0.0] - 2025-04-15

First stable release of MP4 Conversion Hub – a lightweight, Dockerized media processing hub designed for home servers like [CasaOS](https://www.casaos.io/). It actively watches folders, scans files for viruses, and converts videos to MP4 format using customizable FFmpeg presets.

### 🚀 Key Features

####  📂 Active folder watching
Continuously monitors configured directories for incoming video files.

#### 🛡️ ClamAV virus scanning
Every file is scanned before conversion using ClamAV to ensure your system stays safe.

#### 🎞️ MP4 video conversion with FFmpeg
Converts video files to MP4 using customizable encoding presets and CRF (Constant Rate Factor) values. FFmpeg is used under the hood.

#### 🐳 Optimized for Docker & home servers
Built with Docker in mind – perfect for CasaOS or similar setups. Easily share volumes with other containers like SFTP servers.

#### 🌐 Web UI (port 3000)
Includes a built-in web interface where you can:
- Monitor conversion progress in real-time
- Upload new video files directly
- Browse conversion history

#### 🔒 Configurable basic authentication
Secure access to the web interface with simple and customizable login credentials.

#### 🌐 Rate limiting
Protects your server from DDoS or brute-force attacks with configurable request rate limits.

---

## [Unreleased]

### 🚧 In progress
- Custom webhooks to attach file conversion to n8n workflows
- Update ClamAV database periodiacally
- Video metadata normalization
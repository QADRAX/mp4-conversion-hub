# Changelog

---

## [v1.1.0] - 2025-04-19

### 🆕 New Features

- 🤖 **AI-powered video classification and metadata enrichment**  
  The app now uses Google Gemini to analyze video filenames and classify them as either movies or TV series episodes. Based on this classification, it queries TMDB to fetch accurate metadata such as title, year, description, genres, language, and more. The enriched data is saved in a `.nfo` file compatible with media centers like Jellyfin and Kodi.

- ⚙️ **New configuration options for metadata processing**  
  The app introduces new environment variables to control AI and metadata behavior:
  
  #### Supported Gemini models via `GEMINI_MODEL`:
  - `gemini-1.0-pro`
  - `gemini-1.5-pro`
  - `gemini-1.5-flash`
  - `gemini-2.0-pro`
  - `gemini-2.0-flash`
  - `gemini-pro` _(legacy alias)_

  #### Supported languages via `LANGUAGE`:
  A wide range of locales are supported for metadata output, including but not limited to:
  - English (`en-US`, `en-GB`, `en-AU`, ...)
  - Spanish (`es-ES`, `es-AR`, `es-MX`, ...)
  - French (`fr-FR`, `fr-CA`, `fr-BF`, ...)
  - German (`de-DE`, `de-AT`, ...)
  - Portuguese (`pt-PT`, `pt-BR`, ...)
  - Italian (`it-IT`), Dutch (`nl-NL`), Japanese (`ja-JP`), Chinese (`zh-CN`, `zh-TW`, `zh-HK`), and many more.

  #### Example usage in `.env`:
  ```env
  GEMINI_API_KEY=your-gemini-key
  GEMINI_MODEL=gemini-2.0-flash
  TMDB_API_KEY=your-tmdb-key
  LANGUAGE=es-ES
  ```

---

## [v1.0.1] - 2025-04-17

### 🆕 New Features

- 📂 **Initial input folder scan on startup**  
  The app now performs a full scan of the `/input` directory when it starts, detecting and processing any pending files that may have been added while the app was off. This ensures conversion resumes smoothly after rebooting your system or restarting the container.

---

## [v1.0.0] - 2025-04-15

First stable release of MP4 Conversion Hub – a lightweight, Dockerized media processing hub designed for home servers like [CasaOS](https://www.casaos.io/). It actively watches folders, scans files for viruses, and converts videos to MP4 format using customizable FFmpeg presets.

### 🚀 Key Features

-   **📂 Active folder watching**

    Continuously monitors configured directories for incoming video files.

-   **🛡️ ClamAV virus scanning**

    Every file is scanned before conversion using ClamAV to ensure your system stays safe.

-  **🎞️ MP4 video conversion with FFmpeg**
    
    Converts video files to MP4 using customizable encoding presets and CRF (Constant Rate Factor) values. FFmpeg is used under the hood.

-  **🐳 Optimized for Docker & home servers**
    
    Built with Docker in mind – perfect for CasaOS or similar setups. Easily share volumes with other containers like SFTP servers.

-   **🌐 Web UI (port 3000)**

    Includes a built-in web interface where you can:
    - Monitor conversion progress in real-time
    - Upload new video files directly
    - Browse conversion history

-   **🔒 Configurable basic authentication**

    Secure access to the web interface with simple and customizable login credentials.

-  **🌐 Rate limiting**

    Protects your server from DDoS or brute-force attacks with configurable request rate limits.

---

## [Unreleased]

### 🚧 In progress
- Custom webhooks to attach file conversion to n8n workflows
- Update ClamAV database periodiacally
- ~~Video metadata normalization~~
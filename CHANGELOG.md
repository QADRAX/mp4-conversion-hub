# Changelog

## [v1.4.4] - 2025-04-30

### 🔒 Security

- 🛡️ **HTTP security headers added**

  The backend now includes industry-standard HTTP headers to enhance security:
  
  - `Content-Security-Policy`
  - `Strict-Transport-Security`
  - `X-Frame-Options`
  - `X-Content-Type-Options`
  - `X-XSS-Protection`

- 🔐 **Removed default Express fingerprint**

  The `X-Powered-By` header has been removed.

### 🧭 UI & UX Changes

- 🗃️ **Simplified upload path behavior**

  The folder navigation interface has been removed. The web UI now allows uploads **only to the root input directory**, and no longer supports browsing or creating subfolders.

  - Previously, users could navigate and upload files into nested folders, which led to unwanted complexity.
  - Now, the backend still watches subfolders for incoming files, but the UI won't expose or interact with them.

- 👁️ **Version display in footer**

  The app version is now shown in the footer of the web UI.

---

## [v1.4.3] - 2025-04-27

### 🔧 Improvements

- 🛠️ **Perfomance issue**

  Stop writting all metadata in history.json

---

## [v1.4.2] - 2025-04-27

### 🔧 Improvements

- 📂 **Consistent and descriptive filenames for media content**

  Output files are now renamed based on enriched metadata, including title, year, season and episode where applicable.

- 📄 **Automatic correction of encoding issues in metadata**

  Metadata extraction now corrects common text encoding errors automatically (e.g., fixing strange characters like `Ã¡` to `á`).

- 🛠️ **Enhanced NFO file generation for TV series**

  NFO files now include detailed and structured metadata for episodes (title, plot, air date, runtime), series, and seasons when available.

---

## [v1.4.1] - 2025-04-26

### 🔧 Improvements

- 🎬 **Use TMDB titles when available for output paths**

  Now, when organizing media files, the system prioritizes TMDB titles (tmdb.title or tmdb.name) over local titles for cleaner and more accurate folder names. Falls back to local title if TMDB data is missing.

---

## [v1.4.0] - 2025-04-26

### 🆕 New features

- 🗂️ **Organized output by media type**

  Files are now automatically sorted into a Jellyfin-friendly folder structure:
  - Movies → `/movies/{movie title}/{movie title}.mp4`
  - TV Shows → `/series/{series title}/season {season}/{original filename}.mp4`

- 🖼️ **Poster image download**

  Automatically downloads and saves poster images alongside .mp4 and .nfo files to enhance metadata scraping in Jellyfin and similar media servers.

---

## [v1.3.1] - 2025-04-26

### 🛠️ Fixes and improvements

- 📝 **Metadata parsing prompt improvements**

  Improved the prompts used for metadata extraction from filenames, allowing more accurate parsing of series titles and episode names.

- 🛠️ **Fixed webhook call issue**

  Fixed a bug that prevented the app from calling the webhook correctly and caused unexpected application restarts.

---

## [v1.3.0] - 2025-04-21

### 🆕 Security features

- 🛡️ **Automatic ClamAV database updates**

  The app can now keep its antivirus definitions up to date automatically using a scheduled cron task.  
  You can customize the schedule and timezone with the following environment variables:
  
  - `DAILY_TASK_CRON` – defines the cron expression (e.g. `0 2 * * *` for daily at 2 AM)
  - `DAILY_TASK_TIMEZONE` – defines the timezone (e.g. `Europe/Madrid`, `UTC`, etc.)

  The update task runs once at startup and will only continue running on schedule if the initial update succeeds.

---

## [v1.2.0] - 2025-04-20

### 🆕 New Features

- 🔔 **Custom webhook support for processing events**  
  You can now configure the app to send real-time processing updates to your own services via webhooks.  
  Just set the new environment variable `WEBHOOK_URL` to the desired endpoint, and the app will issue a `POST` request with the full job history entry.

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

- **📂 Active folder watching**

  Continuously monitors configured directories for incoming video files.

- **🛡️ ClamAV virus scanning**

  Every file is scanned before conversion using ClamAV to ensure your system stays safe.

- **🎞️ MP4 video conversion with FFmpeg**

  Converts video files to MP4 using customizable encoding presets and CRF (Constant Rate Factor) values. FFmpeg is used under the hood.

- **🐳 Optimized for Docker & home servers**

  Built with Docker in mind – perfect for CasaOS or similar setups. Easily share volumes with other containers like SFTP servers.

- **🌐 Web UI (port 3000)**

  Includes a built-in web interface where you can:

  - Monitor conversion progress in real-time
  - Upload new video files directly
  - Browse conversion history

- **🔒 Configurable basic authentication**

  Secure access to the web interface with simple and customizable login credentials.

- **🌐 Rate limiting**

  Protects your server from DDoS or brute-force attacks with configurable request rate limits.


import "./Header.css";
import { route } from "preact-router";

export function Header() {
  const navigate = (path: string) => (e: Event) => {
    e.preventDefault();
    route(path);
  };
  return (
    <header class="app-header">
      <div class="header-content">
        <div class="logo-container">
          <img src="/logo_1024.png" alt="MP4 Conversion Hub Logo" class="logo" />
          MP4 Conversion Hub
        </div>
        <nav class="nav-links">
          <a href="/" onClick={navigate("/")}>
            Progress
          </a>
          <a href="/history" onClick={navigate("/history")}>
            History
          </a>
          <a href="/upload" onClick={navigate("/upload")}>
            Upload
          </a>
        </nav>
      </div>
    </header>
  );
}

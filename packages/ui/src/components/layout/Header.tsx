import "./Header.css";
import { route } from "preact-router";

export function Header() {
  const navigate = (path: string) => (e: Event) => {
    e.preventDefault();
    route(path);
  };
  return (
    <header class="app-header">
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
    </header>
  );
}

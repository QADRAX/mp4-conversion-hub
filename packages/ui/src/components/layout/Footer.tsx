import "./Footer.css";

export function Footer() {
  return (
    <footer class="app-footer">
      <p>&copy; {new Date().getFullYear()} MP4 Conversion Hub v{__APP_VERSION__} — Powered by Qadrax</p>
    </footer>
  );
}

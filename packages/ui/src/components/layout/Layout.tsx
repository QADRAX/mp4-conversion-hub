import { Header } from "./Header";
import { Footer } from "./Footer";
import "./Layout.css";

export function Layout({ children }: { children: preact.ComponentChildren }) {
  return (
    <div class="layout">
      <Header />
      <main class="layout-main">{children}</main>
      <Footer />
    </div>
  );
}

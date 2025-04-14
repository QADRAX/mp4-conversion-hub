import { render } from "preact";
import Router from "preact-router";
import { UploadProvider } from "./context/UploadContext";
import { Layout } from "./components/layout/Layout";
import { ProgressList } from "./components/ProgressList";
import { HistoryList } from "./components/HistoryList";
import { UploadPage } from "./components/UploadPage";

function App() {
  return (
    <UploadProvider>
      <Layout>
        <Router>
          <ProgressList path="/" />
          <HistoryList path="/history" />
          <UploadPage path="/upload" />
        </Router>
      </Layout>
    </UploadProvider>
  );
}
render(<App />, document.getElementById("root")!);

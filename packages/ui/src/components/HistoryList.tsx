import { useEffect, useState } from "preact/hooks";
import "./HistoryList.css";
import { PageContainer } from "./layout/PageContainer";
import { HistoryEntry } from "@mp4-converter-hub/shared";

export function HistoryList(_: { path?: string }) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch((err) => console.error("Failed to load history:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredHistory = history
    .filter((entry) => {
      const entryDate = new Date(entry.timestamp);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      return (
        (!from || entryDate >= from) &&
        (!to || entryDate <= new Date(to.getTime() + 24 * 60 * 60 * 1000)) // include full day
      );
    })
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  return (
    <PageContainer>
      <h2>📜 File Conversion History</h2>

      <div class="filter-row">
        <label>
          From:
          <input
            type="date"
            value={fromDate}
            onInput={(e) => setFromDate((e.target as HTMLInputElement).value)}
          />
        </label>
        <label>
          To:
          <input
            type="date"
            value={toDate}
            onInput={(e) => setToDate((e.target as HTMLInputElement).value)}
          />
        </label>
        <span class="filter-count">{filteredHistory.length} result(s)</span>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredHistory.length === 0 ? (
        <p>No matching history entries.</p>
      ) : (
        <table class="history-table">
          <thead>
            <tr>
              <th>File</th>
              <th>Status</th>
              <th>Duration</th>
              <th>Input Size</th>
              <th>Output Size</th>
              <th>Finished At</th>
              <th>Output</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((entry) => (
              <tr key={entry.timestamp + entry.fileName}>
                <td class="file-name">{entry.fileName}</td>
                <td class={entry.status === "success" ? "success" : "error"}>
                  {entry.status}
                </td>
                <td>{entry.durationSeconds}s</td>
                <td>{entry.inputSizeMb?.toFixed(2) ?? "-"} MB</td>
                <td>{entry.outputSizeMb?.toFixed(2) ?? "-"} MB</td>
                <td>{new Date(entry.timestamp).toLocaleString()}</td>
                <td class="output-path">{entry.outputPath}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </PageContainer>
  );
}

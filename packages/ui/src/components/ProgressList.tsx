import { useEffect, useState, useRef } from "preact/hooks";
import "./ProgressList.css";
import { PageContainer } from "./layout/PageContainer";
import {
  FileItemProgressData,
  ProgressStateData,
} from "@mp4-conversion-hub/shared";

type FileItemWithState = FileItemProgressData & {
  state: "active" | "removing";
};

export function ProgressList(_: { path?: string }) {
  const [fileItems, setFileItems] = useState<FileItemWithState[]>([]);
  const prevMapRef = useRef<Map<string, FileItemProgressData>>(new Map());

  useEffect(() => {
    const eventSource = new EventSource("/api/progress");

    eventSource.onmessage = (event) => {
      const data: ProgressStateData = JSON.parse(event.data);
      const nextMap = new Map(data.fileItems.map((i) => [i.fileName, i]));
      const prevMap = prevMapRef.current;

      const nextItems: FileItemWithState[] = [];

      // Detect new or existing items
      data.fileItems.forEach((item) => {
        nextItems.push({ ...item, state: "active" });
      });

      // Detect removed items
      prevMap.forEach((_, key) => {
        if (!nextMap.has(key)) {
          nextItems.push({ fileName: key, state: "removing" });
        }
      });

      setFileItems(nextItems);
      prevMapRef.current = nextMap;
    };

    eventSource.onerror = (err) => {
      console.error("SSE connection error:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Clean up removing items after animation
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFileItems((items) =>
        items.filter((item) => item.state !== "removing")
      );
    }, 300);

    return () => clearTimeout(timeout);
  }, [fileItems]);

  return (
    <PageContainer className="progress-container">
      <h2>File Conversion Progress</h2>
      <ul>
        {fileItems.map((item) => (
          <li
            key={item.fileName}
            class={item.state === "removing" ? "removing" : ""}
          >
            <strong>{item.fileName}</strong>

            {item.scanReport ? (
              item.scanReport.isInfected === null ? (
                <div class="scan scan-pending">🕵️ Scanning for viruses...</div>
              ) : item.scanReport.isInfected === false ? (
                <div class="scan scan-clean">✅ Clean</div>
              ) : (
                <div class="scan scan-infected">
                  ❌ Infected: {item.scanReport.viruses.join(", ")}
                </div>
              )
            ) : (
              <div class="scan scan-pending">🕵️ Waiting for scan...</div>
            )}

            {item.progress ? (
              <div>
                <progress
                  value={item.progress.percent ?? 0}
                  max={100}
                ></progress>
                <div class="progress-text">
                  {item.progress.percent?.toFixed(2)}%
                  <span>
                    {` — ⏳ ${item.progress.minutesLeft}m ${item.progress.secondsLeft}s remaining`}
                  </span>
                </div>
              </div>
            ) : (
              <div class="waiting">Waiting to start...</div>
            )}
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}

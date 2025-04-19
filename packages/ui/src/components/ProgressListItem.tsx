import {
  FileItemProgressData,
  EnrichedVideoMetadata,
  EnrichedSeriesMetadata,
} from "@mp4-conversion-hub/shared";

type Props = {
  item: FileItemProgressData & { state: "active" | "removing" };
};

export function ProgressListItem({ item }: Props) {
  const metadata = item.enrichedMetadata;

  const isSeries = (
    meta: EnrichedVideoMetadata
  ): meta is EnrichedSeriesMetadata => "season" in meta && "episode" in meta;

  return (
    <li class={`progress-item ${item.state === "removing" ? "removing" : ""}`}>
      <strong>{item.fileName}</strong>

      {metadata?.tmdb && (
        <div class="metadata">
          <img src={metadata.tmdb.poster_path} alt="Poster" class="poster" />

          <div class="info">
            <div class="title">
                {isSeries(metadata)
                  ? metadata.tmdb?.name
                  : metadata.tmdb?.original_title}
            </div>

            {isSeries(metadata) && (
              <div class="episode">
                S{metadata.season.toString().padStart(2, "0")}E
                {metadata.episode.toString().padStart(2, "0")}
              </div>
            )}

            <ul class="details">
              <li>
                <strong>📅 Release:</strong>{" "}
                {isSeries(metadata)
                  ? metadata.tmdb?.first_air_date
                  : metadata.tmdb?.release_date}
              </li>
              <li>
                <strong>🎭 Genres:</strong> {metadata.tmdb.genres?.join(", ")}
              </li>
              <li>
                <strong>🗣️ Language:</strong> {metadata.tmdb.original_language}
              </li>
              {isSeries(metadata) && (
                <li>
                  <strong>🌍 Origin:</strong>{" "}
                  {metadata.tmdb.origin_country?.join(", ")}
                </li>
              )}
              <li>
                <strong>⭐ Rating:</strong> {metadata.tmdb.vote_average} (
                {metadata.tmdb.vote_count} votes)
              </li>
              <li>
                <strong>📈 Popularity:</strong>{" "}
                {metadata.tmdb.popularity.toFixed(1)}
              </li>
            </ul>

            <p class="overview">{metadata.tmdb.overview}</p>
          </div>
        </div>
      )}

      <div class="scan">
        <span>
          <strong>🛡️ Antivirus status:</strong>{" "}
          {item.scanReport ? (
            item.scanReport.isInfected === null ? (
              <span class="scan-pending">-</span>
            ) : item.scanReport.isInfected === false ? (
              <span class="scan-clean">✅ Clean</span>
            ) : (
              <span class="scan-infected">
                ❌ Infected: {item.scanReport.viruses.join(", ")}
              </span>
            )
          ) : (
            <span class="scan-pending">Waiting for scan...</span>
          )}
        </span>
      </div>

      {item.progress ? (
        <div>
          <progress value={item.progress.percent ?? 0} max={100}></progress>
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
  );
}

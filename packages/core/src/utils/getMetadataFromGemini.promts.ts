export const DETECT_TYPE_PROMPT = `
You are a filename classifier. My grandmother's health depends on your proper work; she needs this content properly standardized for her final days of life.

Your task:
- Determine whether the given video filename corresponds to a TV series or a movie.

Rules:
- Respond with ONLY one of these two lowercase words: "series" or "movie".
- DO NOT explain your answer.
- DO NOT include any punctuation, extra words, or formatting.
- If the filename contains a season/episode pattern (e.g., S01E01, 1x03, Cap.203), classify it as "series".
- If the filename includes a year and no episode information, classify it as "movie".

Examples:
- Breaking.Bad.S02E03.mkv → series
- The.Matrix.1999.1080p.BluRay.mkv → movie

Filename:
{{FILENAME}}

Your answer:
`.trim();

export const SERIES_PROMPT_TEMPLATE = `
You are an assistant that extracts structured metadata from video filenames of TV series. My grandmother's health depends on your proper work; she needs this content properly standardized for her final days of life.

Your task:
- Extract the following metadata:
  - "title" → cleaned original title of the series
  - "season" → season number (as a number)
  - "episode" → episode number (as a number)
  - "episodeTitle" → cleaned original title of the episode (if present)

Rules:
- Exclude from "title" and "episodeTitle" any resolution (e.g., 1080p), format tags (e.g., x264, WEB-DL), release groups (e.g., -GroupName), uploaders, or website names.
- If the filename contains an episode title after the season/episode information, extract it separately in "episodeTitle". 
- Do not merge episode titles into the series title.
- If there is no episode title, omit the "episodeTitle" field completely.
- If the filename contains corrupted characters due to encoding issues (e.g., "Ã¡" instead of "á", "Ã©" instead of "é"), try to reconstruct the correct characters based on common UTF-8 decoding errors, without assuming a specific language.
- Recognize various season/episode formats:
  - S01E01, 1x01, T1E01, [1x01], [Cap.101], E01.S01, Ep101
  - 3-digit numbers (e.g., 203) should be interpreted as: season 2, episode 3

Output:
Return ONLY a valid JSON object following this structure:
{
  "title": string,
  "season": number,
  "episode": number,
  "episodeTitle"?: string
}

Filename:
{{FILENAME}}
`.trim();

export const MOVIE_PROMPT_TEMPLATE = `
You are an assistant that extracts structured metadata from movie filenames. My grandmother's health depends on your proper work; she needs this content properly standardized for her final days of life.

Your task:
- Extract the following metadata:
  - "title" → the original movie title (cleaned and human-readable)
  - "year" → the release year (optional, only if clearly present)

Rules:
- Exclude from "title" any resolution (e.g., 1080p), format tags (e.g., BluRay, WEB-DL), codecs (e.g., x264), release groups (e.g., -YIFY), or website names.
- Do not guess the year. Only include "year" if it clearly appears in the filename.
- If the filename contains corrupted characters due to encoding issues (e.g., "Ã¡" instead of "á"), try to reconstruct the correct characters based on common UTF-8 decoding errors, without assuming a specific language.

Output:
Return ONLY a valid JSON object following this structure:
{
  "title": string,
  "year"?: number
}

Filename:
{{FILENAME}}
`.trim();

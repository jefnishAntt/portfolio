/**
 * Posts listed in the "Writing" section, newest first. Leave the list empty to
 * show a "first post coming soon" message.
 *
 * Example:
 *   { title: "EEG for web developers", date: "2026-12-01", url: "https://…", summary: "What an EEG actually measures, explained for devs." },
 */
export interface Post {
  title: string;
  date: string; // YYYY-MM-DD
  url: string;
  summary?: string;
}

export const POSTS: Post[] = [];

import {
  ApiClient,
  BibleClient,
  DEFAULT_LICENSE_FREE_BIBLE_VERSION,
} from "@youversion/platform-core";

export type DashboardVerseOfTheDay = {
  reference: string;
  text: string;
  versionTitle: string;
  passageId: string;
  versionId: number;
};

/** Local calendar day-of-year (1–366) for YouVersion `getVOTD`. */
export function getLocalDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86_400_000) + 1;
}

/**
 * Loads today’s YouVersion verse of the day plus passage text for the dashboard.
 * Uses the license-free default translation (same ID as platform-core’s constant).
 * Returns null when the app key is missing or the API fails.
 */
export async function fetchDashboardVerseOfTheDay(): Promise<DashboardVerseOfTheDay | null> {
  const appKey = process.env.NEXT_PUBLIC_YOUVERSION_APP_KEY?.trim();
  if (!appKey) return null;

  try {
    const api = new ApiClient({ appKey });
    const bible = new BibleClient(api);
    const day = getLocalDayOfYear(new Date());
    const votd = await bible.getVOTD(day);
    const versionId = DEFAULT_LICENSE_FREE_BIBLE_VERSION;

    const [passage, version] = await Promise.all([
      bible.getPassage(versionId, votd.passage_id, "text", false, false),
      bible.getVersion(versionId),
    ]);

    const text = passage.content.trim();
    const versionTitle = version.localized_title || version.title;

    return {
      reference: passage.reference,
      text: text || passage.reference,
      versionTitle,
      passageId: votd.passage_id,
      versionId,
    };
  } catch {
    return null;
  }
}

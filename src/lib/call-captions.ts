// Live captions for the sample call recordings shown on the site.
// `at` is the second in the recording when the line starts. Add the real transcript of each
// recording here (Hindi line plus an English translation works well); captions only show for
// scenarios that have lines, so leaving a list empty simply hides captions for that call.
export type CallCaption = { at: number; text: string };

export const CALL_CAPTIONS: Record<'cod' | 'checkout' | 'ndr', CallCaption[]> = {
  cod: [],
  checkout: [],
  ndr: [],
};

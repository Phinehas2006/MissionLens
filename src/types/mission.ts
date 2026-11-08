export type StorySlide = { number: number; title: string; paragraphs: string[]; image: string };
export type Story = { id: string; title: string; equipment: string; year: string; destination: string; slides: StorySlide[] };
export type Exhibit = {
  storyId: string; title: string; year: string; destination: string; intro: string;
  model?: string; modelLabel?: string; fallback?: boolean; facts: { label: string; detail: string; x: number; y: number }[];
  science: string; source: string; sourceLabel: string;
};

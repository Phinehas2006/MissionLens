import { readFile, writeFile } from 'node:fs/promises';

const source = await readFile(new URL('../prompt.txt', import.meta.url), 'utf8');
const lines = source.replaceAll('\r', '').split('\n');
const stories = [];
let story = null;
let slide = null;
const slideTitles = [
  ['A Car on the Moon?!', 'Meet the Moon Car', 'A Car That Unfolded Like a Toy!', "Why Didn't It Need Petrol?", 'Wheels Made for Another World', 'How Did It Find Its Way Home?', 'Hello, Earth! Can You Hear Us?', 'The Car That Never Came Home'],
  ['Is Anyone Home on Mars?', 'Meet Viking 1', 'A Tiny Scoop of Martian Soil', 'Did the Soil Have a Snack?', 'A Laboratory on Mars', 'How Did Viking Stay Awake?', 'Did Viking Find Life?', 'A Robot That Left a Mystery Behind'],
  ['A Little Traveller With a Big Secret', 'A Once-in-a-Lifetime Opportunity', 'A Planet-Sized Push!', 'A Message From Earth', 'How Does Voyager Get Electricity?', 'The Faintest Hello', 'A Robot That Needs to Save Its Energy', "Voyager Has Gone Beyond the Sun's Neighbourhood", 'The Journey That Will Outlast Us'],
  ["The Little Robot That Wouldn't Give Up", 'Meet Opportunity, the Robot Geologist', 'How Did Oppy Eat?', 'The Wind That Saved the Day', 'How Did It Talk to Earth?', 'A Giant Dust Storm!', 'One Last Hello', 'A Little Robot With a Giant Legacy'],
  ['Can a Helicopter Fly on Mars?', 'Meet Ingenuity!', 'The Air on Mars Is Very Different', 'Two Sets of Spinning Blades', 'Who Was Flying the Helicopter?', 'How Did It Talk to Earth?', 'Five Flights? Try Seventy-Two!', 'The Final Landing', 'A Tiny Helicopter, A Giant Achievement'],
];
const flushSlide = () => {
  if (!slide || !story) return;
  slide.paragraphs = slide.paragraphs.join('\n\n').trim().split(/\n\n+/).filter(Boolean);
  story.slides.push(slide);
  slide = null;
};
for (const raw of lines) {
  const line = raw.trim();
  const sm = line.match(/^STORY (\d): (.*?)\s+\|\s+(.*?)\s+\|\s+(.*?)\s+(\d+) slides?$/);
  if (sm) {
    flushSlide();
    const catalog = [
      ['The Moon Car', 'Apollo 15 Lunar Roving Vehicle', '1971', 'The Moon'],
      ['The Robot That Asked a Big Question', 'Viking 1', '1976', 'Mars'],
      ["The Message in a Bottle That’s Still Talking", 'Voyager 1', '1977', 'Interstellar space'],
      ['The Robot That Ran Out of Sun', 'Opportunity', '2004–2018', 'Mars'],
      ["The Helicopter That Shouldn’t Have Worked", 'Ingenuity Mars Helicopter', '2021–2024', 'Mars'],
    ][Number(sm[1]) - 1];
    story = { id: `story-${sm[1]}`, title: catalog[0], equipment: catalog[1], year: catalog[2], destination: catalog[3], slides: [] };
    stories.push(story);
    continue;
  }
  const lm = line.match(/^SLIDE (\d+)\s+[—–-]\s*(.*)$/);
  if (lm && story) {
    flushSlide();
    const title = slideTitles[stories.length - 1]?.[Number(lm[1]) - 1] ?? lm[2];
    const first = lm[2].startsWith(title) ? lm[2].slice(title.length).trim() : '';
    slide = { number: Number(lm[1]), title, paragraphs: first ? [first] : [], image: '' };
    continue;
  }
  if (!story || !slide) continue;
  if (!line) continue;
  if (/^Image:/i.test(line)) { slide.image = line.replace(/^Image:\s*/i, ''); flushSlide(); continue; }
  if (/^Closing question:/i.test(line)) { slide.paragraphs.push(line); continue; }
  if (/^(ACCURACY AND CONTENT RULES|IMPLEMENTATION AND TESTING)/.test(line)) { flushSlide(); story = null; continue; }
  slide.paragraphs.push(line);
}
flushSlide();
for (const s of stories) {
  const opening = s.slides[0]?.paragraphs[0];
  const edits = {
    'Imagine going to the Moon.': 'Picture stepping onto the Moon.',
    'Imagine sending a message inside a bottle.': 'Think of a message tucked inside a bottle.',
    'Imagine being sent to another planet with a job to do.': 'You have been sent to another planet with an important job.',
    'Imagine taking a helicopter to Mars.': 'A helicopter is heading to Mars. You switch it on.',
  };
  if (opening && edits[opening]) s.slides[0].paragraphs[0] = edits[opening];
}
await writeFile(new URL('../src/data/stories.json', import.meta.url), JSON.stringify(stories, null, 2));
console.log(`Extracted ${stories.length} stories and ${stories.reduce((n, s) => n + s.slides.length, 0)} slides.`);

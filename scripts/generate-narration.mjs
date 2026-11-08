import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
if (!process.env.ELEVENLABS_API_KEY) throw new Error('Set ELEVENLABS_API_KEY in .env.local before generating narration.');

const stories = JSON.parse(await readFile(path.join(root, 'src/data/stories.json'), 'utf8'));
const client = new ElevenLabsClient();
const preferredVoiceName = 'Alice - Clear, Engaging Educator';
const { voices = [] } = await client.voices.search({ search: 'Alice', pageSize: 100 });
const voice = voices.find(item => item.name.toLowerCase() === preferredVoiceName.toLowerCase());
if (!voice) throw new Error(`${preferredVoiceName} is not available to this API key. Add it to My Voices in ElevenLabs or choose another account voice, then retry.`);

const manifest = { provider: 'ElevenLabs', voice: voice.name, tracks: {} };
const audioRoot = path.join(root, 'public/audio');
await mkdir(audioRoot, { recursive: true });
let generated = 0;
let skipped = 0;

for (const story of stories) {
  manifest.tracks[story.id] = {};
  const storyDir = path.join(audioRoot, story.id);
  await mkdir(storyDir, { recursive: true });
  for (const [index, slide] of story.slides.entries()) {
    const fileName = `slide-${String(index + 1).padStart(2, '0')}.mp3`;
    const outputPath = path.join(storyDir, fileName);
    const publicPath = `/audio/${story.id}/${fileName}`;
    try {
      await access(outputPath);
      skipped++;
    } catch {
      const response = await client.textToSpeech.convert(voice.voiceId, {
          text: slide.paragraphs.join('\n\n'),
          modelId: 'eleven_v4',
          outputFormat: 'mp3_44100_128',
          voiceSettings: { stability: 0.7, similarityBoost: 0.65 },
          previousText: index > 0 ? story.slides[index - 1].paragraphs.join('\n\n') : undefined,
          nextText: index < story.slides.length - 1 ? story.slides[index + 1].paragraphs.join('\n\n') : undefined,
      });
      await writeFile(outputPath, Buffer.from(await new Response(response).arrayBuffer()), { flag: 'wx' });
      generated++;
      await new Promise(resolve => setTimeout(resolve, 700));
    }
    manifest.tracks[story.id][String(index + 1)] = publicPath;
    process.stdout.write(`\rGenerated ${generated}; already present ${skipped} — ${story.title}, slide ${index + 1}/${story.slides.length}`);
  }
}

await writeFile(path.join(audioRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
process.stdout.write(`\nNarration ready: ${generated} generated, ${skipped} already present. Voice: ${voice.name}.\n`);

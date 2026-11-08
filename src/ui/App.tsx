import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { Story } from '../types/mission';
import { exhibits, scienceDetails, stories } from '../data/catalog';

const HardwareLab = lazy(() => import('../pages/HardwareLabPage').then(m => ({ default: m.HardwareLab })));

const reduced = { duration: 0 };

function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);
  return <header className="site-header"><Link to="/" className="brand" aria-label="MissionLens home"><span className="brand-mark">M<span>◦</span></span><span>MISSION<span className="brand-light">LENS</span></span></Link>
    <button className="menu-toggle" aria-expanded={open} aria-label="Toggle navigation" onClick={() => setOpen(v => !v)}><span/><span/></button>
    <nav className={open ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
      <NavLink to="/stories">Stories</NavLink><NavLink to="/hardware">Hardware Lab</NavLink><NavLink to="/science">Science Lab</NavLink><NavLink to="/videos">Videos</NavLink>
      <Link className="nav-explore" to="/stories">Start exploring <span>↗</span></Link>
    </nav>
  </header>;
}

function App() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  return <><Header/><main className="route-main"><AnimatePresence mode="wait"><motion.div key={location.pathname} initial={reduceMotion ? false : { opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -5 }} transition={reduceMotion ? reduced : { duration: .22, ease: 'easeOut' }}>
    <Routes location={location}>
      <Route path="/" element={<Home/>}/><Route path="/stories" element={<Stories/>}/><Route path="/stories/:id/read" element={<StoryReader/>}/>
      <Route path="/hardware" element={<Suspense fallback={<div className="section-shell loading-page">Loading the Hardware Lab…</div>}><HardwareLab/></Suspense>}/><Route path="/science" element={<ScienceLab/>}/><Route path="/videos" element={<Videos/>}/><Route path="*" element={<NotFound/>}/>
    </Routes></motion.div></AnimatePresence></main><Footer/></>;
}

function Home() {
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const toggle = async () => {
    const v = videoRef.current; if (!v) return;
    if (v.paused) { try { await v.play(); setPlaying(true); } catch { setPlaying(false); } }
    else { v.pause(); setPlaying(false); }
  };
  return <>
    <section className="hero">
      <video ref={videoRef} className="hero-video" src="/videos/landing-page-background.mp4" autoPlay={!reduceMotion} muted loop playsInline poster="/assets/moon-landscape.jpg" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} aria-hidden="true"/>
      <div className="hero-tint"/><div className="hero-grid"/>
      <div className="hero-content"><p className="eyebrow hero-eyebrow"><span className="signal-dot"/> A FIELD GUIDE TO THE EXTRAORDINARY</p><h1>Mission Lens<br/><em>"An archive of the machines that went first"</em></h1><p className="hero-copy">A rover, a lander, a spacecraft, a helicopter.<br className="desktop-break"/> Meet the machines that opened new worlds.</p>
        <div className="hero-actions"><Link className="button button-red" to="/stories">Explore the stories <span>↗</span></Link><Link className="button button-glass" to="/hardware">Enter Hardware Lab <span>↗</span></Link></div>
        <Link to="/science" className="hero-science">Or start with the science <span>→</span></Link>
      </div><div className="hero-side"> <span></span></div>
      <div className="hero-bottom"><span>AN OPEN ARCHIVE OF HUMAN CURIOSITY</span><span>SCROLL TO EXPLORE ↓</span></div>
      <button className="video-toggle" onClick={toggle} aria-label={playing ? 'Pause background video' : 'Play background video'}>{playing ? 'Ⅱ' : '▶'} <span>{playing ? 'Pause motion' : 'Play motion'}</span></button>
    </section>
    <section className="home-intro section-shell"><div><p className="eyebrow">FIVE MACHINES · ONE BIG QUESTION</p><h2>What does it take<br/>to reach the unknown?</h2></div><p className="intro-copy">Every mission begins with a question. How far can we travel? What can a rock tell us? Can a helicopter fly on Mars? Meet the equipment that helped turn those questions into discoveries.</p></section>
    <section className="home-paths section-shell"><PathCard n="01" title="The Stories" text="Follow five missions, one slide at a time." to="/stories" className="path-story"/><PathCard n="02" title="Hardware Lab" text="Rotate the explorers that went farther." to="/hardware" className="path-hardware"/><PathCard n="03" title="Science Lab" text="See how the instruments did their work." to="/science" className="path-science"/></section>
    <section className="featured-home section-shell"><div className="section-heading"><div><p className="eyebrow">THE ARCHIVE</p><h2>Small machines.<br/>Vast frontiers.</h2></div><Link className="text-link" to="/stories">View all stories ↗</Link></div><div className="featured-strip">{stories.slice(0, 3).map((s, i) => <StoryCard key={s.id} story={s} compact index={i}/>)}</div></section>
  </>;
}
function PathCard({ n, title, text, to, className }: { n: string; title: string; text: string; to: string; className: string }) { return <Link to={to} className={`path-card ${className}`}><span className="path-number">{n} <span>↗</span></span><div><h3>{title}</h3><p>{text}</p></div></Link>; }

function Stories() {
  useEffect(() => { const saved = sessionStorage.getItem('missionlens-archive-scroll'); if (saved !== null) { window.scrollTo(0, Number(saved)); sessionStorage.removeItem('missionlens-archive-scroll'); } }, []);
  return <section className="archive-page section-shell"><PageIntro tag="THE ARCHIVE · 05 MISSIONS" title={<>Stories from<br/><em>the edge.</em></>} copy="Meet the machines that went to the Moon, Mars, and beyond. Each story is made to explore, one screen at a time."/><div className="archive-meta"><span>MISSION FILES</span><span>01 — 05</span></div><div className="story-grid">{stories.map((story, i) => <StoryCard key={story.id} story={story} index={i}/>)}</div><Sources/></section>;
}

function StoryCard({ story, compact = false, index = 0 }: { story: Story; compact?: boolean; index?: number }) {
  const navigate = useNavigate();
  const preserveArchive = () => sessionStorage.setItem('missionlens-archive-scroll', String(window.scrollY));
  const cover = story.id === 'story-1' ? 'moon' : story.id === 'story-3' ? 'voyager' : story.id === 'story-5' ? 'ingenuity' : 'mars';
  const blurb = story.slides[0]?.paragraphs.slice(0, 2).join(' ');
  return <article className={`story-card ${compact ? 'compact' : ''}`}>
    <Link to={`/stories/${story.id}/read`} state={{ fromArchive: true }} onClick={preserveArchive} className={`story-art art-${cover}`} aria-label={`Read ${story.title}`}>
      <span className="card-index">FILE {String(index + 1).padStart(2, '0')}</span><span className="art-fallback-label">CONCEPT DIAGRAM · NO MISSION PHOTO</span><SceneGraphic type={cover}/><span className="art-caption">{story.destination.toUpperCase()} · {story.year}</span>
    </Link>
    <div className="story-card-body"><p className="card-kicker">{story.equipment}</p><h3><Link to={`/stories/${story.id}/read`} state={{ fromArchive: true }} onClick={preserveArchive}>{story.title}</Link></h3>{!compact && <p>{blurb}</p>}<div className="card-footer"><span>{story.year} <b>·</b> {story.destination}</span><button onClick={() => { preserveArchive(); navigate(`/stories/${story.id}/read`); }} aria-label={`Read the story: ${story.title}`}>Read the story <span>↗</span></button></div></div>
  </article>;
}

function SceneGraphic({ type }: { type: string }) {
  return <div className={`scene-graphic scene-${type}`} aria-hidden="true"><span className="scene-orbit orbit-one"/><span className="scene-orbit orbit-two"/><span className="scene-body">{type === 'voyager' ? '◈' : type === 'ingenuity' ? '✣' : type === 'moon' ? '✦' : '◌'}</span><span className="scene-ground"/><span className="scene-star s1"/><span className="scene-star s2"/><span className="scene-star s3"/></div>;
}

function StoryReader() {
  const { id = '' } = useParams();
  const story = stories.find(s => s.id === id);
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [readAll, setReadAll] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceName] = useState('');
  const [speed, setSpeed] = useState(1);
  const [highlight, setHighlight] = useState(-1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const fallbackIntervalRef = useRef<number | undefined>(undefined);
  const autoAdvanceRef = useRef(false);
  const allRef = useRef(false);
  const cancel = useCallback(() => { allRef.current = false; setReadAll(false); setSpeaking(false); setPaused(false); setHighlight(-1); if (fallbackIntervalRef.current) window.clearInterval(fallbackIntervalRef.current); fallbackIntervalRef.current = undefined; if ('speechSynthesis' in window) window.speechSynthesis.cancel(); utteranceRef.current = null; }, []);
  useEffect(() => { if (autoAdvanceRef.current) { autoAdvanceRef.current = false; return; } cancel(); }, [index, cancel]);
  useEffect(() => {
    setSpeechSupported(typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window);
    if (!('speechSynthesis' in window)) return;
    const load = () => { const vs = window.speechSynthesis.getVoices(); setVoices(vs); if (!voiceName) { const en = vs.find(v => /^en(-|_)/i.test(v.lang)) || vs.find(v => /english/i.test(v.name)); if (en) setVoiceName(en.name); } };
    load(); window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => { window.speechSynthesis.removeEventListener('voiceschanged', load); window.speechSynthesis.cancel(); };
  }, [voiceName]);
  const close = () => { cancel(); if (location.state?.fromArchive) navigate(-1); else navigate('/stories'); };
  const speakAt = useCallback((slideIndex: number, all: boolean) => {
    if (!story || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const slide = story.slides[slideIndex]; if (!slide) { cancel(); return; }
    const text = slide.paragraphs.join('\n\n');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    const voice = voices.find(v => v.name === voiceName); if (voice) utterance.voice = voice;
    utteranceRef.current = utterance; allRef.current = all;
    setSpeaking(true); setPaused(false); setHighlight(-1);
    const sentences: { start: number; end: number }[] = [];
    const rx = /[^.!?]+(?:[.!?]+|$)/g; let match: RegExpExecArray | null;
    while ((match = rx.exec(text))) sentences.push({ start: match.index, end: match.index + match[0].length });
    let preciseSentenceEvents = false;
    const paragraphSentenceIndexes: number[] = [];
    let offset = 0;
    for (const paragraph of slide.paragraphs) { const sentenceIndex = sentences.findIndex(s => s.start >= offset && s.start < offset + paragraph.length); paragraphSentenceIndexes.push(Math.max(0, sentenceIndex)); offset += paragraph.length + 2; }
    let approximateParagraph = 0;
    utterance.onboundary = e => { if (e.name === 'sentence') { preciseSentenceEvents = true; const j = sentences.findIndex(s => e.charIndex >= s.start && e.charIndex < s.end); setHighlight(j); } };
    utterance.onstart = () => { setHighlight(paragraphSentenceIndexes[0] ?? 0); fallbackIntervalRef.current = window.setInterval(() => { if (utteranceRef.current && !window.speechSynthesis.paused && !preciseSentenceEvents) { approximateParagraph = (approximateParagraph + 1) % Math.max(1, paragraphSentenceIndexes.length); setHighlight(paragraphSentenceIndexes[approximateParagraph] ?? 0); } }, Math.max(3200, 4800 / speed)); };
    utterance.onend = () => {
      if (fallbackIntervalRef.current) window.clearInterval(fallbackIntervalRef.current); fallbackIntervalRef.current = undefined;
      utteranceRef.current = null; setSpeaking(false); setPaused(false); setHighlight(-1);
      if (allRef.current && slideIndex < story.slides.length - 1) { const next = slideIndex + 1; autoAdvanceRef.current = true; setIndex(next); window.setTimeout(() => speakAt(next, true), 100); }
      else if (allRef.current) { allRef.current = false; setReadAll(false); }
    };
    utterance.onerror = () => { if (fallbackIntervalRef.current) window.clearInterval(fallbackIntervalRef.current); fallbackIntervalRef.current = undefined; setSpeaking(false); setPaused(false); setHighlight(-1); utteranceRef.current = null; };
    window.speechSynthesis.speak(utterance);
  }, [story, speed, voices, voiceName, cancel]);
  useEffect(() => { const handler = (e: KeyboardEvent) => { const t = e.target as HTMLElement | null; if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return; if (e.key === 'Escape') { e.preventDefault(); close(); } if (e.key === 'ArrowRight') setIndex(v => Math.min((story?.slides.length ?? 1) - 1, v + 1)); if (e.key === 'ArrowLeft') setIndex(v => Math.max(0, v - 1)); }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler); }, [story, location.state]);
  if (!story) return <NotFound/>;
  const slide = story.slides[index];
  const slideText = slide.paragraphs.join('\n\n');
  const sentenceSpans = useMemo(() => { const result: { text: string; index: number }[] = []; const rx = /[^.!?]+(?:[.!?]+|$)/g; let m: RegExpExecArray | null; let n = 0; while ((m = rx.exec(slideText))) { result.push({ text: m[0], index: n++ }); } return result; }, [slideText]);
  const storyExhibit = exhibits.find(e => e.storyId === story.id)!;
  return <section className="reader-page">
    <div className="reader-top"><button className="back-button" onClick={close}>← <span>Back to Stories</span></button><span className="reader-series">MISSIONLENS STORY FILE <b>·</b> {story.equipment.toUpperCase()}</span><button onClick={close} className="close-reader" aria-label="Close story">× <span>Close</span></button></div>
    <div className="reader-progress"><span style={{ width: `${((index + 1) / story.slides.length) * 100}%` }}/></div>
    <div className="reader-workspace"><aside className="reader-rail"><p>STORY</p><strong>{story.title}</strong><div className="rail-separator"/><span>{story.destination.toUpperCase()}</span><span>{story.year}</span><div className="rail-counter">{String(index + 1).padStart(2, '0')}<i> / {String(story.slides.length).padStart(2, '0')}</i></div><Link to="/hardware" className="rail-link">Open this exhibit ↗</Link></aside>
      <div className="reader-main"><AnimatePresence mode="wait"><motion.article key={`${story.id}-${index}`} className="reader-slide" initial={reduceMotion ? false : { opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -18 }} transition={reduceMotion ? reduced : { duration: .2 }}>
        <div className="slide-copy"><p className="eyebrow">{story.equipment} <span>·</span> {String(slide.number).padStart(2, '0')} / {String(story.slides.length).padStart(2, '0')}</p><h1>{slide.title}</h1><div className="slide-text" aria-label="Story text">{sentenceSpans.map((item, i) => <span key={i} className={highlight === i ? 'spoken-sentence' : ''}>{item.text}</span>)}</div>
          {!speechSupported && <p className="speech-note">Speech narration is not available in this browser. The story text remains available to read.</p>}
        </div><figure className="slide-visual"><span className="visual-fallback-label">CONCEPT DIAGRAM · NO LOCAL MISSION PHOTO</span><SceneGraphic type={story.id === 'story-1' ? 'moon' : story.id === 'story-3' ? 'voyager' : story.id === 'story-5' ? 'ingenuity' : 'mars'}/><figcaption><span>ILLUSTRATION BRIEF</span>{slide.image || 'Concept diagram based on this mission.'}</figcaption><a href={storyExhibit.source} target="_blank" rel="noreferrer">Mission source ↗</a></figure>
      </motion.article></AnimatePresence>
        <div className="reader-controls"><div className="reader-nav"><button className="control-button" disabled={index === 0} onClick={() => setIndex(v => Math.max(0, v - 1))} aria-label="Previous slide">← <span>Previous</span></button><span className="control-count">{String(index + 1).padStart(2, '0')} <i>/</i> {String(story.slides.length).padStart(2, '0')}</span><button className="control-button next" disabled={index === story.slides.length - 1} onClick={() => setIndex(v => Math.min(story.slides.length - 1, v + 1))} aria-label="Next slide"><span>Next</span> →</button></div>
          <div className="narration-panel"><div className="narration-actions"><button className="listen-button" disabled={!speechSupported} onClick={() => { if (speaking && !paused) { window.speechSynthesis.pause(); setPaused(true); } else if (speaking && paused) { window.speechSynthesis.resume(); setPaused(false); } else { speakAt(index, false); } }}>{speaking ? paused ? '▶ Resume' : 'Ⅱ Pause' : '▶ Listen to this slide'}</button><button className="all-button" disabled={!speechSupported} onClick={() => { cancel(); if (index === 0) { setReadAll(true); speakAt(0, true); } else { setIndex(0); window.setTimeout(() => { setReadAll(true); speakAt(0, true); }, 0); } }}>{readAll ? 'Story playing' : 'Listen to entire story'}</button><button className="all-button" disabled={!speechSupported} onClick={() => speakAt(index, readAll)}>↻ Replay</button><button className="all-button" disabled={!speechSupported || !speaking} onClick={cancel}>■ Stop</button></div>
            <div className="narration-settings"><label>Voice <select value={voiceName} onChange={e => { setVoiceName(e.target.value); if (speaking) cancel(); }}><option value="">System default</option>{voices.map(v => <option key={`${v.name}-${v.lang}`} value={v.name}>{v.name} · {v.lang}</option>)}</select></label><label>Speed <select value={speed} onChange={e => setSpeed(Number(e.target.value))}><option value="0.8">Slow</option><option value="1">Normal</option><option value="1.2">Fast</option></select></label><span className="caption-label">Text captions · approximate paragraph highlight if timing is unavailable</span></div></div>
        </div>
      </div>
    </div>
    {index === story.slides.length - 1 && <div className="reader-finish"><span>STORY COMPLETE</span><p>Keep exploring this mission.</p><Link className="button button-blue" to="/hardware">Visit Hardware Lab ↗</Link><button className="text-link" onClick={close}>Back to all stories →</button></div>}
  </section>;
}

function ScienceLab() {
  const [selected, setSelected] = useState(0);
  const d = scienceDetails[selected]; const story = stories[selected];
  return <section className="science-page section-shell"><PageIntro tag="SCIENCE LAB · FIVE IDEAS" title={<>The clever ideas<br/>behind the <em>missions.</em></>} copy="A closer look at the engineering and science that helped each explorer do its work. Start with a simple diagram, then follow the links to the full mission story."/>
    <div className="science-layout"><div className="science-list" role="tablist" aria-label="Science topics">{scienceDetails.map((s, i) => <button key={s.icon} role="tab" aria-selected={selected === i} onClick={() => setSelected(i)}><span>{s.icon}</span><strong>{s.label}</strong><i>↗</i></button>)}</div><article className="science-detail"><p className="eyebrow">FIELD GUIDE / {d.icon}</p><h2>{d.label}</h2><p className="science-copy">{d.text}</p><div className="diagram-card"><span>THE IDEA, SIMPLIFIED</span><div className="diagram-flow">{d.diagram.split('→').map((step, i, a) => <div className="diagram-step" key={i}><span>{String(i + 1).padStart(2, '0')}</span><strong>{step.trim()}</strong>{i < a.length - 1 && <i>→</i>}</div>)}</div><small>Diagram is a simplified explanation, not to scale.</small></div><div className="science-source"><a href={d.source} target="_blank" rel="noreferrer">NASA mission source ↗</a><Link to={`/stories/${story.id}/read`}>Read “{story.title}” ↗</Link><Link to="/hardware">See the hardware ↗</Link></div></article></div>
    <div className="science-next"><span>CONTINUE EXPLORING</span><Link to="/stories">Read the mission stories ↗</Link><Link to="/hardware">Visit Hardware Lab ↗</Link></div><Sources/></section>;
}

function Videos() {
  const videos = [
    { id: 'P4boyXQuUIw', title: 'Mission video 01', url: 'https://youtu.be/P4boyXQuUIw?si=Ovzip9muNIKb53Mi' },
    { id: 'iIJcqiqYXG8', title: 'Mission video 02', url: 'https://youtu.be/iIJcqiqYXG8?si=6MTfjrPBB_5Ux9MG' },
  ];
  return <section className="videos-page section-shell"><PageIntro tag="WATCH · 03 VIDEOS" title={<>See the mission<br/><em>in motion.</em></>} copy="Watch the two selected videos and explore a first-person lunar surface view from the project collection. Videos start only when you press play."/><div className="video-grid">{videos.map(v => <article key={v.id} className="video-card"><div className="video-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${v.id}`} title={v.title} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/><noscript><a href={v.url}>Watch on YouTube</a></noscript></div><div className="video-caption"><span>VIDEO FILE / {v.id}</span><h3>{v.title}</h3><a href={v.url} target="_blank" rel="noreferrer">Watch on YouTube ↗</a></div></article>)}</div><article className="local-video-card"><div className="local-video-title"><span>LOCAL VIDEO · PROJECT ASSET</span><h2>Lunar surface, first-person view</h2><p>A supplied video from the MissionLens project folder.</p></div><video controls preload="metadata" playsInline src="/videos/lunar-trek-first-person-view.mp4">Your browser does not support this video. You can still explore the stories and labs.</video></article></section>;
}

function Sources() { return <details className="sources"><summary>Sources & asset notes</summary><div className="sources-list"><p>Mission facts and image descriptions are based on NASA mission pages linked from each story and exhibit.</p><p>Local 3D model files were supplied in the project folder. Their original authorship and reuse terms were not included with the files; source metadata is therefore marked unavailable on each model exhibit.</p><p>The landing video and lunar viewpoint video are supplied local project assets. No NASA logo or endorsement is implied.</p>{exhibits.map(e => <a key={e.storyId} href={e.source} target="_blank" rel="noreferrer">{e.sourceLabel} ↗</a>)}</div></details>; }
function PageIntro({ tag, title, copy }: { tag: string; title: ReactNode; copy: string }) { return <div className="page-intro"><p className="eyebrow"><span className="signal-dot"/>{tag}</p><h1>{title}</h1><p>{copy}</p></div>; }
function NotFound() { return <section className="not-found section-shell"><p className="eyebrow">SIGNAL LOST</p><h1>This page drifted<br/><em>off course.</em></h1><Link to="/" className="button button-blue">Return to MissionLens ↗</Link></section>; }
function Footer() { return <footer className="site-footer"><Link to="/" className="brand"><span className="brand-mark">M<span>◦</span></span><span>MISSION<span className="brand-light">LENS</span></span></Link><p>Curiosity, carried farther.</p><div><Link to="/stories">Stories</Link><Link to="/hardware">Hardware Lab</Link><Link to="/science">Science Lab</Link><Link to="/videos">Videos</Link></div><small>AN INDEPENDENT EDUCATIONAL EXPERIENCE · NOT AFFILIATED WITH NASA</small></footer>; }

export default App;

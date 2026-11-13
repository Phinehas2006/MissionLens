import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { Story } from '../types/mission';
import { exhibits, stories } from '../data/catalog';
import { artworkForSlide } from '../data/story-artwork';

const HardwareLab = lazy(() => import('../pages/HardwareLabPage').then(m => ({ default: m.HardwareLab })));

const reduced = { duration: 0 };
type ArchiveImage = { src: string; alt: string; title: string; type: string; kind?: 'photo' | 'diagram' | 'poster' | 'logo' };
const archiveImages: ArchiveImage[] = [
  { src: '/assets/mission-archive/apollo15-lrv.webp', alt: 'Apollo 15 Lunar Roving Vehicle on the Moon.', title: 'Apollo 15 Lunar Roving Vehicle', type: 'Apollo lunar exploration' },
  { src: '/assets/mission-archive/apollo-11-view-of-the-moon.jpg', alt: 'Lunar view from the supplied Apollo 11 image.', title: 'Apollo 11 · View of the Moon', type: 'Apollo lunar exploration' },
  { src: '/assets/mission-archive/apollo-11-view-of-the-moon-tiff.jpg', alt: 'Web-ready TIFF conversion of the supplied Apollo 11 Moon view.', title: 'Apollo 11 · Moon view TIFF edition', type: 'Apollo lunar exploration' },
  { src: '/assets/mission-archive/crawler-transporter.png', alt: 'NASA crawler transporter.', title: 'Crawler transporter', type: 'Launch infrastructure' },
  { src: '/assets/mission-archive/curiosity-rover-clean.png', alt: 'Clean reference render of NASA’s Curiosity Mars rover.', title: 'Curiosity rover · clean reference', type: 'Mars exploration' },
  { src: '/assets/mission-archive/curiosity-rover-dirty.png', alt: 'Dust-covered reference render of NASA’s Curiosity Mars rover.', title: 'Curiosity rover · dusty reference', type: 'Mars exploration' },
  { src: '/assets/mission-archive/curiosity-10th-anniversary-poster.jpg', alt: 'Curiosity rover tenth anniversary poster thumbnail.', title: 'Curiosity · tenth anniversary poster', type: 'Mars exploration', kind: 'poster' },
  { src: '/assets/mission-archive/curiosity-3d-model-preview.webp', alt: 'Preview image for a Curiosity rover 3D model.', title: 'Curiosity · 3D model preview', type: 'Mars exploration', kind: 'diagram' },
  { src: '/assets/mission-archive/curiosity-system-diagram.webp', alt: 'Curiosity rover system diagram.', title: 'Curiosity · rover diagram', type: 'Mars exploration', kind: 'diagram' },
  { src: '/assets/mission-archive/grc-2011-c-00663-aircraft.jpg', alt: 'Aircraft image from the supplied NASA Glenn Research Center file.', title: 'NASA Glenn Research Center · aircraft image', type: 'Aerospace reference' },
  { src: '/assets/mission-archive/ingenuity-72-flights-poster.jpg', alt: 'Ingenuity Mars helicopter poster marking its 72 flights.', title: 'Ingenuity · 72 flights', type: 'Mars exploration', kind: 'poster' },

  { src: '/assets/mission-archive/pia00381-viking-first-image.jpg', alt: 'Viking 1’s first clear surface image from Mars.', title: 'Viking 1 · first surface image', type: 'Viking mission' },
  { src: '/assets/mission-archive/pia05180-opportunity-and-lander.jpg', alt: 'Opportunity rover beside its empty Mars lander.', title: 'Opportunity and its mother ship', type: 'Mars Exploration Rover' },
  { src: '/assets/mission-archive/pia23041-curiosity-and-apollo-16-rover.jpg', alt: 'Curiosity rover compared with an Apollo lunar rover.', title: 'Curiosity and Apollo 16 rover · scale comparison', type: 'Rover comparison' },
  { src: '/assets/mission-archive/viking-lander.jpg', alt: 'Viking lander silhouetted against the Martian sky.', title: 'Viking lander on Mars', type: 'Viking mission' },
  { src: '/assets/mission-archive/voyager-spacecraft-diagram.webp', alt: 'Diagram of Voyager spacecraft systems.', title: 'Voyager spacecraft systems', type: 'Voyager mission', kind: 'diagram' },
];
function BrandLogo() { return <img className="brand-logo" src="/assets/missionlens-logo.png" alt="MissionLens"/>; }

function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);
  return <header className="site-header"><Link to="/" className="brand" aria-label="MissionLens home"><BrandLogo/></Link>
    <Link to="/" className="home-quick" aria-label="Go to the MissionLens landing page"><span aria-hidden="true">⌂</span><b>Home</b></Link>
    <button className="menu-toggle" aria-expanded={open} aria-label="Toggle navigation" onClick={() => setOpen(v => !v)}><span/><span/></button>
    <nav className={open ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
      <NavLink to="/about">About</NavLink><NavLink to="/stories">Stories</NavLink><NavLink to="/hardware">Hardware Lab</NavLink><NavLink to="/videos">Videos</NavLink>
    </nav>
  </header>;
}

function App() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const isHome = location.pathname === '/';
  useEffect(() => { if (isHome) window.scrollTo(0, 0); }, [isHome]);
  return <><Header/><main className={isHome ? 'route-main home-route' : 'route-main'}><AnimatePresence mode="wait"><motion.div key={location.pathname} initial={reduceMotion ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -5 }} transition={reduceMotion ? reduced : { duration: .2, ease: [.4, 0, .2, 1] }}>
    <Routes location={location}>
      <Route path="/" element={<Home/>}/><Route path="/stories" element={<Stories/>}/><Route path="/stories/:id/read" element={<StoryReader/>}/><Route path="/about" element={<About/>}/>
      <Route path="/hardware" element={<Suspense fallback={<div className="section-shell loading-page">Loading the Hardware Lab…</div>}><HardwareLab/></Suspense>}/><Route path="/science" element={<Navigate to="/stories" replace/>}/><Route path="/videos" element={<Videos/>}/><Route path="*" element={<NotFound/>}/>
    </Routes></motion.div></AnimatePresence></main>{!isHome && <Footer/>}</>;
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
  return <section className="hero">
      <video ref={videoRef} className="hero-video" src="/videos/landing-page-background.mp4" autoPlay={!reduceMotion} preload="auto" muted loop playsInline onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} aria-hidden="true"/>
      <div className="hero-tint"/><div className="hero-grid"/>
      <div className="hero-content"><p className="eyebrow hero-eyebrow"><span className="signal-dot"/> A FIELD GUIDE TO THE EXTRAORDINARY</p><h1>MissionLens</h1><p className="hero-tagline">An archive of the machines that went first.</p><p className="hero-copy">A lunar rover. Viking 1. Voyager 1. Opportunity. Ingenuity..<br className="desktop-break"/> Five machines. New worlds to explore.</p>
        <div className="hero-actions"><Link className="button button-red" to="/stories">Explore the stories <span>↗</span></Link><Link className="button button-glass" to="/hardware">Enter Hardware Lab <span>↗</span></Link></div>
      </div><div className="hero-side"> <span></span></div>
      <div className="hero-bottom"><span>AN OPEN ARCHIVE OF HUMAN CURIOSITY</span><span>SELECT A DESTINATION TO EXPLORE ↓</span></div>
      <button className="video-toggle" onClick={toggle} aria-label={playing ? 'Pause background video' : 'Play background video'}>{playing ? 'Ⅱ' : '▶'} <span>{playing ? 'Pause motion' : 'Play motion'}</span></button>
  </section>;
}

function About() {
  const milestones = [
    ['1971', 'Lunar Roving Vehicle', 'The first Apollo mission to use a lunar rover.'],
    ['1976', 'Viking 1', 'A lander brought cameras and life-search experiments to Mars.'],
    ['1977', 'Voyager 1', 'A planetary explorer began its journey toward interstellar space.'],
    ['2004–2018', 'Opportunity', 'A solar-powered rover explored Mars for nearly fifteen years.'],
    ['2021–2024', 'Ingenuity', 'A small helicopter demonstrated powered flight on Mars.'],
  ];
  return <section className="about-page section-shell"><PageIntro tag="ABOUT MISSIONLENS · WHY WE LOOK CLOSER" title={<>About<br/><em>MissionLens.</em></>} copy="An independent learning archive about the machines that helped us explore the Moon, Mars, and deep space."/>
    <div className="about-lead"><span>OUR IDEA</span><p>MissionLens is an interactive storytelling archive about remarkable space exploration hardware, the engineering behind it, the missions it flew, and the science it made possible..</p></div>
    <div className="about-columns"><article><span>01 / THE STORIES</span><h2>Start with the machine.</h2><p>A lunar rover, a Mars lander, a deep-space probe, a long-running rover, and a helicopter each open a different window on exploration. Short, illustrated story slides make their journeys easy to follow while keeping the science and mission details in view.</p></article><article><span>02 / THE QUESTIONS</span><h2>Follow the evidence.</h2><p>Every instrument is built to do a job. MissionLens connects the hardware to the questions scientists asked: how to travel farther on the Moon, what Martian soil can reveal, and whether powered flight can work on another world.</p></article><article><span>03 / THE EXHIBITS</span><h2>Look around.</h2><p>The Hardware Lab lets visitors inspect supplied 3D models and labeled parts. Mission videos and source links give curious readers a path to keep exploring.</p></article></div>
    <div className="about-timeline"><div className="about-timeline-head"><span>FIVE MISSION FILES</span><h2>One archive.<br/><em>Many frontiers.</em></h2></div><div className="timeline-list">{milestones.map(([year, name, note], i) => <div className="timeline-row" key={name}><span className="timeline-number">0{i + 1}</span><span className="timeline-year">{year}</span><div><h3>{name}</h3><p>{note}</p></div></div>)}</div></div>
    <div className="about-note"><span>OUR SOURCES</span><p>MissionLens is designed to make exploration inviting without losing sight of evidence. Mission references are linked throughout the site. Illustrative diagrams are labeled, and locally supplied 3D models are identified as such when their original credits were not included.</p><Link to="/stories" className="button button-blue">Explore the stories ↗</Link></div>
  </section>;
}

function ImageArchive() {
  return <section className="image-archive" aria-labelledby="image-archive-title"><div className="image-archive-heading"><p className="eyebrow">SUPPLIED PROJECT IMAGES · 16 FILES</p><h2 id="image-archive-title">The wider image archive.</h2><p>Explore selected visuals supplied in the images folder. Mission slides above use the images that match their subject; additional references are kept here with their own labels.</p></div><div className="image-archive-grid">{archiveImages.map(image => <figure className="image-archive-card" key={image.src}><div className={`image-archive-frame ${image.kind === 'diagram' ? 'is-diagram' : ''} ${image.kind === 'logo' ? 'is-logo' : ''}`}><img src={image.src} alt={image.alt} loading="lazy"/></div><figcaption><span>{image.type}</span><strong>{image.title}</strong></figcaption></figure>)}</div></section>;
}

function Stories() {
  useEffect(() => { const saved = sessionStorage.getItem('missionlens-archive-scroll'); if (saved !== null) { window.scrollTo(0, Number(saved)); sessionStorage.removeItem('missionlens-archive-scroll'); } }, []);
  return <section className="archive-page section-shell"><PageIntro tag="THE ARCHIVE · 05 MISSIONS" title={<>Stories from<br/><em>the edge.</em></>} copy="Meet the machines that went to the Moon, Mars, and beyond. Each story is made to explore, one screen at a time."/><div className="archive-meta"><span>MISSION FILES</span><span>01 — 05</span></div><div className="story-grid">{stories.map((story, i) => <StoryCard key={story.id} story={story} index={i}/>)}</div><ImageArchive/><Sources/></section>;
}

function StoryCard({ story, compact = false, index = 0 }: { story: Story; compact?: boolean; index?: number }) {
  const navigate = useNavigate();
  const preserveArchive = () => sessionStorage.setItem('missionlens-archive-scroll', String(window.scrollY));
  const cover = story.id === 'story-1' ? 'moon' : story.id === 'story-3' ? 'voyager' : story.id === 'story-5' ? 'ingenuity' : 'mars';
  const blurb = story.slides[0]?.paragraphs.slice(0, 2).join(' ');
  const cardArt = artworkForSlide(story.id, 0)!;
  return <article className={`story-card ${compact ? 'compact' : ''}`}>
    <Link to={`/stories/${story.id}/read`} state={{ fromArchive: true }} onClick={preserveArchive} className={`story-art art-${cover}`} aria-label={`Read ${story.title}. Image: ${cardArt.alt}`}>
      <img className={cardArt.kind === 'diagram' ? 'story-card-image is-diagram' : 'story-card-image'} src={cardArt.src} alt="" loading="lazy" onError={e => { e.currentTarget.style.display = 'none'; }}/><span className="card-index">FILE {String(index + 1).padStart(2, '0')}</span><span className="art-fallback-label">{cardArt.credit}</span><span className="art-caption">{story.destination.toUpperCase()} · {story.year}</span>
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
  const [audioTracks, setAudioTracks] = useState<Record<string, Record<string, string>>>({});
  const [narrationVoice, setNarrationVoice] = useState('');
  const [highlight, setHighlight] = useState(-1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fallbackIntervalRef = useRef<number | undefined>(undefined);
  const autoAdvanceRef = useRef(false);
  const allRef = useRef(false);
  const cancel = useCallback(() => { allRef.current = false; setReadAll(false); setSpeaking(false); setPaused(false); setHighlight(-1); if (fallbackIntervalRef.current) window.clearInterval(fallbackIntervalRef.current); fallbackIntervalRef.current = undefined; if (audioRef.current) { audioRef.current.pause(); audioRef.current.removeAttribute('src'); audioRef.current = null; } const currentUtterance = utteranceRef.current; utteranceRef.current = null; if (currentUtterance) { currentUtterance.onend = null; currentUtterance.onerror = null; currentUtterance.onboundary = null; currentUtterance.onstart = null; } if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }, []);
  useEffect(() => { if (autoAdvanceRef.current) { autoAdvanceRef.current = false; return; } cancel(); }, [index, cancel]);
  useEffect(() => {
    setSpeechSupported(typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window);
    if (!('speechSynthesis' in window)) return;
    const load = () => { const vs = window.speechSynthesis.getVoices(); setVoices(vs); if (!voiceName) { const en = vs.find(v => /^en(-|_)/i.test(v.lang)) || vs.find(v => /english/i.test(v.name)); if (en) setVoiceName(en.name); } };
    load(); window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => { window.speechSynthesis.removeEventListener('voiceschanged', load); window.speechSynthesis.cancel(); };
  }, [voiceName]);
  useEffect(() => { fetch('/audio/manifest.json').then(response => response.ok ? response.json() : null).then(manifest => { if (manifest?.tracks) setAudioTracks(manifest.tracks); if (manifest?.voice) setNarrationVoice(manifest.voice); }).catch(() => {}); }, []);
  const close = () => { cancel(); if (location.state?.fromArchive) navigate(-1); else navigate('/stories'); };
  const speakAt = useCallback((slideIndex: number, all: boolean, forceBrowser = false) => {
    if (!story) return;
    if (audioRef.current) {
      const previousAudio = audioRef.current;
      audioRef.current = null;
      previousAudio.onended = null;
      previousAudio.onerror = null;
      previousAudio.pause();
      previousAudio.removeAttribute('src');
      previousAudio.load();
    }
    if (fallbackIntervalRef.current) window.clearInterval(fallbackIntervalRef.current);
    fallbackIntervalRef.current = undefined;
    const currentUtterance = utteranceRef.current; utteranceRef.current = null; if (currentUtterance) { currentUtterance.onend = null; currentUtterance.onerror = null; currentUtterance.onboundary = null; currentUtterance.onstart = null; } if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    const slide = story.slides[slideIndex]; if (!slide) { cancel(); return; }
    const text = slide.paragraphs.join('\n\n');
    const narrationPath = audioTracks[story.id]?.[String(slideIndex + 1)];
    if (narrationPath && !forceBrowser) {
      const audio = new Audio(narrationPath);
      audio.preload = 'auto'; audio.volume = 1; audio.playbackRate = speed;
      audioRef.current = audio; allRef.current = all;
      setSpeaking(true); setPaused(false); setHighlight(-1);
      const sentences: { start: number; end: number }[] = [];
      const rx = /[^.!?]+(?:[.!?]+|$)/g; let match: RegExpExecArray | null;
      while ((match = rx.exec(text))) sentences.push({ start: match.index, end: match.index + match[0].length });
      audio.ontimeupdate = () => { if (!audio.duration) return; const pos = Math.floor((audio.currentTime / audio.duration) * text.length); const sentence = sentences.findIndex(s => pos >= s.start && pos < s.end); if (sentence >= 0) setHighlight(sentence); };
      audio.onended = () => {
        if (audioRef.current !== audio) return;
        audioRef.current = null; setSpeaking(false); setPaused(false); setHighlight(-1);
        if (allRef.current && slideIndex < story.slides.length - 1) { const next = slideIndex + 1; autoAdvanceRef.current = true; setIndex(next); window.setTimeout(() => speakAt(next, true), 100); }
        else if (allRef.current) { allRef.current = false; setReadAll(false); }
      };
      audio.onerror = () => { if (audioRef.current !== audio) return; audioRef.current = null; setSpeaking(false); setPaused(false); setHighlight(-1); speakAt(slideIndex, all, true); };
      audio.play().catch(() => { if (audioRef.current === audio) { audioRef.current = null; setSpeaking(false); setPaused(false); speakAt(slideIndex, all, true); } });
      return;
    }
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
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
      if (utteranceRef.current !== utterance) return;
      if (fallbackIntervalRef.current) window.clearInterval(fallbackIntervalRef.current); fallbackIntervalRef.current = undefined;
      utteranceRef.current = null; setSpeaking(false); setPaused(false); setHighlight(-1);
      if (allRef.current && slideIndex < story.slides.length - 1) { const next = slideIndex + 1; autoAdvanceRef.current = true; setIndex(next); window.setTimeout(() => speakAt(next, true), 100); }
      else if (allRef.current) { allRef.current = false; setReadAll(false); }
    };
    utterance.onerror = () => { if (utteranceRef.current !== utterance) return; if (fallbackIntervalRef.current) window.clearInterval(fallbackIntervalRef.current); fallbackIntervalRef.current = undefined; setSpeaking(false); setPaused(false); setHighlight(-1); utteranceRef.current = null; if (allRef.current) { allRef.current = false; setReadAll(false); } };
    window.speechSynthesis.speak(utterance);
  }, [story, speed, voices, voiceName, audioTracks, cancel]);
  useEffect(() => { const handler = (e: KeyboardEvent) => { const t = e.target as HTMLElement | null; if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return; if (e.key === 'Escape') { e.preventDefault(); close(); } if (e.key === 'ArrowRight') setIndex(v => Math.min((story?.slides.length ?? 1) - 1, v + 1)); if (e.key === 'ArrowLeft') setIndex(v => Math.max(0, v - 1)); }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler); }, [story, location.state]);
  if (!story) return <NotFound/>;
  const slide = story.slides[index];
  const hasNarrationAudio = Boolean(audioTracks[story.id]?.[String(index + 1)]);
  const slideArt = artworkForSlide(story.id, index)!;
  const slideText = slide.paragraphs.join('\n\n');
  const sentenceSpans = useMemo(() => { const result: { text: string; index: number }[] = []; const rx = /[^.!?]+(?:[.!?]+|$)/g; let m: RegExpExecArray | null; let n = 0; while ((m = rx.exec(slideText))) { result.push({ text: m[0], index: n++ }); } return result; }, [slideText]);
  const storyExhibit = exhibits.find(e => e.storyId === story.id)!;
  return <section className="reader-page">
    <div className="reader-top"><button className="back-button" onClick={close}>← <span>Back to Stories</span></button><span className="reader-series">MISSIONLENS STORY FILE <b>·</b> {story.equipment.toUpperCase()}</span><button onClick={close} className="close-reader" aria-label="Close story">× <span>Close</span></button></div>
    <div className="reader-progress"><span style={{ width: `${((index + 1) / story.slides.length) * 100}%` }}/></div>
    <div className="reader-workspace"><aside className="reader-rail"><p>STORY</p><strong>{story.title}</strong><div className="rail-separator"/><span>{story.destination.toUpperCase()}</span><span>{story.year}</span><div className="rail-counter">{String(index + 1).padStart(2, '0')}<i> / {String(story.slides.length).padStart(2, '0')}</i></div><Link to="/hardware" className="rail-link">Open this exhibit ↗</Link></aside>
      <div className="reader-main"><AnimatePresence mode="wait"><motion.article key={`${story.id}-${index}`} className="reader-slide" initial={reduceMotion ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -5 }} transition={reduceMotion ? reduced : { duration: .2, ease: [.4, 0, .2, 1] }}>
        <div className="slide-copy"><p className="eyebrow">{story.equipment} <span>·</span> {String(slide.number).padStart(2, '0')} / {String(story.slides.length).padStart(2, '0')}</p><h1>{slide.title}</h1><div className="slide-text" aria-label="Story text">{sentenceSpans.map((item, i) => <span key={i} className={highlight === i ? 'spoken-sentence' : ''}>{item.text}</span>)}</div>
          {!speechSupported && !hasNarrationAudio && <p className="speech-note">Narration is not available in this browser yet. The story text remains available to read.</p>}
        </div><figure className="slide-visual"><div className="slide-image-stage"><SceneGraphic type={story.id === 'story-1' ? 'moon' : story.id === 'story-3' ? 'voyager' : story.id === 'story-5' ? 'ingenuity' : 'mars'}/><img className={slideArt.kind === 'diagram' ? 'reader-mission-image is-diagram' : 'reader-mission-image'} src={slideArt.src} alt={slideArt.alt} onError={e => { e.currentTarget.style.display = 'none'; }}/><span className="visual-fallback-label">{slideArt.kind === 'diagram' ? 'MISSION SYSTEM DIAGRAM' : slideArt.kind === 'poster' ? 'MISSION POSTER' : 'MISSION PHOTOGRAPH'}</span><a href={storyExhibit.source} target="_blank" rel="noreferrer">Mission source ↗</a></div><figcaption><span>{slideArt.credit}</span>{slideArt.description}{slideArt.source && <><br/><a href={slideArt.source} target="_blank" rel="noreferrer">Image source ↗</a></>}</figcaption></figure>
      </motion.article></AnimatePresence>
        <div className="reader-controls"><div className="reader-nav"><button className="control-button" disabled={index === 0} onClick={() => setIndex(v => Math.max(0, v - 1))} aria-label="Previous slide">← <span>Previous</span></button><span className="control-count">{String(index + 1).padStart(2, '0')} <i>/</i> {String(story.slides.length).padStart(2, '0')}</span><button className="control-button next" disabled={index === story.slides.length - 1} onClick={() => setIndex(v => Math.min(story.slides.length - 1, v + 1))} aria-label="Next slide"><span>Next</span> →</button></div>
          <div className="narration-panel"><div className="narration-actions"><button className="listen-button" disabled={!speechSupported && !hasNarrationAudio} onClick={() => { if (speaking && !paused) { if (audioRef.current) audioRef.current.pause(); else window.speechSynthesis.pause(); setPaused(true); } else if (speaking && paused) { if (audioRef.current) void audioRef.current.play(); else window.speechSynthesis.resume(); setPaused(false); } else { setReadAll(true); speakAt(index, true); } }}>{speaking ? paused ? '▶ Resume' : 'Ⅱ Pause' : '▶ Read from this slide'}</button><button className={readAll ? 'all-button story-playing' : 'all-button'} aria-live="polite" disabled={!speechSupported && !hasNarrationAudio || readAll} onClick={() => { cancel(); if (index === 0) { setReadAll(true); speakAt(0, true); } else { setIndex(0); window.setTimeout(() => { setReadAll(true); speakAt(0, true); }, 0); } }}>{readAll ? '● Story playing' : 'Listen to entire story'}</button><button className="all-button" disabled={!speechSupported && !hasNarrationAudio} onClick={() => speakAt(index, readAll)}>↻ Replay slide</button><button className="all-button" disabled={!speechSupported && !hasNarrationAudio || !speaking} onClick={cancel}>■ Stop</button></div>
            <div className="narration-settings"><label>Voice {hasNarrationAudio ? <span>ElevenLabs / {narrationVoice || 'Narrator'}</span> : <select value={voiceName} onChange={e => { setVoiceName(e.target.value); if (speaking) cancel(); }}><option value="">System default</option>{voices.map(v => <option key={`${v.name}-${v.lang}`} value={v.name}>{v.name} · {v.lang}</option>)}</select>}</label><label>Speed <select value={speed} onChange={e => { const nextSpeed = Number(e.target.value); setSpeed(nextSpeed); if (audioRef.current) audioRef.current.playbackRate = nextSpeed; }}><option value="0.8">Slow</option><option value="1">Normal</option><option value="1.2">Fast</option></select></label><span className="caption-label">Text captions · approximate sentence highlight during narration</span></div></div>
        </div>
      </div>
    </div>
    {index === story.slides.length - 1 && <div className="reader-finish"><span>STORY COMPLETE</span><p>Keep exploring this mission.</p><Link className="button button-blue" to="/hardware">Visit Hardware Lab ↗</Link><button className="text-link" onClick={close}>Back to all stories →</button></div>}
  </section>;
}

function Videos() {
  const videos = [
    { id: 'P4boyXQuUIw', title: 'Mission video 01', url: 'https://youtu.be/P4boyXQuUIw?si=Ovzip9muNIKb53Mi' },
    { id: 'iIJcqiqYXG8', title: 'Mission video 02', url: 'https://youtu.be/iIJcqiqYXG8?si=6MTfjrPBB_5Ux9MG' },
    { id: 'EbCNU6aCDuM', title: 'Mission video 03', url: 'https://www.youtube.com/watch?v=EbCNU6aCDuM' },
    { id: 'yC-6LuHos8s', title: 'Mission video 04', url: 'https://youtu.be/yC-6LuHos8s?si=Q3LxxDVJMQcbKAKa' },
  ];
  const localVideos = [
    { title: 'Lunar surface, first-person view', description: 'Explore a supplied first-person view across the lunar surface.', src: '/videos/lunar-trek-first-person-view.mp4' },
    { title: 'Lunar Trek, third-person view', description: 'See the lunar exploration scene from a third-person perspective.', src: '/videos/lunar-trek-third-person-view.mp4' },
  ];
  return <section className="videos-page section-shell"><PageIntro tag="WATCH · 06 VIDEOS" title={<>See the mission<br/><em>in motion.</em></>} copy="Watch videos that bring space exploration to life:from missions and machines to views across the lunar surface."/><div className="video-grid">{videos.map(v => <article key={v.id} className="video-card"><div className="video-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${v.id}`} title={v.title} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/><noscript><a href={v.url}>Watch on YouTube</a></noscript></div><div className="video-caption"><span>VIDEO FILE / {v.id}</span><h3>{v.title}</h3><a href={v.url} target="_blank" rel="noreferrer">Watch on YouTube ↗</a></div></article>)}</div>{localVideos.map(video => <article key={video.src} className="local-video-card"><div className="local-video-title"><span>LOCAL VIDEO · PROJECT ASSET</span><h2>{video.title}</h2><p>{video.description}</p></div><video controls preload="metadata" playsInline src={video.src}>Your browser does not support this video. You can still explore the stories and labs.</video></article>)}</section>;
}

function Sources() { return <details className="sources"><summary>Sources & asset notes</summary><div className="sources-list"><p>Mission facts and image descriptions are based on NASA mission pages linked from each story and exhibit.</p><p>Local 3D model files were supplied in the project folder. Their original authorship and reuse terms were not included with the files; source metadata is therefore marked unavailable on each model exhibit.</p><p>The landing video and lunar viewpoint video are supplied local project assets. No NASA logo or endorsement is implied.</p>{exhibits.map(e => <a key={e.storyId} href={e.source} target="_blank" rel="noreferrer">{e.sourceLabel} ↗</a>)}</div></details>; }
function PageIntro({ tag, title, copy }: { tag: string; title: ReactNode; copy: string }) { return <div className="page-intro"><p className="eyebrow"><span className="signal-dot"/>{tag}</p><h1>{title}</h1><p>{copy}</p></div>; }
function NotFound() { return <section className="not-found section-shell"><p className="eyebrow">SIGNAL LOST</p><h1>This page drifted<br/><em>off course.</em></h1><Link to="/" className="button button-blue">Return to MissionLens ↗</Link></section>; }
function Footer() { return <footer className="site-footer"><Link to="/" className="brand" aria-label="MissionLens home"><BrandLogo/></Link><p>Curiosity, carried farther.</p><div><Link to="/stories">Stories</Link><Link to="/hardware">Hardware Lab</Link><Link to="/videos">Videos</Link><Link to="/about">About</Link></div><small>AN INDEPENDENT EDUCATIONAL EXPERIENCE · NOT AFFILIATED WITH NASA</small></footer>; }

export default App;

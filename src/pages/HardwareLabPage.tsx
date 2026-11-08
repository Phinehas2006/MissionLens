import { lazy, Suspense, useState } from 'react';
import React from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { exhibits, stories } from '../data/catalog';

const ModelViewer = lazy(() => import('../components/HardwareModelViewer'));

function PageIntro({ tag, title, copy }: { tag: string; title: ReactNode; copy: string }) { return <div className="page-intro"><p className="eyebrow"><span className="signal-dot"/>{tag}</p><h1>{title}</h1><p>{copy}</p></div>; }
function SceneGraphic({ type }: { type: string }) { return <div className={`scene-graphic scene-${type}`} aria-hidden="true"><span className="scene-orbit orbit-one"/><span className="scene-orbit orbit-two"/><span className="scene-body">{type === 'voyager' ? '◈' : type === 'ingenuity' ? '✣' : type === 'moon' ? '✦' : '◌'}</span><span className="scene-ground"/><span className="scene-star s1"/><span className="scene-star s2"/><span className="scene-star s3"/></div>; }
class ModelErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(_e: Error, _info: ErrorInfo) {}
  render() { return this.state.hasError ? <div className="model-error"><span>MODEL UNAVAILABLE</span><p>This exhibit model could not be loaded. The exhibit notes and diagrams are still available.</p></div> : this.props.children; }
}
export function HardwareLab() {
  const [selected, setSelected] = useState(0);
  const [showLabels, setShowLabels] = useState(true);
  const [part, setPart] = useState<number | null>(null);
  const item = exhibits[selected];
  const story = stories.find(s => s.id === item.storyId)!;
  return <section className="lab-page section-shell"><PageIntro tag="HARDWARE LAB · INTERACTIVE EXHIBITS" title={<>Machines for<br/><em>new worlds.</em></>} copy="Meet five pieces of flight and field hardware. Rotate each model, choose a label, and see what the parts did."/>
    <div className="exhibit-tabs" role="tablist" aria-label="Select a hardware exhibit">{exhibits.map((e, i) => <button key={e.storyId} role="tab" aria-selected={selected === i} onClick={() => { setSelected(i); setPart(null); }}><span>0{i + 1}</span>{e.title}</button>)}</div>
    <div className="exhibit-layout"><div className="exhibit-viewer"><div className="viewer-top"><span>EXHIBIT {String(selected + 1).padStart(2, '0')} / 05</span><button className={showLabels ? 'label-toggle active' : 'label-toggle'} aria-pressed={showLabels} onClick={() => setShowLabels(v => !v)}><span/> Show labels</button></div>
      {item.fallback ? <div className="illustrated-stage"><SceneGraphic type="moon"/><div className="fallback-stamp">ILLUSTRATED EXHIBIT<br/><small>NO MATCHING 3D MODEL IN PROJECT FILES</small></div><div className="stage-labels">{showLabels && item.facts.map((f, i) => <button key={f.label} style={{ left: `${f.x}%`, top: `${f.y}%` }} className={part === i ? 'stage-pin selected' : 'stage-pin'} onClick={() => setPart(i)} aria-label={`Show ${f.label} label`}><span>{i + 1}</span></button>)}</div></div>
      : <ModelErrorBoundary key={item.storyId}><Suspense fallback={<div className="model-loading">Loading 3D viewer…</div>}><ModelViewer url={item.model!} title={item.title}/></Suspense></ModelErrorBoundary>}
      <div className={showLabels ? 'viewer-parts' : 'viewer-parts labels-hidden'} aria-label="Model labels">{item.facts.map((f, i) => <button key={f.label} className={part === i ? 'part-button selected' : 'part-button'} onClick={() => setPart(part === i ? null : i)}><span>{String(i + 1).padStart(2, '0')}</span>{f.label}</button>)}</div>
    </div><aside className="exhibit-info"><p className="eyebrow">{item.destination.toUpperCase()} <span>·</span> {item.year}</p><h2>{item.title}</h2><p>{item.intro}</p>{part !== null && <div className="part-detail"><button aria-label="Close part explanation" onClick={() => setPart(null)}>×</button><span>PART {String(part + 1).padStart(2, '0')}</span><h3>{item.facts[part].label}</h3><p>{item.facts[part].detail}</p></div>}<div className="science-callout"><span>WHY IT MATTERS</span><p>{item.science}</p></div>
      {item.modelLabel && <p className="model-credit">3D file: {item.modelLabel}. <a href={item.source} target="_blank" rel="noreferrer">Mission reference ↗</a></p>}
      <div className="exhibit-links"><Link to={`/stories/${story.id}/read`}>Read the story ↗</Link><Link to="/science">Explore the science ↗</Link></div>
    </aside></div><details className="sources"><summary>Sources & asset notes</summary><div className="sources-list"><p>3D files were supplied in the project folder. Their original authorship and reuse terms were not included; source metadata is marked unavailable for each model.</p>{exhibits.map(e => <a key={e.storyId} href={e.source} target="_blank" rel="noreferrer">{e.sourceLabel} ↗</a>)}</div></details></section>;
}

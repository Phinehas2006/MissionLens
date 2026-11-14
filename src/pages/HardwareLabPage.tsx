import { lazy, Suspense, useState } from 'react';
import React from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { exhibits, stories } from '../data/catalog';
import { frenchExhibits } from '../data/catalog.fr';
import { frenchStories } from '../data/stories.fr';
import { useLanguage } from '../i18n/LanguageProvider';
import { translate } from '../i18n/translations';

const ModelViewer = lazy(() => import('../components/HardwareModelViewer'));

function PageIntro({ tag, title, copy }: { tag: string; title: ReactNode; copy: string }) { return <div className="page-intro"><p className="eyebrow"><span className="signal-dot"/>{tag}</p><h1>{title}</h1><p>{copy}</p></div>; }
function SceneGraphic({ type }: { type: string }) { return <div className={`scene-graphic scene-${type}`} aria-hidden="true"><span className="scene-orbit orbit-one"/><span className="scene-orbit orbit-two"/><span className="scene-body">{type === 'voyager' ? '◈' : type === 'ingenuity' ? '✣' : type === 'moon' ? '✦' : '◌'}</span><span className="scene-ground"/><span className="scene-star s1"/><span className="scene-star s2"/><span className="scene-star s3"/></div>; }
class ModelErrorBoundary extends React.Component<{ children: ReactNode; locale: 'en' | 'fr' }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(_e: Error, _info: ErrorInfo) {}
  render() { return this.state.hasError ? <div className="model-error"><span>{translate(this.props.locale, 'MODEL UNAVAILABLE')}</span><p>{translate(this.props.locale, 'This exhibit model could not be loaded. The exhibit notes and diagrams are still available.')}</p></div> : this.props.children; }
}
export function HardwareLab() {
  const { locale, t } = useLanguage();
  const shownExhibits = locale === 'fr' ? frenchExhibits : exhibits;
  const shownStories = locale === 'fr' ? frenchStories : stories;
  const [selected, setSelected] = useState(0);
  const [showLabels, setShowLabels] = useState(true);
  const [part, setPart] = useState<number | null>(null);
  const item = shownExhibits[selected];
  const englishItem = exhibits[selected];
  const story = shownStories.find(s => s.id === item.storyId)!;
  const identifiedFacts = item.facts.filter(f => f.modelTargets?.length);
  const selectedFact = part === null ? null : item.facts[part];
  return <section className="lab-page section-shell"><PageIntro tag={t('HARDWARE LAB · INTERACTIVE EXHIBITS')} title={<>{t('Machines for')}<br/><em>{t('new worlds.')}</em></>} copy={t('Meet five pieces of flight and field hardware. Rotate each model, choose a label, and see what the parts did.')}/>
    <div className="exhibit-tabs" role="tablist" aria-label={t('Select a hardware exhibit')}>{shownExhibits.map((e, i) => <button key={e.storyId} role="tab" aria-selected={selected === i} onClick={() => { setSelected(i); setPart(null); }}><span>0{i + 1}</span>{t(e.title)}</button>)}</div>
    <div key={item.storyId} className="exhibit-layout exhibit-content-transition"><div className="exhibit-viewer"><div className="viewer-top"><span>{t('EXHIBIT')} {String(selected + 1).padStart(2, '0')} / 05</span>{identifiedFacts.length > 0 && <button className={showLabels ? 'label-toggle active' : 'label-toggle'} aria-pressed={showLabels} onClick={() => setShowLabels(v => !v)}><span/> {t(showLabels ? 'Hide labels' : 'Show labels')}</button>}</div>
      {item.fallback ? <div className="illustrated-stage"><SceneGraphic type="moon"/><div className="fallback-stamp">{t('ILLUSTRATED EXHIBIT')}<br/><small>{t('NO MATCHING 3D MODEL IN PROJECT FILES')}</small></div><p className="part-availability fallback-availability">{t('This illustration has no inspectable 3D parts, so its parts are left unmarked.')}</p></div>
      : <ModelErrorBoundary key={item.storyId} locale={locale}><Suspense fallback={<div className="model-loading">{t('Loading 3D viewer…')}</div>}><ModelViewer url={item.model!} title={item.title} activeParts={showLabels ? selectedFact?.modelTargets ?? [] : []} markerNumber={part === null ? '' : String(part + 1).padStart(2, '0')}/></Suspense></ModelErrorBoundary>}
      {!item.fallback && <div className={showLabels || !identifiedFacts.length ? 'viewer-parts' : 'viewer-parts labels-hidden'} role="group" aria-label={t('Identified model parts')}>{identifiedFacts.length ? item.facts.map((f, i) => f.modelTargets?.length ? <button key={f.label} type="button" className={part === i ? 'part-button selected' : 'part-button'} aria-pressed={part === i} aria-controls="selected-part-panel" onClick={() => setPart(part === i ? null : i)}><span>{String(i + 1).padStart(2, '0')}</span>{f.label}</button> : null) : <p className="part-availability">{t('This model file does not identify individual parts reliably, so labels are unavailable and its parts are left unmarked.')}</p>}</div>}
    </div><aside className="exhibit-info"><p className="eyebrow">{item.destination.toUpperCase()} <span>·</span> {item.year}</p><h2>{t(item.title)}</h2><p>{item.intro}</p>{selectedFact && <div className="part-detail" id="selected-part-panel" aria-live="polite"><button type="button" aria-label={t('Close part explanation')} onClick={() => setPart(null)}>×</button><span>{t('PART')} {String(part! + 1).padStart(2, '0')}</span><h3>{selectedFact.label}</h3><p>{selectedFact.detail}</p></div>}<div className="science-callout"><span>{t('WHY IT MATTERS')}</span><p>{item.science}</p></div>
      {item.modelLabel && <p className="model-credit">{t('3D file')}: {locale === 'fr' ? t(englishItem.modelLabel ?? '') : item.modelLabel}. <a href={item.source} target="_blank" rel="noreferrer">{t('Mission reference ↗')}</a></p>}
      <div className="exhibit-links"><Link to={`/stories/${story.id}/read`}>{t('Read the story ↗')}</Link><Link to="/stories">{t('Explore the stories ↗')}</Link></div>
    </aside></div><details className="sources"><summary>{t('Sources & asset notes')}</summary><div className="sources-list"><p>{t('3D files were supplied in the project folder. Their original authorship and reuse terms were not included; source metadata is marked unavailable for each model.')}</p>{exhibits.map(e => <a key={e.storyId} href={e.source} target="_blank" rel="noreferrer">{e.sourceLabel} ↗</a>)}</div></details></section>;
}

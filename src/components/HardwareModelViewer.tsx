import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bounds, ContactShadows, Environment, Html, OrbitControls, useGLTF } from '@react-three/drei';

function Glb({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1}/>;
}

export default function HardwareModelViewer({ url, title }: { url: string; title: string }) {
  const controlsRef = useRef<any>(null);
  return <div className="model-canvas" role="img" aria-label={`Interactive 3D model: ${title}. Drag to rotate; use controls to zoom.`}>
    <Canvas camera={{ position: [4, 3, 5], fov: 38 }} dpr={[1, 1.25]} frameloop="demand"><color attach="background" args={['#e8f1fa']}/><ambientLight intensity={1.2}/><directionalLight position={[4, 6, 3]} intensity={2.4}/><Environment preset="city"/><Suspense fallback={<Html center className="model-loading">Loading model…</Html>}><Bounds fit clip observe margin={1.25}><Glb url={url}/></Bounds><ContactShadows position={[0, -1, 0]} opacity={.24} blur={2.2} scale={8}/></Suspense><OrbitControls ref={controlsRef} makeDefault enableDamping dampingFactor={.08} minDistance={2} maxDistance={10}/></Canvas>
    <div className="canvas-help">DRAG TO ROTATE <span>·</span> SCROLL TO ZOOM</div><button className="reset-view" onClick={() => controlsRef.current?.reset()}>Reset view</button></div>;
}

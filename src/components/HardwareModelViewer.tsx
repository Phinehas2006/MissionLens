import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, createPortal } from '@react-three/fiber';
import { Bounds, ContactShadows, Environment, Html, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

type ModelTarget = { node: string; material?: string };

function targetBounds(mesh: THREE.Mesh, target: ModelTarget) {
  const geometry = mesh.geometry;
  if (!target.material) {
    if (!geometry.boundingBox) geometry.computeBoundingBox();
    return geometry.boundingBox?.clone() ?? null;
  }
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  const materialIndex = materials.findIndex(material => material.name === target.material);
  if (materialIndex < 0) return null;
  const position = geometry.attributes.position;
  const box = new THREE.Box3().makeEmpty();
  for (const group of geometry.groups) {
    if (group.materialIndex !== materialIndex) continue;
    for (let offset = group.start; offset < group.start + group.count; offset++) {
      const vertexIndex = geometry.index ? geometry.index.getX(offset) : offset;
      box.expandByPoint(new THREE.Vector3().fromBufferAttribute(position, vertexIndex));
    }
  }
  return box.isEmpty() ? null : box;
}

function Glb({ url, activeParts, markerNumber }: { url: string; activeParts: ModelTarget[]; markerNumber: string }) {
  const { scene } = useGLTF(url);
  const model = useMemo(() => {
    const copy = scene.clone(true);
    copy.traverse(object => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.material = Array.isArray(mesh.material) ? mesh.material.map(material => material.clone()) : mesh.material.clone();
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach(material => {
        const standard = material as THREE.MeshStandardMaterial;
        if (standard.emissive) {
          standard.userData.baseEmissive = standard.emissive.clone();
          standard.userData.baseEmissiveIntensity = standard.emissiveIntensity;
        }
      });
    });
    return copy;
  }, [scene]);

  useEffect(() => {
    model.traverse(object => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) return;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach(material => {
        const standard = material as THREE.MeshStandardMaterial;
        if (!standard.emissive) return;
        standard.emissive.copy(standard.userData.baseEmissive ?? new THREE.Color('#000000'));
        standard.emissiveIntensity = standard.userData.baseEmissiveIntensity ?? 0;
        const selected = activeParts.some(part => part.node === mesh.name && (!part.material || part.material === material.name));
        if (selected) {
          standard.emissive.set('#4ba9ff');
          standard.emissiveIntensity = 0.55;
        }
      });
    });
  }, [activeParts, model]);

  const markers = activeParts.flatMap(target => {
    const mesh = model.getObjectByName(target.node) as THREE.Mesh | undefined;
    if (!mesh?.isMesh) return [];
    const bounds = targetBounds(mesh, target);
    if (!bounds) return [];
    const center = bounds.getCenter(new THREE.Vector3());
    return [createPortal(<Html position={center.toArray()} center zIndexRange={[20, 0]}><span className="model-callout-pin" aria-hidden="true">{markerNumber}</span></Html>, mesh)];
  });

  return <><primitive object={model} scale={1}/>{markers}</>;
}

export default function HardwareModelViewer({ url, title, activeParts = [], markerNumber = '' }: { url: string; title: string; activeParts?: ModelTarget[]; markerNumber?: string }) {
  const controlsRef = useRef<any>(null);
  return <div className="model-canvas" role="region" aria-label={'Interactive 3D model: ' + title + '. Drag to rotate; use controls to zoom.'}>
    <Canvas camera={{ position: [4, 3, 5], fov: 38 }} dpr={[1, 1.25]} frameloop="demand"><color attach="background" args={['#e8f1fa']}/><ambientLight intensity={1.2}/><directionalLight position={[4, 6, 3]} intensity={2.4}/><Environment preset="city"/><Suspense fallback={<Html center className="model-loading">Loading model…</Html>}><Bounds fit clip observe margin={1.25}><Glb url={url} activeParts={activeParts} markerNumber={markerNumber}/></Bounds><ContactShadows position={[0, -1, 0]} opacity={.24} blur={2.2} scale={8}/></Suspense><OrbitControls ref={controlsRef} makeDefault enableDamping dampingFactor={.08} minDistance={2} maxDistance={10}/></Canvas>
    <div className="canvas-help">DRAG TO ROTATE <span>·</span> SCROLL TO ZOOM</div><button className="reset-view" onClick={() => controlsRef.current?.reset()}>Reset view</button></div>;
}
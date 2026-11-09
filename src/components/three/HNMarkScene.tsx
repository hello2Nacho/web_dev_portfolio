"use client";
// The HN monogram: carved, hand-oiled wood with an adire engraving and a terracotta rim light.
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Center, Environment, Lightformer, RoundedBox, Text3D } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { carvedColor, engravingCanvas, woodCanvases } from "./textures.ts";

type Maps = { wood: THREE.Texture; rough: THREE.Texture; front: THREE.Texture; bump: THREE.Texture };

function useMaps(): Maps | null {
  const [maps, setMaps] = useState<Maps | null>(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      const { color, rough } = woodCanvases(1024);
      const engr = await engravingCanvas(1024);
      const tex = (c: HTMLCanvasElement, srgb = false) => {
        const t = new THREE.CanvasTexture(c);
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.anisotropy = 8;
        if (srgb) t.colorSpace = THREE.SRGBColorSpace;
        return t;
      };
      const m = { wood: tex(color, true), rough: tex(rough), front: tex(carvedColor(color, engr), true), bump: tex(engr) };
      // ExtrudeGeometry UVs are world units; letters span ≈ 2.4 units → show ~1 pattern tile across
      for (const t of [m.front, m.bump]) t.repeat.set(0.85, 0.85), t.offset.set(0.1, 0.3);
      if (alive) setMaps(m);
    })();
    return () => { alive = false; };
  }, []);
  return maps;
}

function Mark({ maps, plinth, still }: { maps: Maps; plinth: boolean; still: boolean }) {
  const spin = useRef<THREE.Group>(null!);
  const tilt = useRef<THREE.Group>(null!);
  const { pointer } = useThree();
  const [dims, setDims] = useState({ width: 2.6, height: 0.9 });
  const measured = useRef(false);
  const reduced = useMemo(() => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  const materials = useMemo(() => {
    const base = { roughness: 0.6, roughnessMap: maps.rough, clearcoat: 0.15, clearcoatRoughness: 0.45, sheen: 0.2, sheenColor: new THREE.Color("#5a3a26") };
    const front = new THREE.MeshPhysicalMaterial({ ...base, map: maps.front, bumpMap: maps.bump, bumpScale: -8 });
    const side = new THREE.MeshPhysicalMaterial({ ...base, map: maps.wood });
    return [front, side];
  }, [maps]);

  useFrame((state, dt) => {
    if (reduced || still) return;
    const d = Math.min(dt, 1 / 30);
    const t = state.clock.elapsedTime;
    const scroll = typeof window !== "undefined" ? window.scrollY / Math.max(1, document.body.scrollHeight - innerHeight) : 0;
    // ~20s per turn, eased back-and-forth feel is avoided: a true slow turn, plus scroll extra
    spin.current.rotation.y += d * ((Math.PI * 2) / 20);
    const maxTilt = THREE.MathUtils.degToRad(15);
    tilt.current.rotation.x = THREE.MathUtils.damp(tilt.current.rotation.x, -pointer.y * maxTilt, 4, d);
    tilt.current.rotation.z = THREE.MathUtils.damp(tilt.current.rotation.z, 0, 4, d);
    tilt.current.rotation.y = THREE.MathUtils.damp(tilt.current.rotation.y, pointer.x * maxTilt + scroll * 0.6, 4, d);
    tilt.current.position.y = Math.sin(t * 1.2) * 0.04;
  });

  return (
    <group ref={tilt}>
      <group ref={spin} rotation={[0, still ? -0.28 : -0.35, 0]}>
        <Center onCentered={({ width, height }) => { if (measured.current) return; measured.current = true; setDims({ width, height }); }}>
          <Text3D
            font="/fonts/display-800.typeface.json"
            size={1.2} height={0.35} curveSegments={12}
            bevelEnabled bevelSize={0.03} bevelThickness={0.03} bevelSegments={6}
            letterSpacing={0.09}
            material={materials}
            castShadow
          >
            HN
          </Text3D>
        </Center>
        {plinth && (
          <RoundedBox args={[dims.width + 0.5, 0.2, 0.95]} radius={0.08} smoothness={5} position={[0, -dims.height / 2 - 0.1, 0]} material={materials[1]} />
        )}
      </group>
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 1, 5]} intensity={0.5} color="#c9d3e6" />
      <directionalLight position={[-4, 5, 4]} intensity={3.2} color="#fff8ef" />
      <spotLight position={[3.5, 1.5, -3.5]} angle={0.7} penumbra={0.8} intensity={140} distance={16} color="#D2643C" />
      <pointLight position={[2.5, -0.5, -2]} intensity={22} color="#D2643C" />
      <pointLight position={[-2.8, 0.4, -2]} intensity={10} color="#D2643C" />
      {/* local light-formers instead of a downloaded HDRI: no network fetch, tiny cost */}
      <Environment resolution={64} environmentIntensity={0.45}>
        <Lightformer form="rect" intensity={2} position={[-3, 3, 3]} scale={[4, 2, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.5} position={[3, 0, -3]} scale={[3, 3, 1]} color="#D2643C" />
        <Lightformer form="ring" intensity={0.6} position={[0, -3, 2]} scale={2} color="#8A97AE" />
      </Environment>
    </>
  );
}

export default function HNMarkScene({ plinth = true, active = true, capture = false, still = false }: { plinth?: boolean; active?: boolean; capture?: boolean; still?: boolean }) {
  const maps = useMaps();
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0.15, 4.4], fov: 32 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: capture, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.35 }}
      onCreated={({ gl }) => { if (capture) (window as unknown as { __hnCanvas: HTMLCanvasElement }).__hnCanvas = gl.domElement; }}
      style={{ background: "transparent" }}
    >
      <Lights />
      {maps && <Mark maps={maps} plinth={plinth} still={still} />}
    </Canvas>
  );
}

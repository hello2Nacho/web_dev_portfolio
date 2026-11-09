"use client";
// Hero "unresist": undyed cotton with a faint starch pattern; indigo dye floods in from
// the edges (noise-driven), starch lines resist a moment longer. Canvas is removed when done.
import { useEffect, useRef, useState } from "react";
import { fullscreen, NOISE, program, texture } from "@/lib/gl.ts";
import { prefersReducedMotion, isTouch, isLowPower, weakGPU } from "@/lib/perf.ts";

const FRAG = `precision mediump float; varying vec2 vUv; uniform sampler2D starch; uniform float p, t; uniform vec2 res;
${NOISE}
void main(){
  vec2 uv = vUv; vec2 asp = vec2(res.x/res.y, 1.);
  vec2 q = uv*asp;
  float e = min(min(uv.x, 1.-uv.x)*asp.x, min(uv.y, 1.-uv.y)) ;
  float f = fbm(q*2.6 + vec2(t*.08, -t*.05));
  vec4 s = texture2D(starch, vec2(uv.x, 1.-uv.y));
  float line = 1. - smoothstep(.55, .9, s.r);           // starch lines = indigo ink in texture
  float field = e*2.1 + (f-.5)*.75 + line*.10;
  float k = p*1.55 - field;
  float dyed = smoothstep(0., .06, k);
  float fringe = smoothstep(-.01, .03, k) * (1. - smoothstep(.04, .16, k));
  vec3 cotton = vec3(.918,.906,.855);
  vec3 cloth = mix(cotton, vec3(.78,.77,.74), line*.55);   // faint starch on undyed cloth
  vec3 deep = vec3(.043,.098,.22);
  vec3 col = mix(cloth, deep, clamp(fringe*1.2, 0., 1.));
  float a = clamp((1. - dyed) + fringe*.85, 0., 1.);
  gl_FragColor = vec4(col*a, a);
}`;

export default function DyeFlood({ onProgress }: { onProgress?: (p: number) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [gone, setGone] = useState(false);
  const [cover, setCover] = useState(true);
  const [css, setCss] = useState(false);

  useEffect(() => {
    const finish = () => { setCover(false); setGone(true); onProgress?.(1); };
    const start = () => {
      if (prefersReducedMotion()) { onProgress?.(1); setTimeout(() => setCover(false), 30); setTimeout(() => setGone(true), 500); return; }
      if (isTouch() || isLowPower() || weakGPU()) {
        // CSS mask fallback: cotton shrinks from the edges inward, same timing as the shader.
        setCss(true);
        const t0 = performance.now();
        const tick = () => { const x = Math.min(1, (performance.now() - t0) / 1200); onProgress?.(x); if (x < 1) requestAnimationFrame(tick); else setGone(true); };
        requestAnimationFrame(tick);
        return;
      }
      const c = ref.current!;
      const gl = c.getContext("webgl", { premultipliedAlpha: true, alpha: true });
      if (!gl) return finish();
      const scale = isTouch() ? 0.4 : Math.min(devicePixelRatio, 1.25) * 0.75;
      c.width = Math.round(c.clientWidth * scale); c.height = Math.round(c.clientHeight * scale);
      const img = new Image();
      img.src = "/patterns/hero-starch.webp";
      img.decode().then(() => {
        const { pr, u } = program(gl, FRAG);
        fullscreen(gl); gl.useProgram(pr);
        texture(gl, 0, 0, img);
        gl.uniform2f(u("res"), c.width, c.height);
        gl.viewport(0, 0, c.width, c.height);
        const t0 = performance.now(), D = 1700;
        const frame = () => {
          const el = performance.now() - t0;
          const x = Math.min(1, el / D);
          const p = x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; // cloth in-out
          gl.uniform1f(u("p"), p); gl.uniform1f(u("t"), el / 1000);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
          if (el < 40) setCover(false);
          onProgress?.(p);
          if (x < 1) requestAnimationFrame(frame); else setGone(true);
        };
        requestAnimationFrame(frame);
      }).catch(finish);
    };
    const w = window as unknown as { __loaderDone?: boolean };
    if (w.__loaderDone) start();
    else { const h = () => start(); addEventListener("loader:done", h, { once: true }); return () => removeEventListener("loader:done", h); }
  }, [onProgress]);

  if (gone) return null;
  return (
    <>
      <canvas ref={ref} className="pointer-events-none absolute inset-0 z-20 h-full w-full" aria-hidden />
      {/* SSR cover so the page never flashes revealed before the shader starts */}
      <div className={`pointer-events-none absolute inset-0 z-20 bg-cotton ${css ? "dye-css" : `transition-opacity duration-500 ${cover ? "opacity-100" : "opacity-0"}`}`} aria-hidden>
        <div className="absolute inset-0 bg-[url(/patterns/hero-starch.webp)] bg-cover opacity-20" />
        {css && <div className="absolute inset-0 dye-css-fringe" />}
      </div>
    </>
  );
}

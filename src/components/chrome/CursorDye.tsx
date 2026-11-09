"use client";
// Cursor dye (desktop only): a light ink trail that bleeds and fades. Quarter-res, sleeps when idle.
import { useEffect, useRef } from "react";
import { richMotion } from "@/lib/perf.ts";
import { fullscreen, NOISE, program, target } from "@/lib/gl.ts";

const SIM = `precision mediump float; varying vec2 vUv; uniform sampler2D prev; uniform vec2 a, b, res; uniform float t, str;
${NOISE}
float seg(vec2 p, vec2 a, vec2 b){ vec2 pa=p-a, ba=b-a; float k=clamp(dot(pa,ba)/max(dot(ba,ba),1e-5),0.,1.); return length(pa-ba*k); }
void main(){
  vec2 asp = vec2(res.x/res.y, 1.);
  vec2 off = (vec2(fbm(vUv*6.+t*.05), fbm(vUv*6.-t*.05+7.)) - .5) * .004;   // bleed
  float v = texture2D(prev, vUv + off).r * .972 - .0035;
  float d = seg(vUv*asp, a*asp, b*asp);
  v += exp(-d*d/ .0009) * str * (.75 + .5*fbm(vUv*40.));
  gl_FragColor = vec4(clamp(v,0.,1.), 0., 0., 1.);
}`;
const OUT = `precision mediump float; varying vec2 vUv; uniform sampler2D src;
void main(){ float v = texture2D(src, vUv).r; gl_FragColor = vec4(vec3(.17,.30,.58)*v, v*.55); }`;

export default function CursorDye() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!richMotion()) return;
    const c = ref.current!;
    const gl = c.getContext("webgl", { premultipliedAlpha: false, alpha: true, antialias: false });
    if (!gl) return;
    let W = 0, H = 0, A = target(gl, 2, 2), B = target(gl, 2, 2);
    const resize = () => {
      W = Math.max(2, Math.round(innerWidth / 4)); H = Math.max(2, Math.round(innerHeight / 4));
      c.width = W; c.height = H; A = target(gl, W, H); B = target(gl, W, H);
    };
    resize();
    const sim = program(gl, SIM), out = program(gl, OUT);
    fullscreen(gl);
    let ax = -1, ay = -1, bx = -1, by = -1, last = 0, raf = 0, awake = false;
    const t0 = performance.now();
    const frame = () => {
      const now = performance.now();
      if (now - last > 2500) { awake = false; gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); return; }
      gl.viewport(0, 0, W, H);
      gl.bindFramebuffer(gl.FRAMEBUFFER, B.fb); gl.useProgram(sim.pr);
      gl.bindTexture(gl.TEXTURE_2D, A.tex);
      gl.uniform2f(sim.u("a"), ax, ay); gl.uniform2f(sim.u("b"), bx, by); gl.uniform2f(sim.u("res"), W, H);
      gl.uniform1f(sim.u("t"), (now - t0) / 1000); const moved = ax >= 0 && (ax !== bx || ay !== by);
      gl.uniform1f(sim.u("str"), moved ? 0.5 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      ax = bx; ay = by;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.useProgram(out.pr); gl.bindTexture(gl.TEXTURE_2D, B.tex);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      [A, B] = [B, A];
      raf = requestAnimationFrame(frame);
    };
    const move = (e: PointerEvent) => {
      bx = e.clientX / innerWidth; by = 1 - e.clientY / innerHeight;
      if (ax < 0) { ax = bx; ay = by; }
      last = performance.now();
      if (!awake && !document.hidden) { awake = true; raf = requestAnimationFrame(frame); }
    };
    addEventListener("pointermove", move); addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); removeEventListener("pointermove", move); removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[60] h-screen w-screen mix-blend-screen" aria-hidden />;
}

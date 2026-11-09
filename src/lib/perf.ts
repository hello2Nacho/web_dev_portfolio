// Capability checks shared by every effect.
export const isBrowser = () => typeof window !== "undefined";
export const prefersReducedMotion = () => isBrowser() && matchMedia("(prefers-reduced-motion: reduce)").matches;
export const isTouch = () => isBrowser() && matchMedia("(hover: none), (pointer: coarse)").matches;
export function isLowPower() {
  if (!isBrowser()) return true;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  return (nav.deviceMemory ?? 8) <= 4 && (navigator.hardwareConcurrency ?? 8) <= 4 || !!nav.connection?.saveData;
}
/** Full effects: desktop pointer, not reduced motion, not low power. */
export const richMotion = () => !prefersReducedMotion() && !isTouch() && !isLowPower();

/** True when WebGL is unavailable or software-rendered (SwiftShader/llvmpipe): skip heavy shaders. */
export function weakGPU() {
  if (!isBrowser()) return true;
  try {
    const gl = document.createElement("canvas").getContext("webgl");
    if (!gl) return true;
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const r = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return /swiftshader|llvmpipe|software/i.test(r);
  } catch { return true; }
}

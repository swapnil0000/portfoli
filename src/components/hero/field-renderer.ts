// A "data terrain": a grid of glowing points on a plane receding to a horizon,
// rippling over time and lifting under the cursor. Raw WebGL1 — no library —
// so the whole effect costs a few KB and is only fetched after page load.

// Projection constants, shared by the shader and the pointer → ground mapping.
const P = { spread: 2.2, ground: -0.42, near: 0.6, depth: 3.4, focal: 1.35, horizon: -0.04 };

const VERT = `
attribute vec2 a_grid;          // x in [-1,1], z in [0,1] (near → far)
uniform float u_time;
uniform float u_aspect;
uniform float u_dpr;
uniform float u_size;
uniform vec3 u_pointer;         // grid-space x, z, strength
varying float v_alpha;
varying float v_mix;
varying float v_lift;

const float SPREAD = ${P.spread.toFixed(3)};
const float GROUND = ${P.ground.toFixed(3)};
const float NEAR = ${P.near.toFixed(3)};
const float DEPTH = ${P.depth.toFixed(3)};
const float FOCAL = ${P.focal.toFixed(3)};
const float HORIZON = ${P.horizon.toFixed(3)};

void main() {
  float x = a_grid.x * SPREAD;
  float z = a_grid.y;
  float t = u_time * 0.22;

  float h = sin(x * 2.6 + t * 2.0) * 0.10
          + sin(z * 8.0 - t * 1.6 + x * 1.2) * 0.07
          + sin((x - z * 2.0) * 9.0 + t * 2.8) * 0.02;

  vec2 d = vec2(x, z * DEPTH) - vec2(u_pointer.x, u_pointer.y * DEPTH);
  float lift = exp(-dot(d, d) * 2.2) * u_pointer.z;
  h += lift * 0.22;

  float wz = NEAR + z * DEPTH;
  float wy = GROUND + h;
  gl_Position = vec4(x * FOCAL / u_aspect, wy * FOCAL + HORIZON * wz, 0.0, wz);

  gl_PointSize = (u_size / wz) * u_dpr * (1.0 + lift * 1.5);
  float edge = 1.0 - smoothstep(0.55, 1.0, abs(a_grid.x));
  v_alpha = (1.0 - z * 0.85) * edge * (0.6 + h * 2.0 + lift);
  v_mix = a_grid.x * 0.5 + 0.5;
  v_lift = lift;
}
`;

const FRAG = `
precision mediump float;
varying float v_alpha;
varying float v_mix;
varying float v_lift;
const vec3 CYAN = vec3(0.369, 0.949, 1.0);
const vec3 VIOLET = vec3(0.608, 0.482, 1.0);
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  if (r > 0.5) discard;
  float a = smoothstep(0.5, 0.0, r) * clamp(v_alpha, 0.0, 1.0);
  vec3 col = mix(CYAN, VIOLET, v_mix) + v_lift * 0.6;
  gl_FragColor = vec4(col, a);
}
`;

export type Field = { destroy: () => void };

export function createField(canvas: HTMLCanvasElement, opts: { animate: boolean; dense: boolean }): Field | null {
  const gl = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: false, powerPreference: "low-power" });
  if (!gl) return null;

  const program = link(gl, VERT, FRAG);
  if (!program) return null;
  gl.useProgram(program);

  const cols = opts.dense ? 150 : 84;
  const rows = opts.dense ? 70 : 46;
  const grid = new Float32Array(cols * rows * 2);
  for (let j = 0, i = 0; j < rows; j++) {
    for (let k = 0; k < cols; k++) {
      grid[i++] = (k / (cols - 1)) * 2 - 1;
      grid[i++] = j / (rows - 1);
    }
  }
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, grid, gl.STATIC_DRAW);
  const aGrid = gl.getAttribLocation(program, "a_grid");
  gl.enableVertexAttribArray(aGrid);
  gl.vertexAttribPointer(aGrid, 2, gl.FLOAT, false, 0, 0);

  const u = (n: string) => gl.getUniformLocation(program, n);
  const uTime = u("u_time"), uAspect = u("u_aspect"), uDpr = u("u_dpr"), uSize = u("u_size"), uPointer = u("u_pointer");

  gl.enable(gl.BLEND);
  // Additive glow; alpha accumulates linearly so faint points stay visible.
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE);
  gl.clearColor(0, 0, 0, 0);

  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  let aspect = 1;
  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    aspect = w / Math.max(1, h);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform1f(uAspect, aspect);
    gl.uniform1f(uDpr, dpr);
    gl.uniform1f(uSize, w < 640 ? 4.2 : 5.2);
  };
  resize();

  // Pointer → point on the ground plane (inverse of the vertex projection).
  const target = { x: 0, z: 0.35, s: 0 };
  const pointer = { x: 0, z: 0.35, s: 0 };
  const onMove = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = 1 - ((e.clientY - rect.top) / rect.height) * 2;
    const denom = ny - P.horizon;
    if (denom >= -0.02) return void (target.s = 0);
    const wz = (P.ground * P.focal) / denom;
    target.x = (nx * aspect * wz) / P.focal;
    target.z = (wz - P.near) / P.depth;
    target.s = target.z >= 0 && target.z <= 1 ? 1 : 0;
  };
  const onLeave = () => (target.s = 0);

  let raf = 0;
  let visible = true;
  const start = performance.now() - 6000;
  const frame = (now: number) => {
    pointer.x += (target.x - pointer.x) * 0.08;
    pointer.z += (target.z - pointer.z) * 0.08;
    pointer.s += (target.s - pointer.s) * 0.05;
    gl.uniform1f(uTime, (now - start) / 1000);
    gl.uniform3f(uPointer, pointer.x, pointer.z, pointer.s);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, cols * rows);
    if (opts.animate && visible && !document.hidden) raf = requestAnimationFrame(frame);
  };
  const resume = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(frame);
  };

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && opts.animate) resume();
  });
  io.observe(canvas);
  const ro = new ResizeObserver(() => {
    resize();
    if (!opts.animate) resume();
  });
  ro.observe(canvas);
  const onVisibility = () => !document.hidden && visible && opts.animate && resume();
  document.addEventListener("visibilitychange", onVisibility);
  if (opts.animate) {
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
  }
  resume();

  return {
    destroy() {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}

function link(gl: WebGLRenderingContext, vs: string, fs: string) {
  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const v = compile(gl.VERTEX_SHADER, vs);
  const f = compile(gl.FRAGMENT_SHADER, fs);
  if (!v || !f) return null;
  const p = gl.createProgram()!;
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.linkProgram(p);
  return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null;
}

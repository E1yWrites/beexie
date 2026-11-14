import { useEffect, useRef } from 'react';

/**
 * Silk plate: slow flowing fabric folds drawn by a tiny WebGL fragment shader.
 * Art plates only (cover, back cover); UI never glides. No dependencies.
 * Pauses off screen and in hidden tabs, renders one still frame under
 * prefers-reduced-motion, and draws nothing without WebGL (the parent's
 * flat plate color shows instead).
 */

const VERTEX = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAGMENT = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uColor;

float grain(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes.y * 1.6;
  uv = mat2(0.8, -0.6, 0.6, 0.8) * uv;
  float t = uTime;

  // warp the cloth, then fold it
  vec2 p = uv;
  p.y += 0.14 * sin(2.1 * p.x + t * 0.55);
  p.x += 0.10 * sin(1.7 * p.y - t * 0.45);
  float folds = sin(3.0 * (p.x + p.y) + 1.4 * sin(1.3 * p.x - 0.8 * p.y + t * 0.35) + t * 0.28);
  float weave = sin(11.0 * (p.x - 0.4 * p.y) + 2.0 * folds + t * 0.6);

  float sheen = pow(0.5 + 0.5 * folds, 1.6);
  float v = 0.30 + 0.60 * sheen + 0.05 * weave;
  v += 0.16 * pow(max(0.0, folds), 8.0);

  vec3 col = uColor * v;
  col += (grain(gl_FragCoord.xy + fract(t)) - 0.5) * 0.035;
  gl_FragColor = vec4(col, 1.0);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

interface SilkPlateProps {
  /** Peak sheen color; folds fall toward a third of it. */
  color: string;
  className?: string;
}

export function SilkPlate({ color, className }: SilkPlateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'uRes');
    const uTime = gl.getUniformLocation(program, 'uTime');
    gl.uniform3fv(gl.getUniformLocation(program, 'uColor'), hexToRgb(color));

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let visible = true;
    let elapsed = 12; // start mid-motion so the first frame already has folds
    let last = performance.now();

    const resize = () => {
      // ponytail: DPR capped at 1.5; silk is soft, full retina resolution buys nothing visible
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      gl.uniform2f(uRes, width, height);
    };

    const draw = () => {
      gl.uniform1f(uTime, elapsed);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      canvas.dataset.ready = 'true';
    };

    const tick = (now: number) => {
      elapsed += Math.min(0.05, (now - last) / 1000);
      last = now;
      draw();
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (reduced || frame || !visible || document.hidden) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const sizeObserver = new ResizeObserver(() => {
      resize();
      draw();
    });
    sizeObserver.observe(canvas);

    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    viewObserver.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    resize();
    draw();
    start();

    return () => {
      stop();
      sizeObserver.disconnect();
      viewObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [color]);

  return <canvas ref={canvasRef} className={`silk${className ? ` ${className}` : ''}`} aria-hidden="true" />;
}

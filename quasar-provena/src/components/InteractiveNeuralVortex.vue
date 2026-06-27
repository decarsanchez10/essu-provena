<template>
  <canvas
    ref="canvasRef"
    class="fixed inset-0 w-full h-full pointer-events-none opacity-95 z-0"
    id="neuro"
  ></canvas>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const canvasRef = ref(null);
const pointer = { x: 0, y: 0, tX: 0, tY: 0 };
let animationFrame;

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    console.error('WebGL not supported');
    return;
  }

  const vsSource = `
    precision mediump float;
    attribute vec2 a_position;
    varying vec2 vUv;
    void main() {
      vUv = .5 * (a_position + 1.);
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fsSource = `
    precision mediump float;
    varying vec2 vUv;
    uniform float u_time;
    uniform float u_ratio;
    uniform vec2 u_pointer_position;
    uniform float u_scroll_progress;
    
    vec2 rotate(vec2 uv, float th) {
      return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
    }
    
    float neuro_shape(vec2 uv, float t, float p) {
      vec2 sine_acc = vec2(0.);
      vec2 res = vec2(0.);
      float scale = 8.;
      for (int j = 0; j < 15; j++) {
        uv = rotate(uv, 1.);
        sine_acc = rotate(sine_acc, 1.);
        vec2 layer = uv * scale + float(j) + sine_acc - t;
        sine_acc += sin(layer) + 2.4 * p;
        res += (.5 + .5 * cos(layer)) / scale;
        scale *= (1.2);
      }
      return res.x + res.y;
    }
    
    void main() {
      vec2 uv = .5 * vUv;
      uv.x *= u_ratio;
      vec2 pointer = vUv - u_pointer_position;
      pointer.x *= u_ratio;
      float p = clamp(length(pointer), 0., 1.);
      p = .5 * pow(1. - p, 2.);
      float t = .001 * u_time;
      vec3 color = vec3(0.);
      float noise = neuro_shape(uv, t, p);
      noise = 1.2 * pow(noise, 3.);
      noise += pow(noise, 10.);
      noise = max(.0, noise - .5);
      noise *= (1. - length(vUv - .5));
      // Green palette
      color = vec3(0.13, 0.78, 0.45); // primary green
      color = mix(color, vec3(0.25, 0.85, 0.55), 0.32 + 0.16 * sin(2.0 * u_scroll_progress + 1.2));
      color += vec3(0.2, 0.6, 0.4) * sin(2.0 * u_scroll_progress + 1.5);
      color = color * noise;
      gl_FragColor = vec4(color, noise);
    }
  `;

  const compileShader = (src, type) => {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error('Shader error:', gl.getShaderInfoLog(sh));
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  };

  const vertexShader = compileShader(vsSource, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(fsSource, gl.FRAGMENT_SHADER);
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    return;
  }
  gl.useProgram(program);

  const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  const posLoc = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const uTime = gl.getUniformLocation(program, 'u_time');
  const uRatio = gl.getUniformLocation(program, 'u_ratio');
  const uPointer = gl.getUniformLocation(program, 'u_pointer_position');
  const uScroll = gl.getUniformLocation(program, 'u_scroll_progress');

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform1f(uRatio, canvas.width / canvas.height);
  };
  resize();
  window.addEventListener('resize', resize);

  const render = () => {
    const now = performance.now();
    pointer.x += (pointer.tX - pointer.x) * 0.2;
    pointer.y += (pointer.tY - pointer.y) * 0.2;
    gl.uniform1f(uTime, now);
    gl.uniform2f(uPointer, pointer.x / window.innerWidth, 1 - pointer.y / window.innerHeight);
    gl.uniform1f(uScroll, window.pageYOffset / (2 * window.innerHeight));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    animationFrame = requestAnimationFrame(render);
  };
  render();

  const move = (e) => {
    pointer.tX = e.clientX;
    pointer.tY = e.clientY;
  };
  window.addEventListener('pointermove', move);
  window.addEventListener('touchmove', (e) => {
    if (e.touches[0]) {
      pointer.tX = e.touches[0].clientX;
      pointer.tY = e.touches[0].clientY;
    }
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', move);
    cancelAnimationFrame(animationFrame);
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
  });
});
</script>

<style scoped>
/* No extra styles needed – canvas is already full‑screen */
</style>

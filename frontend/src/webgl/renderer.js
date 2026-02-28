import GPUCompositor from './compositor/GPUCompositor';

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

function createProgram(gl, vs, fs) {
  const program = gl.createProgram();
  gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(program);
  return program;
}

const vertexSource = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main(){
  v_uv = (a_pos + 1.0) * 0.5;
  gl_Position = vec4(a_pos,0.0,1.0);
}`;

const baseFragment = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;
uniform float u_time;
void main(){
  float vignette = smoothstep(1.0, 0.2, distance(v_uv, vec2(0.5)));
  vec3 base = vec3(0.08,0.08,0.12) + 0.08 * sin(vec3(v_uv.x, v_uv.y, v_uv.x+v_uv.y) * 6.0 + u_time);
  outColor = vec4(base * vignette, 1.0);
}`;

const blurFragment = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;
uniform float u_blurAmount;
void main(){
  vec2 o = vec2(u_blurAmount * 0.002, 0.0);
  vec4 c = vec4(0.0);
  c += vec4(0.2) * vec4(v_uv,1.0,1.0);
  c += vec4(0.2) * vec4(v_uv + o,1.0,1.0);
  c += vec4(0.2) * vec4(v_uv - o,1.0,1.0);
  c += vec4(0.2) * vec4(v_uv + o.yx,1.0,1.0);
  c += vec4(0.2) * vec4(v_uv - o.yx,1.0,1.0);
  outColor = c;
}`;

const lutFragment = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;
uniform float u_lutStrength;
void main(){
  vec3 color = vec3(v_uv, 0.5);
  vec3 graded = vec3(color.r * 0.95, color.g * 1.02, color.b * 1.08);
  outColor = vec4(mix(color, graded, u_lutStrength), 1.0);
}`;

export function initRenderer(canvas) {
  const gl = canvas.getContext('webgl2');
  if (!gl) {
    throw new Error('WebGL2 not supported');
  }

  const program = createProgram(gl, vertexSource, baseFragment);
  const vao = gl.createVertexArray();
  const buffer = gl.createBuffer();

  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(program, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const compositor = new GPUCompositor(gl, vao);
  compositor.registerDefaultShaders(vertexSource, baseFragment, blurFragment, lutFragment);

  return {
    drawFrame(time = 0) {
      compositor.composeFrame({ width: canvas.width, height: canvas.height, time: time * 0.001 });
    }
  };
}

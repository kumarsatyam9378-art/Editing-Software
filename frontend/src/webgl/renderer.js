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

const fragmentSource = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;
uniform float u_time;
void main(){
  float vignette = smoothstep(1.0, 0.2, distance(v_uv, vec2(0.5)));
  vec3 base = vec3(0.08,0.08,0.12) + 0.08 * sin(vec3(v_uv.x, v_uv.y, v_uv.x+v_uv.y) * 6.0 + u_time);
  outColor = vec4(base * vignette, 1.0);
}`;

export function initRenderer(canvas) {
  const gl = canvas.getContext('webgl2');
  if (!gl) {
    throw new Error('WebGL2 not supported');
  }

  const program = createProgram(gl, vertexSource, fragmentSource);
  const vao = gl.createVertexArray();
  const buffer = gl.createBuffer();
  const fbo = gl.createFramebuffer();

  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    1, 1
  ]), gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(program, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uTime = gl.getUniformLocation(program, 'u_time');

  function drawFrame(time = 0) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(program);
    gl.uniform1f(uTime, time * 0.001);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, fbo);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
    gl.blitFramebuffer(0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height, gl.COLOR_BUFFER_BIT, gl.NEAREST);
  }

  return { drawFrame };
}

export default class PassManager {
  constructor(gl, framebufferPool, shaderRegistry) {
    this.gl = gl;
    this.framebufferPool = framebufferPool;
    this.shaderRegistry = shaderRegistry;
  }

  runPasses({ width, height, passes, vao, uniforms = {} }) {
    let current = null;

    passes.forEach((pass, index) => {
      const target = index === passes.length - 1 ? null : this.framebufferPool.acquire(width, height);
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, target?.framebuffer || null);
      this.gl.viewport(0, 0, width, height);

      const program = this.shaderRegistry.get(pass.shader);
      this.gl.useProgram(program);
      this.gl.bindVertexArray(vao);

      Object.entries({ ...uniforms, ...(pass.uniforms || {}) }).forEach(([name, value]) => {
        const loc = this.gl.getUniformLocation(program, name);
        if (!loc) return;
        if (typeof value === 'number') this.gl.uniform1f(loc, value);
      });

      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

      if (current) this.framebufferPool.release(current);
      current = target;
    });

    if (current) this.framebufferPool.release(current);
  }
}

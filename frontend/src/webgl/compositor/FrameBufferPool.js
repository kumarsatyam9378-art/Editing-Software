export default class FrameBufferPool {
  constructor(gl) {
    this.gl = gl;
    this.pool = [];
  }

  acquire(width, height) {
    const foundIndex = this.pool.findIndex((item) => item.width === width && item.height === height && !item.inUse);
    if (foundIndex >= 0) {
      this.pool[foundIndex].inUse = true;
      return this.pool[foundIndex];
    }

    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, width, height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

    const framebuffer = this.gl.createFramebuffer();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, texture, 0);

    const slot = { width, height, texture, framebuffer, inUse: true };
    this.pool.push(slot);
    return slot;
  }

  release(slot) {
    slot.inUse = false;
  }
}

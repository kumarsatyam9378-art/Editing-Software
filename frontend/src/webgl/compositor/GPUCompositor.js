import FrameBufferPool from './FrameBufferPool';
import ShaderRegistry from './ShaderRegistry';
import PassManager from './PassManager';

export default class GPUCompositor {
  constructor(gl, vao) {
    this.gl = gl;
    this.vao = vao;
    this.pool = new FrameBufferPool(gl);
    this.registry = new ShaderRegistry(gl);
    this.passManager = new PassManager(gl, this.pool, this.registry);
  }

  registerDefaultShaders(vertexSource, baseFragmentSource, blurFragmentSource, lutFragmentSource) {
    this.registry.register('base', vertexSource, baseFragmentSource);
    this.registry.register('gaussian-blur', vertexSource, blurFragmentSource);
    this.registry.register('lut-pass', vertexSource, lutFragmentSource);
  }

  composeFrame({ width, height, time }) {
    this.passManager.runPasses({
      width,
      height,
      vao: this.vao,
      uniforms: { u_time: time },
      passes: [
        { shader: 'base' },
        { shader: 'gaussian-blur', uniforms: { u_blurAmount: 0.2 } },
        { shader: 'lut-pass', uniforms: { u_lutStrength: 0.15 } }
      ]
    });
  }
}

export default class ShaderRegistry {
  constructor(gl) {
    this.gl = gl;
    this.programs = new Map();
  }

  register(name, vertexSource, fragmentSource) {
    const program = this.#createProgram(vertexSource, fragmentSource);
    this.programs.set(name, program);
  }

  get(name) {
    return this.programs.get(name);
  }

  #createProgram(vertexSource, fragmentSource) {
    const compile = (type, source) => {
      const shader = this.gl.createShader(type);
      this.gl.shaderSource(shader, source);
      this.gl.compileShader(shader);
      return shader;
    };

    const program = this.gl.createProgram();
    this.gl.attachShader(program, compile(this.gl.VERTEX_SHADER, vertexSource));
    this.gl.attachShader(program, compile(this.gl.FRAGMENT_SHADER, fragmentSource));
    this.gl.linkProgram(program);
    return program;
  }
}

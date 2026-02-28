export default class Matrix2D {
  constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
    this.a = a; this.b = b; this.c = c; this.d = d; this.tx = tx; this.ty = ty;
  }

  static identity() { return new Matrix2D(); }

  static translation(x, y) { return new Matrix2D(1, 0, 0, 1, x, y); }

  static scale(sx, sy = sx) { return new Matrix2D(sx, 0, 0, sy, 0, 0); }

  static rotation(rad) {
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return new Matrix2D(cos, sin, -sin, cos, 0, 0);
  }

  multiply(other) {
    return new Matrix2D(
      this.a * other.a + this.c * other.b,
      this.b * other.a + this.d * other.b,
      this.a * other.c + this.c * other.d,
      this.b * other.c + this.d * other.d,
      this.a * other.tx + this.c * other.ty + this.tx,
      this.b * other.tx + this.d * other.ty + this.ty
    );
  }

  inverse() {
    const det = this.a * this.d - this.b * this.c;
    if (Math.abs(det) < 1e-8) return Matrix2D.identity();
    const inv = 1 / det;
    return new Matrix2D(
      this.d * inv,
      -this.b * inv,
      -this.c * inv,
      this.a * inv,
      (this.c * this.ty - this.d * this.tx) * inv,
      (this.b * this.tx - this.a * this.ty) * inv
    );
  }

  apply(point) {
    return {
      x: point.x * this.a + point.y * this.c + this.tx,
      y: point.x * this.b + point.y * this.d + this.ty
    };
  }
}

export class Vector3 {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   *  Calculates the dot product between two Vector3 objects
   * @param other Another Vector3 object to perform the dot product with
   * @returns The resulted dot product
   */
  dot(other: Vector3): number {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  minus(other: Vector3): Vector3 {
    return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  add(other: Vector3): Vector3 {
    return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  multiply(other: number | Vector3) {
    if (typeof other === "number") {
      return new Vector3(this.x * other, this.y * other, this.z * other);
    } else {
      return new Vector3(this.x * other.x, this.y * other.y, this.z * other.z);
    }
  }

  copyValues(other: Vector3) {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
  }
}

export class Point extends Vector3 {
  color: Vector3 = new Vector3(0.2, 0.2, 0.2);

  setColor(r: number, g: number, b: number) {
    this.color = new Vector3(r, g, b);
  }
}

export class Direction extends Vector3 {
  flip(): Direction {
    return new Direction(-this.x, -this.y, -this.z);
  }
  normalize() {
    const deno = Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    this.x = this.x / deno;
    this.y = this.y / deno;
    this.z = this.z / deno;
  }
}

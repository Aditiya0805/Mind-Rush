// dist: 100 = guru sangat jauh, 0 = tertangkap.
export default class ChaseSystem {
  constructor(diff) { this.d = diff; this.dist = diff.start; this.elapsed = 0; this.active = true; }
  get speed() { return this.d.speed + this.d.ramp * this.elapsed; }
  get caught() { return this.dist <= 0; }
  get danger() { return this.dist < 25; }
  update(dt) {
    if (!this.active) return;
    this.elapsed += dt;
    this.dist = Math.max(0, this.dist - this.speed * dt);
  }
  push(n) { if (this.active) this.dist = Math.min(100, this.dist + n); }
  pull(n) { if (this.active) this.dist = Math.max(0, this.dist - n); }
  stop() { this.active = false; }
}

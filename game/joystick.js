export class Joystick {
  constructor(x, y, radius = 50, knobRadius = 20) {
    this.center = { x, y };
    this.knob = { x, y };
    this.radius = radius;
    this.knobRadius = knobRadius;
    this.active = false;
    this.direction = { x: 0, y: 0 };
  }

  handleTouch(touch) {
    const dx = touch.clientX - this.center.x;
    const dy = touch.clientY - this.center.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = this.radius;

    if (dist > maxDist) {
      const ratio = maxDist / dist;
      this.knob.x = this.center.x + dx * ratio;
      this.knob.y = this.center.y + dy * ratio;
    } else {
      this.knob.x = touch.clientX;
      this.knob.y = touch.clientY;
    }

    this.direction = {
      x: (this.knob.x - this.center.x) / maxDist,
      y: (this.knob.y - this.center.y) / maxDist
    };
  }

  reset() {
    this.active = false;
    this.knob = { ...this.center };
    this.direction = { x: 0, y: 0 };
  }

  draw(ctx) {
    if (!this.active) return;

    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath();
    ctx.arc(this.knob.x, this.knob.y, this.knobRadius, 0, Math.PI * 2);
    ctx.fill();
  }
}

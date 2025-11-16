export class SkillButton {
  constructor(x, y, radius, label, onPress) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.label = label;
    this.isPressed = false;
    this.onPress = onPress;
  }

  contains(px, py) {
    const dx = px - this.x;
    const dy = py - this.y;
    return dx * dx + dy * dy <= this.radius * this.radius;
  }

  draw(ctx) {
    ctx.fillStyle = this.isPressed ? 'rgba(200,200,255,0.9)' : 'rgba(255,255,255,0.6)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.label, this.x, this.y);
  }
}

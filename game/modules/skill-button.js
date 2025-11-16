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
    // Save context state
    ctx.save();
    
    // Reset transform for proper positioning
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    ctx.fillStyle = this.isPressed ? 'rgba(200,200,255,0.9)' : 'rgba(255,255,255,0.6)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.font = `${Math.max(12, 20 * (this.radius / 40))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.label, this.x, this.y);
    
    // Restore context state
    ctx.restore();
  }
}
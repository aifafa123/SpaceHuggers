import { Joystick } from './joystick.js'
import { SkillButton } from './skill-button.js'

export class ControlLayer {
  constructor(canvas, ctx) {
    const w = canvas.width;
    const h = canvas.height;

    this.canvas = canvas;
    this.ctx = ctx;
    this.joystick = new Joystick(100, h - 100);
    this.skillButtons = [
      new SkillButton(w - 100, h - 100, 40, 'A', () => console.log('Skill A')),
      new SkillButton(w - 200, h - 100, 40, 'B', () => console.log('Skill B')),
      new SkillButton(w - 300, h - 100, 40, 'C', () => console.log('Skill C')),
    ];
  }

  handleTouchStart(touches) {
    const touch = touches[0];
    if (touch.clientX < this.canvas.width / 2) {
      this.joystick.active = true;
      this.joystick.handleTouch(touch);
    } else {
      for (const btn of this.skillButtons) {
        if (btn.contains(touch.clientX, touch.clientY)) {
          btn.isPressed = true;
          btn.onPress();
        }
      }
    }
  }

  handleTouchMove(touches) {
    if (!this.joystick.active) return;
    const touch = touches[0];
    this.joystick.handleTouch(touch);
  }

  handleTouchEnd() {
    this.joystick.reset();
    this.skillButtons.forEach(btn => (btn.isPressed = false));
  }

  update() {
    // 输出摇杆方向用于控制角色
    // console.log(this.joystick.direction);
  }

  draw() {
    this.joystick.draw(this.ctx);
    this.skillButtons.forEach(btn => btn.draw(this.ctx));
  }
}

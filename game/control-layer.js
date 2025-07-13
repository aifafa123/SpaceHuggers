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
      new SkillButton(w - 100, h - 100, 40, 'A', (pressed) => {
        console.log('Skill A')
        if(pressed){
          inputData[0][0] = {d: 1, p: 1}
        }else {
          inputData[0][0] = {d: 0, p: 0, r: 1}
        }
      }),
      new SkillButton(w - 200, h - 100, 40, 'B', (pressed) => {
        console.log('Skill B')
        if(pressed){
          inputData[0][2] = {d: 1, p: 1}
        }else {
          inputData[0][2] = {d: 0, p: 0, r: 1}
        }
      }),
      new SkillButton(w - 300, h - 100, 40, 'C', () => console.log('Skill C')),
    ];
  }

  handleTouchStart(touches) {
    for(let i = 0; i< touches.length; i++){
      const touch = touches[i];
      if (touch.clientX < this.canvas.width / 2) {
        this.joystick.active = true;
        this.joystick.handleTouch(touch);
        this.joystick.touchIndex = i;
      } else {
        for (const btn of this.skillButtons) {
          if (btn.contains(touch.clientX, touch.clientY)) {
            btn.isPressed = true;
            btn.onPress(true);
            btn.touchIndex = i;
          }
        }
      }
    }
  }

  handleTouchMove(touches) {
    if (!this.joystick.active) return;
    const touch = touches[this.joystick.touchIndex];
    this.joystick.handleTouch(touch);
  }

  handleTouchEnd() {
    this.joystick.reset();
    this.skillButtons.forEach(btn => {
      if(btn.isPressed){
        btn.isPressed = false
        btn.onPress(false)
      }
    });
  }

  update() {
    // 输出摇杆方向用于控制角色
    // console.log(this.joystick.direction);
    inputData[0][38] = {d: 0, p: 0, r: 1}
    inputData[0][37] = {d: 0, p: 0, r: 1}
    inputData[0][39] = {d: 0, p: 0, r: 1}
    inputData[0][40] = {d: 0, p: 0, r: 1}
    const data = this.joystick
    if(data.direction.label === 'up'){
        inputData[0][38] = {d: 1, p: 1}
    }else if(data.direction.label === 'left'){
        inputData[0][37] = {d: 1, p: 1}
    }else if(data.direction.label === 'right'){
        inputData[0][39] = {d: 1, p: 1}
    }else if(data.direction.label === 'down'){
        inputData[0][40] = {d: 1, p: 1}
    }
  }

  draw() {
    this.joystick.draw(this.ctx);
    this.skillButtons.forEach(btn => btn.draw(this.ctx));
    this.update()
  }
}

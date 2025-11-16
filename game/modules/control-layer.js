export class ControlLayer {
  constructor(canvas, ctx) {
    const w = canvas.width;
    const h = canvas.height;
    
    // Calculate scaled sizes based on screen dimensions
    const screenWidth = typeof wx !== 'undefined' && wx.getSystemInfoSync ? 
        wx.getSystemInfoSync().windowWidth : 
        window.innerWidth;
        
    const screenHeight = typeof wx !== 'undefined' && wx.getSystemInfoSync ? 
        wx.getSystemInfoSync().windowHeight : 
        window.innerHeight;
        
    // Base sizes for a reference screen (e.g., 375x667 iPhone SE)
    const baseScreenWidth = 375;
    const baseScreenHeight = 667;
    
    // Scale factor based on screen size
    const scaleFactor = Math.min(screenWidth / baseScreenWidth, screenHeight / baseScreenHeight);
    
    // Scaled sizes for UI elements - doubled the base sizes again and increased spacing
    const joystickRadius = Math.max(60, 200 * scaleFactor); // Doubled again from 100 to 200
    const joystickKnobRadius = Math.max(30, 100 * scaleFactor); // Doubled again from 50 to 100
    const buttonRadius = Math.max(50, 160 * scaleFactor); // Doubled again from 80 to 160
    const buttonSpacing = 100 * scaleFactor; // Increased spacing to prevent overlap
    
    this.canvas = canvas;
    this.ctx = ctx;
    
    // Position joystick with proper scaling and more margin from edges
    // Moved joystick slightly to the right and up
    this.joystick = new Joystick(
      joystickRadius + buttonSpacing + 260,  // Moved 20px more to the right
      h - joystickRadius - buttonSpacing - 160, // Moved 20px more up
      joystickRadius, 
      joystickKnobRadius
    );
    
    // Position skill buttons with proper scaling and adjusted positions to prevent overlap
    this.skillButtons = [
      new SkillButton(w - buttonRadius - buttonSpacing, h - buttonRadius - buttonSpacing - 40, buttonRadius, 'A', (pressed) => {
        console.log('Skill A')
        if(pressed){
          inputData[0][0] = {d: 1, p: 1}
        }else {
          inputData[0][0] = {d: 0, p: 0, r: 1}
        }
      }),
      new SkillButton(w - (buttonRadius * 2) - (buttonSpacing * 3), h - buttonRadius - buttonSpacing - 40, buttonRadius, 'B', (pressed) => {
        console.log('Skill B')
        if(pressed){
          inputData[0][2] = {d: 1, p: 1}
        }else {
          inputData[0][2] = {d: 0, p: 0, r: 1}
        }
      }),
      // new SkillButton(w - (buttonRadius * 3) - (buttonSpacing * 5), h - buttonRadius - buttonSpacing - 40, buttonRadius, 'C', () => console.log('Skill C')),
    ];
  }

  handleTouchStart(touches) {
    for(let i = 0; i< touches.length; i++){
      const touch = touches[i];
      const clientX = touch.clientX;
      const clientY = touch.clientY;
      
      if (clientX < this.canvas.width / 2) {
        this.joystick.active = true;
        // Pass adjusted coordinates to joystick
        this.joystick.handleTouch({clientX, clientY});
        this.joystick.touchIndex = i;
      } else {
        for (const btn of this.skillButtons) {
          if (btn.contains(clientX, clientY)) {
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
    const clientX = touch.clientX;
    const clientY = touch.clientY;
    
    this.joystick.handleTouch({clientX, clientY});
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
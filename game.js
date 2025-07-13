import { canvas, ctx } from './global';
import { ControlLayer } from './game/control-layer';
import "./game/dist"

const control = new ControlLayer(canvas, ctx);

// 启动游戏主循环
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  control.update();
  control.draw();
  requestAnimationFrame(gameLoop);
}

// gameLoop();

// 绑定触摸事件
wx.onTouchStart(e => control.handleTouchStart(e.touches));
wx.onTouchMove(e => control.handleTouchMove(e.touches));
wx.onTouchEnd(() => control.handleTouchEnd());
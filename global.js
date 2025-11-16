// Get the device pixel ratio, defaulting to 1 if not available
const devicePixelRatio = typeof wx !== 'undefined' && wx.getSystemInfoSync ? 
    wx.getSystemInfoSync().pixelRatio || 1 : 
    window.devicePixelRatio || 1;

// Create canvas and scale it according to device pixel ratio
export const canvas = globalThis.canvas = wx.createCanvas();
export const ctx = globalThis.ctx = canvas.getContext('2d');

// Set initial CSS properties for crisp pixel art rendering
canvas.style.imageRendering = 'crisp-edges';
canvas.style.imageRendering = '-moz-crisp-edges';
canvas.style.imageRendering = '-webkit-optimize-contrast';
canvas.style.msInterpolationMode = 'nearest-neighbor';

// Set canvas size accounting for device pixel ratio
function setCanvasSize() {
    const screenWidth = typeof wx !== 'undefined' && wx.getSystemInfoSync ? 
        wx.getSystemInfoSync().windowWidth : 
        window.innerWidth;
        
    const screenHeight = typeof wx !== 'undefined' && wx.getSystemInfoSync ? 
        wx.getSystemInfoSync().windowHeight : 
        window.innerHeight;
        
    // Set the canvas display size
    canvas.style.width = screenWidth + 'px';
    canvas.style.height = screenHeight + 'px';
    
    // Add CSS properties for crisp pixel art rendering
    canvas.style.imageRendering = 'crisp-edges';
    canvas.style.imageRendering = '-moz-crisp-edges';
    canvas.style.imageRendering = '-webkit-optimize-contrast';
    canvas.style.msInterpolationMode = 'nearest-neighbor';
    
    // Set the canvas render size accounting for device pixel ratio
    canvas.width = screenWidth * devicePixelRatio;
    canvas.height = screenHeight * devicePixelRatio;
    
    // Set image smoothing properties for crisp pixel art
    ctx.imageSmoothingEnabled = false;
    ctx.imageSmoothingQuality = 'low';
}

// Initialize canvas size
setCanvasSize();
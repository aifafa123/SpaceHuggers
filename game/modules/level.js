///////////////////////////////////////////////////////////////////////////////
function drawStars()
{
    randSeed = levelSeed;
    for(let i = lowGraphicsSettings ? 400 : 1e3; i--;)
    {
        let size = randSeeded(6, 1);
        let speed = randSeeded() < .9 ? randSeeded(5) : randSeeded(99,9);
        let color = (new Color).setHSLA(randSeeded(.2,-.3), randSeeded()**9, randSeeded(1,.5), randSeeded(.9,.3));
        if (i < 9)
        {
            // suns or moons
            size = randSeeded()**3*99 + 9;
            speed = randSeeded(5);
            color = (new Color).setHSLA(randSeeded(), randSeeded(), randSeeded(1,.5)).add(levelSkyColor.scale(.5)).clamp();
        }
        
        const w = mainCanvas.width+400, h = mainCanvas.height+400;
        const screenPos = vec2(
            (randSeeded(w)+time*speed)%w-200,
            (randSeeded(h)+time*speed*randSeeded(1,.2))%h-200);

        if (lowGraphicsSettings)
        {
            // drawing stars with gl wont work in low graphics mode, just draw rects
            mainContext.fillStyle = color.rgba();
            if (size < 9)
                mainContext.fillRect(screenPos.x, screenPos.y, size, size);
            else
                mainContext.beginPath(mainContext.fill(mainContext.arc(screenPos.x, screenPos.y, size, 0, 9)));
        }
        else
            drawTileScreenSpace(screenPos, vec2(size), 0, vec2(16), color);
    }
}

function updateSky()
{
    if (!skyParticles)
        return;

    let skyParticlesPos = cameraPos.add(vec2(rand(-40,40),0));
    const raycastHit = tileCollisionRaycast(vec2(skyParticlesPos.x, levelSize.y), vec2(skyParticlesPos.x, 0));
    if (raycastHit && raycastHit.y > cameraPos.y+10)
        skyParticlesPos = raycastHit;
    skyParticles.pos = skyParticlesPos.add(vec2(0,20));
    
    if (rand() < .002)
    {
        skyParticles.emitRate = clamp(skyParticles.emitRate + rand(200,-200), 500);
        skyParticles.angle = clamp(skyParticles.angle + rand(.3,-.3),PI+.5,PI-.5);
    }
   
    if (!levelWarmup && !skySoundTimer.active())
    {
        skySoundTimer.set(rand(2,1));
        playSound(skyRain ? sound_rain : sound_wind, skyParticlesPos, 20, skyParticles.emitRate/1e3);
        if (rand() < .1)
            playSound(sound_wind, skyParticlesPos, 20, rand(skyParticles.emitRate/1e3));
    }
}

///////////////////////////////////////////////////////////////////////////////
let tileParallaxLayers = [];

function generateParallaxLayers()
{
    tileParallaxLayers = [];
    for(let i=0; i<3; ++i)
    {
        const parallaxSize = vec2(600,300), startGroundLevel = rand(99,120)+i*30;
        const tileParallaxLayer = tileParallaxLayers[i] = new TileLayer(vec2(), parallaxSize);
        let groundLevel = startGroundLevel, groundSlope = rand(1,-1);
        tileParallaxLayer.renderOrder = -3e3+i;
        tileParallaxLayer.canvas.width = parallaxSize.x;

        const layerColor = levelColor.mutate(.2).lerp(levelSkyColor,.95-i*.15);
        const gradient = tileParallaxLayer.context.fillStyle = tileParallaxLayer.context.createLinearGradient(0,0,0,tileParallaxLayer.canvas.height = parallaxSize.y);
        gradient.addColorStop(0,layerColor.rgba());
        gradient.addColorStop(1,layerColor.subtract(new Color(1,1,1,0)).mutate(.1).clamp().rgba());

        for(let x=parallaxSize.x;x--;)
        {
            // pull slope towards start ground level
            tileParallaxLayer.context.fillRect(x,groundLevel += groundSlope = rand() < .05 ? rand(1,-1) :
                groundSlope + (startGroundLevel - groundLevel)/2e3,1,parallaxSize.y)
        }
    }
}

function updateParallaxLayers()
{
    tileParallaxLayers.forEach((tileParallaxLayer, i)=>
    {
        const distance = 4+i;
        const parallax = vec2(150,30).scale((i*i+1));
        const cameraDeltaFromCenter = cameraPos.subtract(levelSize.scale(.5)).divide(levelSize.scale(-.5).divide(parallax));
        tileParallaxLayer.scale = vec2(distance/cameraScale);
        tileParallaxLayer.pos = cameraPos
            .subtract(tileParallaxLayer.size.multiply(tileParallaxLayer.scale).scale(.5))
            .add(cameraDeltaFromCenter.scale(1/cameraScale))
            .subtract(vec2(0,150/cameraScale))
    });
}
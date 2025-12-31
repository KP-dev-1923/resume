(function(){
	// Respect reduced motion
	var prefersReduced = false;
	try {
		prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	} catch(e){}
	if(prefersReduced) return;

	// Create canvas
	var canvas = document.createElement('canvas');
	canvas.id = 'snowCanvas';
	canvas.className = 'snow-canvas';
	canvas.setAttribute('aria-hidden', 'true');
	document.body.appendChild(canvas);
	var ctx = canvas.getContext('2d');

	var dpr = Math.max(1, window.devicePixelRatio || 1);
	function resize(){
		var w = window.innerWidth, h = window.innerHeight;
		canvas.width = Math.floor(w * dpr);
		canvas.height = Math.floor(h * dpr);
		canvas.style.width = w + 'px';
		canvas.style.height = h + 'px';
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}
	resize();
	window.addEventListener('resize', resize);

	// Snowflakes (layered, twinkle, shapes, wind)
	var flakes = [];
	var maxFlakes = 200; // cap for performance
	var wind = 0, windTarget = 0, windTimer = 0;

	function nextWind(){
		// Every 4-8s, shift wind a bit left/right
		windTarget = (Math.random() - 0.5) * 1.2; // -0.6 .. 0.6 drift
		windTimer = 4000 + Math.random() * 4000;
	}
	nextWind();

	function shapeType(){ // 0=circle,1=star,2=hex
		var r = Math.random();
		return r < 0.6 ? 0 : (r < 0.85 ? 1 : 2);
	}

	function addFlake(){
		if(flakes.length >= maxFlakes) return;
		// Layer decides parallax: 0 back, 1 mid, 2 front
		var layer = Math.random() < 0.55 ? 1 : (Math.random() < 0.5 ? 0 : 2);
		var sizeBase = layer === 2 ? 2.2 : layer === 1 ? 1.4 : 1.0;
		var size = Math.random() * (2.2 * sizeBase) + (0.8 * sizeBase);
		flakes.push({
			x: Math.random() * (canvas.width / dpr),
			y: -10,
			size: size,
			speedY: (Math.random() * 0.8 + 0.6) * (0.8 + layer*0.25), // faster front
			speedX: Math.random() * 0.4 - 0.2, // base sway
			swayAmp: Math.random() * (0.6 + layer*0.2) + 0.2,
			swaySpeed: Math.random() * 0.8 + 0.4,
			phase: Math.random() * Math.PI * 2,
			twPhase: Math.random() * Math.PI * 2,
			rot: Math.random() * Math.PI*2,
			rotSpeed: (Math.random() * 0.02 - 0.01) * (0.6 + layer*0.4),
			opacity: Math.random() * 0.5 + 0.5,
			layer: layer,
			shape: shapeType()
		});
	}
	for(var i=0;i<maxFlakes/2;i++) addFlake();

	var lastTime = 0;
	var running = true;
	function update(dt){
		// wind easing
		wind += (windTarget - wind) * 0.004 * dt;
		windTimer -= dt;
		if(windTimer <= 0) nextWind();

		// Spawn gradually
		if(flakes.length < maxFlakes && Math.random() < 0.5){ addFlake(); }
		for(var i=flakes.length-1;i>=0;i--){
			var f = flakes[i];
			f.phase += f.swaySpeed * 0.01 + (f.size * 0.0006);
			f.twPhase += 0.015;
			f.rot += f.rotSpeed;
			// sway and wind drift
			f.x += f.speedX + Math.sin(f.phase) * f.swayAmp + wind*(0.6 + f.layer*0.3);
			f.y += f.speedY + f.size * 0.02;
			// recycle
			if(f.y - f.size > canvas.height / dpr){
				f.x = Math.random() * (canvas.width / dpr);
				f.y = -10;
				f.speedY = (Math.random() * 0.8 + 0.6) * (0.8 + f.layer*0.25);
				f.speedX = Math.random() * 0.4 - 0.2;
				f.swayAmp = Math.random() * (0.6 + f.layer*0.2) + 0.2;
				f.swaySpeed = Math.random() * 0.8 + 0.4;
				f.size = Math.random() * (2.2 * (f.layer===2?2.2:f.layer===1?1.4:1.0)) + (0.8 * (f.layer===2?2.2:f.layer===1?1.4:1.0));
				f.opacity = Math.random() * 0.5 + 0.5;
				f.shape = shapeType();
			}
		}
	}
	function draw(){
		ctx.clearRect(0,0,canvas.width/dpr,canvas.height/dpr);
		for(var i=0;i<flakes.length;i++){
			var f = flakes[i];
			var twinkle = 0.75 + 0.25 * (1 + Math.sin(f.twPhase)) * 0.5; // 0.75..0.875
			ctx.save();
			ctx.globalAlpha = Math.max(0.4, f.opacity * twinkle);
			// Layered blur and color
			ctx.shadowColor = 'rgba(0,0,0,' + (f.layer===2?0.25:f.layer===1?0.18:0.10) + ')';
			ctx.shadowBlur = f.layer===2?3:(f.layer===1?2:1);
			ctx.translate(f.x, f.y);
			ctx.rotate(f.rot);
			var fill = f.layer===2 ? 'rgba(235,245,255,0.98)' : (f.layer===1 ? 'rgba(238,246,255,0.95)' : 'rgba(242,248,255,0.9)');
			var stroke = f.layer===2 ? 'rgba(120,140,170,0.45)' : 'rgba(130,150,175,0.35)';
			ctx.fillStyle = fill;
			ctx.strokeStyle = stroke;
			ctx.lineWidth = 0.6;
			switch(f.shape){
				case 1: // 6-point star
					drawStar(ctx, 6, f.size*1.6, f.size*0.7);
					break;
				case 2: // hexagon
					drawPolygon(ctx, 6, f.size*1.1);
					break;
				default: // circle
					ctx.beginPath();
					ctx.arc(0, 0, f.size, 0, Math.PI*2);
					ctx.closePath();
					ctx.fill();
					ctx.stroke();
			}
			ctx.restore();
		}
	}
	function drawPolygon(c, sides, radius){
		c.beginPath();
		for(var i=0;i<sides;i++){
			var a = (i / sides) * Math.PI * 2;
			var px = Math.cos(a) * radius;
			var py = Math.sin(a) * radius;
			if(i===0) c.moveTo(px,py); else c.lineTo(px,py);
		}
		c.closePath();
		c.fill();
		c.stroke();
	}
	function drawStar(c, points, outerR, innerR){
		c.beginPath();
		for(var i=0;i<points*2;i++){
			var r = (i % 2 === 0) ? outerR : innerR;
			var a = (i / (points*2)) * Math.PI * 2;
			var px = Math.cos(a) * r;
			var py = Math.sin(a) * r;
			if(i===0) c.moveTo(px,py); else c.lineTo(px,py);
		}
		c.closePath();
		c.fill();
		c.stroke();
	}
	function tick(ts){
		if(!running){ requestAnimationFrame(tick); return; }
		if(!lastTime) lastTime = ts;
		var dt = ts - lastTime; lastTime = ts;
		update(dt);
		draw();
		requestAnimationFrame(tick);
	}
	requestAnimationFrame(tick);

	// Pause on background tab
	document.addEventListener('visibilitychange', function(){
		running = !document.hidden;
	});
})();

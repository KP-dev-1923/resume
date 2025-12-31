(function(){
	// Respect reduced-motion preference
	var prefersReduced = false;
	try {
		prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	} catch(e){}
	if(prefersReduced) return;

	// Create canvas overlay
	var canvas = document.createElement('canvas');
	canvas.id = 'fwCanvas';
	canvas.className = 'fw-canvas';
	canvas.setAttribute('aria-hidden','true');
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

	// Firework model
	var GRAVITY = 0.06;
	var AIR = 0.995;
	var rockets = [];
	var particles = [];
	var lastTime = 0;
	var running = true;

	function rand(min, max){ return Math.random() * (max - min) + min; }
	function hue(){ return Math.floor(rand(0, 360)); }

	function spawnRocket(x, y){
		rockets.push({
			x: x != null ? x : rand(canvas.width / dpr * 0.2, canvas.width / dpr * 0.8),
			y: y != null ? y : canvas.height / dpr,
			vx: rand(-1.2, 1.2),
			vy: rand(-9.5, -12.5),
			color: hue(),
			ttl: rand(700, 1200)
		});
	}

	function explode(x, y, baseHue){
		var count = Math.floor(rand(40, 70));
		for(var i=0;i<count;i++){
			var angle = Math.random() * Math.PI * 2;
			var speed = rand(1.5, 4.0);
			particles.push({
				x: x, y: y,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed,
				life: 1,
				decay: rand(0.010, 0.020),
				color: 'hsl(' + (baseHue + rand(-20, 20)) + ' 100% 60%)',
				size: rand(1, 2.4)
			});
		}
	}

	function update(dt){
		// Update rockets
		for(var i=rockets.length-1;i>=0;i--){
			var r = rockets[i];
			r.vy += GRAVITY;
			r.vx *= 0.998;
			r.x += r.vx;
			r.y += r.vy;
			r.ttl -= dt;
			// explode conditions: peak or ttl ended
			if(r.vy >= -1 || r.ttl <= 0){
				explode(r.x, r.y, r.color);
				rockets.splice(i,1);
			}
		}

		// Update particles
		for(var j=particles.length-1;j>=0;j--){
			var p = particles[j];
			p.vx *= AIR;
			p.vy = p.vy * AIR + GRAVITY*0.6;
			p.x += p.vx;
			p.y += p.vy;
			p.life -= p.decay;
			if(p.life <= 0) particles.splice(j,1);
		}
	}

	function draw(){
		// Fade the canvas slightly for trailing effect
		ctx.globalCompositeOperation = 'destination-out';
		ctx.fillStyle = 'rgba(0,0,0,0.15)';
		ctx.fillRect(0,0,canvas.width/dpr,canvas.height/dpr);
		ctx.globalCompositeOperation = 'lighter';

		// Draw rockets
		for(var i=0;i<rockets.length;i++){
			var r = rockets[i];
			ctx.beginPath();
			ctx.fillStyle = 'hsl(' + r.color + ' 100% 70%)';
			ctx.arc(r.x, r.y, 2, 0, Math.PI*2);
			ctx.fill();
		}

		// Draw particles
		for(var j=0;j<particles.length;j++){
			var p = particles[j];
			ctx.beginPath();
			ctx.globalAlpha = Math.max(p.life, 0);
			ctx.fillStyle = p.color;
			ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
			ctx.fill();
		}
		ctx.globalAlpha = 1;
	}

	// Animation loop
	function tick(ts){
		if(!running){ requestAnimationFrame(tick); return; }
		if(!lastTime) lastTime = ts;
		var dt = ts - lastTime; lastTime = ts;
		update(dt);
		draw();
		requestAnimationFrame(tick);
	}
	requestAnimationFrame(tick);

	// Auto launch
	var launchTimer = null;
	function startAuto(){
		stopAuto();
		launchTimer = setInterval(function(){
			if(particles.length > 900) return; // cap
			spawnRocket();
		}, 900);
	}
	function stopAuto(){ if(launchTimer) { clearInterval(launchTimer); launchTimer = null; } }
	startAuto();

	// Interactions: click/tap to spawn
	window.addEventListener('pointerdown', function(e){
		var rect = canvas.getBoundingClientRect();
		var x = (e.clientX - rect.left);
		var y = (e.clientY - rect.top);
		spawnRocket(x, canvas.height / dpr);
	});

	// Pause when tab hidden to save battery
	document.addEventListener('visibilitychange', function(){
		running = !document.hidden;
		if(!running) stopAuto(); else startAuto();
	});
})();


// https://twitter.com/msvaljek

// standard shim
window.requestAnimFrame = (function(){
	return window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	function( callback ) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

// helper functions
function randomMax(max) {
	return Math.floor(Math.random() * max);
}

// dom stuff and fps counter
var canvas = document.getElementById('mainCanvas');
var fpsOut = document.getElementById('fps');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');
ctx.globalCompositeOperation = 'lighter';
var fps = 0, now, lastUpdate = (new Date())*1 - 1, fpsFilter = 50;

// globals
var particleBackground = 'rgba(36, 28, 31, 0.1)',
	numParticles = 3,
	rmax = 40,
	particleColor = 'rgba(238, 249, 255, 0.8)';//'rgba(173, 216, 237, 0.8)';

var Particle = function () {
	this.x = randomMax(canvas.width);
	this.y = randomMax(canvas.height);
	this.r = randomMax(rmax);
	this.color = particleColor;
};

Particle.prototype.draw = function () {
	this.r = 5 * (Math.log(this.r) / Math.LN10);

	if (this.r <= 0) {
		this.x = randomMax(canvas.width);
		this.y = randomMax(canvas.height);
		this.r = randomMax(rmax);
		this.color = particleColor;
	}

	ctx.beginPath();
	var fillStyle = ctx.createRadialGradient(this.x, this.y, this.r * 0.2, this.x, this.y, this.r);
	fillStyle.addColorStop(0, this.color);
	fillStyle.addColorStop(1, particleBackground);

	ctx.fillStyle = fillStyle;
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
	ctx.fill();

	ctx.strokeStyle = this.color;
	ctx.beginPath();
	ctx.moveTo(this.x - this.r, this.y);
	ctx.lineTo(this.x + this.r, this.y);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(this.x , this.y - this.r);
	ctx.lineTo(this.x, this.y + this.r);
	ctx.stroke();
};

var ParticleSystem = function () {
	ctx.lineWidth = 1;
	this.particles = [];
	for (var i = 0; i < numParticles; i++) {
		this.particles.push(new Particle());
	}
};
ParticleSystem.prototype.draw = function () {
	for (var i = 0; i < this.particles.length; i++) {
		this.particles[i].draw(i);
	}
};

var gui = new dat.GUI();
gui.add(window, 'numParticles').min(1).max(300).step(1).name('Num. Particles').onFinishChange(function(){
	particleSystem = new ParticleSystem();
});
gui.addColor(window, 'particleColor');

var particleSystem = new ParticleSystem();

window.onresize = function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
 	ctx.globalCompositeOperation = 'lighter';
	particleSystem = new ParticleSystem();
};

(function animloop(){
	requestAnimFrame(animloop);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	particleSystem.draw();
	var thisFrameFPS = 1000 / ((now=new Date()) - lastUpdate);
	fps += (thisFrameFPS - fps) / fpsFilter;
	lastUpdate = now;
})();

setInterval(function(){
  fpsOut.innerHTML = fps.toFixed(1) + "fps";
}, 1000);
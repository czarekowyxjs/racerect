_GLOBAL = {
	fps: 60,
	w: 0,
	h: 0,
	d: 0,
	lastTime: 0,
	points: 0,
	render: true,
	timing: 0,
	rand: function(min,max) {
		return Math.floor(Math.random()*(max-min+1)+min);
	},
	timer: function() {
		_GLOBAL.timing += 1;
		//
		if(_GLOBAL.timing % 10 == 0) App.toggleBackground();
		if(_GLOBAL.timing % 8 == 0) App.map.obstacle.speed += 0.5;
	},
	setBg: function() {
		if(localStorage.getItem('abg')) {
			document.body.style.background = JSON.parse(localStorage.getItem('abg'));
		}
	}
};

window.addEventListener("DOMContentLoaded", function() {
	_GLOBAL.setBg();
	App.trophyImg = new Image();
	App.trophyImg.addEventListener('load', App.init(0), false);
	App.trophyImg.src = 'assets/img/trophy.svg';
	App.titlePosition();
	App.title();
}, false);

function App() {};

App.init = function(e) {

	if(e.type == "keyup") {
		if(e.keyCode != 13) return;
	}

	window.removeEventListener('keyup', App.init, false);
	//
	if(App.canvas) App.canvas.remove();
	if(App.txt_canvas) App.txt_canvas.remove();
	//
	this.canvas = document.createElement('canvas');
	this.ctx = App.canvas.getContext('2d');
	//
	this.test_canvas = document.createElement('canvas');
	this.test_ctx = App.test_canvas.getContext('2d');
	//
	this.txt_canvas = document.createElement('canvas');
	this.txt_ctx = App.txt_canvas.getContext('2d');
	//
	App.resize();
	//
	window.addEventListener('resize', App.resize, false);
	//
	document.body.appendChild(App.txt_canvas);
	//
	this.map = new Scene();
	this.trophy = new Trophy();
	this.ship = new Ship();
	//
	document.body.appendChild(App.canvas);
	//document.body.appendChild(App.test_canvas);
	//
	window.addEventListener('keydown', App.onKey, false);
	//
	App.menuView();
	//

	window.addEventListener('keyup', App.start, false);
};

App.start = function(e) {
	return e.keyCode == 13 ? (function() { 
		App.titlePosition();
		App.title();
		App.render(); 
		_GLOBAL.timing = 0;
		App.timer = setInterval(_GLOBAL.timer, 1000);
		window.removeEventListener('keyup', App.start, false); 
	})() : false;
};

App.resize = function() {
	_GLOBAL.w = window.innerWidth;
	_GLOBAL.h = window.innerHeight;
	//
	_GLOBAL.d = Math.min(_GLOBAL.h,_GLOBAL.w);
	//
	App.canvas.width = _GLOBAL.w;
	App.canvas.height = _GLOBAL.h;
	//
	App.test_canvas.width = _GLOBAL.w;
	App.test_canvas.height = _GLOBAL.h;
	//
	App.txt_canvas.width = _GLOBAL.w;
	App.txt_canvas.height = _GLOBAL.h;
};

App.render = function(time) {
	if(!_GLOBAL.render) return;
	requestAnimationFrame(App.render);
	_GLOBAL.lastTime = time;
	//
	App.ctx.clearRect(0,0,_GLOBAL.w,_GLOBAL.h);
	App.test_ctx.clearRect(0,0,_GLOBAL.w,_GLOBAL.h);
	App.txt_ctx.clearRect(0,0,_GLOBAL.w,_GLOBAL.h);
	//
	App.map.draw();
	App.addTrophy();
	App.trophy.draw();
	App.ship.draw();
	//
	App.result();
	App.bestResult();
	//
	App.title();
};

App.clearCanvas = function(...contexts) {
	for(let i = 0; i < contexts.length; i++) {
		App[contexts[i]].clearRect(0,0,_GLOBAL.w,_GLOBAL.h);
	}
};

App.onKey = function(e) {
	console.log(e.keyCode);
	if((e.keyCode == 38 || e.keyCode == 32 || e.keyCode == 87) && !App["key_"+e.keyCode]) {

		App["key_"+e.keyCode] = true;
	}
};

App.addTrophy = function() {
	if(_GLOBAL.rand(0,100) == 0) {
		App.trophy.push();
	}
};

App.incrementPoints = function() {
	return _GLOBAL.points > 2000 ? (_GLOBAL.points > 4000 ? _GLOBAL.points += 4 : _GLOBAL.points += 2) : _GLOBAL.points++;
};

App.result = function() {
	App.txt_ctx.font = "11pt Arial";
	App.txt_ctx.fillStyle = 'white';
	App.txt_ctx.fillText("Points:",10,20);
	App.txt_ctx.fillText(App.incrementPoints(),58,20);

	if(localStorage.getItem('br')) {
		if(JSON.parse(localStorage.getItem('br')) < _GLOBAL.points) {
			localStorage.setItem('br', JSON.stringify(_GLOBAL.points));
		} 
	} else {
		localStorage.setItem('br', JSON.stringify(_GLOBAL.points));
	}
};

App.bestResult = function() {
	this.bestResultNumber = localStorage.getItem('br') ? JSON.parse(localStorage.getItem('br')) : 0;
	//
	this.bestResultText = "Your best result: "+App.bestResultNumber+' points';
	this.bestResultLength = App.txt_ctx.measureText(App.bestResultText).width;
	//
	App.txt_ctx.font = '11pt Arial';
	App.txt_ctx.fillText(App.bestResultText, _GLOBAL.w-App.bestResultLength-10, 20);
};

App.collisionObstacleDetected = function() {
	_GLOBAL.render = false;
	//
	setTimeout(function() {
		App.clearCanvas('ctx','test_ctx','txt_ctx');
		App.loseView();
	}, 14);
};

App.collisionTrophyDetected = function(index) {
	App.trophy.hide(index);
	App.tmpTrophyPoints = _GLOBAL.rand(1,999);
	_GLOBAL.points += App.tmpTrophyPoints;
	App.trophy.giftAnimationInit();
	App.trophy.giftAnimationDeclare(App.tmpTrophyPoints);
};

App.menuView = function() {
	//
	this.pressEnterText = "Press enter to play";
	this.pressEnterLength = App.txt_ctx.measureText(App.pressEnterText).width;
	//
	App.txt_ctx.font = "12pt Arial";
	App.txt_ctx.fillStyle = 'white';
	App.txt_ctx.fillText(App.pressEnterText, _GLOBAL.w/2-App.pressEnterLength/2, _GLOBAL.h/2);
	//
	window.addEventListener('keyup', App.start, false);
};

App.loseView = function() {
	//
	this.earnedPointsText = "You earned "+_GLOBAL.points+" points";
	this.earnedPointsLength = App.txt_ctx.measureText(App.earnedPointsText).width;
	//
	App.txt_ctx.font = "12pt Arial";
	App.txt_ctx.fillStyle = 'white';
	App.txt_ctx.fillText(App.earnedPointsText, _GLOBAL.w/2-App.earnedPointsLength/2, _GLOBAL.h/2);
	//
	setTimeout(function() {
		_GLOBAL.render = true;
		_GLOBAL.points = 0;
		App.ship.collisionObstacleDetected = false;
		clearInterval(App.timer);
		App.map.generate();
		App.trophy.trophies = [];
		window.addEventListener('keyup', App.init, false);
	},150);
	//
};

App.toggleBackground = function() {
	this.actualBg = 'rgb('+_GLOBAL.rand(30,180)+','+_GLOBAL.rand(30,180)+','+_GLOBAL.rand(30,180)+')';

	document.body.style.background = App.actualBg;
	//
	localStorage.setItem('abg', JSON.stringify(App.actualBg));
};

App.titlePosition = function() {
	this.titleX = _GLOBAL.w/2-App.titleLength/1.9;
	this.madeByX = _GLOBAL.w/2-App.madeByLength/5.1;
	this.titleY = _GLOBAL.d/4-20;
	this.madeByY = _GLOBAL.d/4;
};

App.title = function() {
	this.titleX -= App.map.obstacle.speed || 0;
	this.madeByX -= App.map.obstacle.speed || 0;
	this.titleText = "RaceRect";
	this.titleLength = App.txt_ctx.measureText(App.titleText).width;
	App.txt_ctx.font = "22pt Arial";
	App.txt_ctx.fillStyle = 'white';
	App.txt_ctx.fillText(App.titleText, this.titleX, this.titleY);
	this.madeByText = "made by Cezary Góralski © 2018";
	this.madeByLength = App.txt_ctx.measureText(App.madeByText).width;
	App.txt_ctx.font = "11pt Arial";
	App.txt_ctx.fillStyle = 'white';
	App.txt_ctx.fillText(App.madeByText, this.madeByX, this.madeByY);
};


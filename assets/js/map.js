function Scene() {
	this.x = 0;
	this.y = Math.round(_GLOBAL.d/2);
	//
	this.toY = 2;
	this.toX = _GLOBAL.w;
	//
	this.w = _GLOBAL.w;
	//
	this.obstacles = [];
	//
	this.generate();
};

Scene.prototype.generate = function() {
	this.obstacle = {
		w: 30,
		h: 20,
		y: 0,
		space: Math.round(_GLOBAL.d/4),
		speed: 6,
		count: Math.round(_GLOBAL.d/50)
	};
	//
	for(var i = 0; i < this.obstacle.count; i++) {
		this.obstacle.h = _GLOBAL.points < 2000 ? _GLOBAL.rand(30,60) : _GLOBAL.rand(40,80);
		this.obstacle.y = this.y-this.obstacle.h;
		//
		this.obstacle.w = Math.round(this.obstacle.h/2);
		//
		this.obstacles[i] = {};
		//
		this.obstacles[i].w	= this.obstacle.w;
		this.obstacles[i].h = this.obstacle.h;
		//
		this.obstacles[i].y = this.obstacle.y;
		this.obstacles[i].x = i===0 ? _GLOBAL.w : _GLOBAL.rand(this.obstacles[i-1].x+this.obstacle.w+this.obstacle.space, this.obstacles[i-1].x+this.obstacle.w+(this.obstacle.space*6));
		//
	}
};

Scene.prototype.draw = function() {
	App.ctx.fillStyle = 'white';
	App.ctx.fillRect(this.x, this.y, this.toX, this.toY);
	//
	for(var i = 0; i < this.obstacles.length; i++) {
		this.obstacles[i].x = this.obstacles[i].x - this.obstacle.speed;
		//
		App.ctx.fillStyle = 'white';
		App.ctx.lineWidth = 0;
		App.ctx.beginPath();
		App.ctx.moveTo(this.obstacles[i].x, this.obstacles[i].y);
		App.ctx.lineTo(this.obstacles[i].x+Math.round(this.obstacles[i].w/2), this.obstacles[i].y+this.obstacles[i].h);
		App.ctx.lineTo(this.obstacles[i].x-Math.round(this.obstacles[i].w/2),this.obstacles[i].y+this.obstacles[i].h);
		App.ctx.closePath();
		App.ctx.fill();	
		//
		App.test_ctx.fillStyle = 'red';
		App.test_ctx.lineWidth = 0;
		App.test_ctx.beginPath();
		App.test_ctx.moveTo(this.obstacles[i].x, this.obstacles[i].y+1);
		App.test_ctx.lineTo(this.obstacles[i].x+Math.round(this.obstacles[i].w/2), this.obstacles[i].y+this.obstacles[i].h+1);
		App.test_ctx.lineTo(this.obstacles[i].x-Math.round(this.obstacles[i].w/2),this.obstacles[i].y+this.obstacles[i].h+1);
		App.test_ctx.closePath();
		App.test_ctx.fill();	

	}
	//
	if(this.obstacles[0].x+this.obstacle.w <= 0) {
		this.obstacles.splice(0,1);
		this.new_obstacle = {
			h: _GLOBAL.points < 2000 ? _GLOBAL.rand(30,60) : _GLOBAL.rand(40,80),
			w: 0,
			x: _GLOBAL.rand(this.obstacles[this.obstacles.length-1].x+this.obstacle.w+this.obstacle.space,this.obstacles[this.obstacles.length-1].x+this.obstacle.w+(this.obstacle.space*6)),
			y: 0,
		};
		this.new_obstacle.w = Math.round(this.new_obstacle.h/2);
		this.new_obstacle.y = this.y-this.new_obstacle.h;
		//
		this.obstacles.push(this.new_obstacle);
	} 
};
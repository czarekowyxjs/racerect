function Trophies() {
	this.jMax = 20;
	this.jSpeed = 0.7;
	//
	this.trophies = [];
	//
	this.img = new Image();
	this.img.src = 'assets/img/trophy.svg';
	//
};

Trophies.prototype.draw = function() {
	//
	if(this.trophies[0].x+this.trophies[0].w <= 0) {
		this.remove();
	}
	//
	for(let i = 0; i < this.trophies.length; i++) {
		this.trophies[i].x -= App.map.obstacle.speed;
		//
		if(this.trophies[i].j == 0) {
			this.trophies[i].y += this.jSpeed;
			this.trophies[i].jCount ++;
			//
			if(this.trophies[i].jCount == this.jMax) {
				this.trophies[i].j = 1;
			}
		} else {
			this.trophies[i].y -= this.jSpeed;
			this.trophies[i].jCount --;
			//
			if(this.trophies[i].jCount == 0) {
				this.trophies[i].j = 0;
			}
		}
		//
		App.ctx.drawImage(this.img,this.trophies[i].x,this.trophies[i].y,this.trophies[i].w,this.trophies[i].h);
		App.test_ctx.drawImage(this.img,this.trophies[i].x,this.trophies[i].y,this.trophies[i].w,this.trophies[i].h);
	}
};

Trophies.prototype.remove = function() {
	this.trophies.splice(0,1);
};

Trophies.prototype.push = function() {
	this.x = _GLOBAL.rand(_GLOBAL.w, _GLOBAL.w+70);
	this.space = _GLOBAL.rand(40,150);

	for(let i = 0; i < App.map.obstacles.length; i++) {
		while(App.map.obstacles[i].x-5 <= this.x && App.map.obstacles[i].x+App.map.obstacles[i].w+5 >= this.x) {
			this.x = _GLOBAL.rand(_GLOBAL.w, _GLOBAL.w+70);
		}
	}
	//
	this.trophies.push({
		x: this.x,
		y: Math.round(_GLOBAL.d/2)-this.space,
		w: 18,
		h: 18,
		j: 0,
		jCount: 0
	});
};
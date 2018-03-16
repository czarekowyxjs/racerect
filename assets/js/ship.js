function Ship() {
	this.r = 20;
	this.a = 45;
	//
	this.x = Math.round(_GLOBAL.d/3);
	this.y = Math.round(_GLOBAL.d/2)-this.r+6;
	//
	this.points = [];
	//
	this.moves = 0;
	this.firstJump = 0;
	this.jumpSpeedY = 14;
	//
	this.collisionDetected = false;
};

Ship.prototype.draw = function() {
	 if(App.key_38) {
	 	this.a += 360/41;
		if(this.moves == 0) {
			this.firstJump = this.y;
		}
		if(this.moves <= 9) { 
			this.y -= this.jumpSpeedY;
		}
		if(this.moves < 18 && this.moves >= 9) {
			this.y += this.jumpSpeedY;
		}
		if(this.moves > 18) {
			App.key_38 = false;
			this.moves = 0;
			this.y = this.firstJump;
			this.a = 45;
		}
		this.moves++;
	} 

	App.ctx.fillStyle = 'white';
	App.ctx.beginPath();
	for(var i = 0; i < 4; i++) {
		this.tmp_a = i===0 ? this.a : (this.a+(90*i));
		this.points[i] = {};
		this.points[i].x = Math.sin(Math.PI/180*this.tmp_a)*this.r+this.x;
		this.points[i].y = -Math.cos(Math.PI/180*this.tmp_a)*this.r+this.y;
		//
		App.ctx[i===0 ? 'moveTo' : 'lineTo'](this.points[i].x, this.points[i].y);
		//
		if(this.collisionObstacle(this.points[i].x, this.points[i].y)) {
			this.collisionDetected = true;
		}
	}
	App.ctx.closePath();
	App.ctx.fill();

	if(this.collisionDetected) App.collisionDetected();
};

Ship.prototype.collisionObstacle = function(x,y) {
	for(let i = 0; i < App.map.obstacles.length; i++) {
		if(App.map.obstacles[i].x-5 < x && App.map.obstacles[i].x+App.map.obstacles[i].w+5 > x) {
			if(App.test_ctx.getImageData(x,y,1,1).data[0] == 255) {
				return true;
			}
		}
	}
	return false;
};

Ship.prototype.collisionTrophy = function(x,y) {
	for(let i = 0; i < App.trophies.trophies.length; i++) {
		if(App.trophies.trophies[i].x-5 < x && App.trophies.trophies[i].x+App.trophies.trophies[i].w > x) {
			
		}
	}
};
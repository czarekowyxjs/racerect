function Trophy() {
	//
	this.trophies = [];
	//
	this.giftAnimation = false;
	this.giftValue = undefined;
	//
	this.giftFont = 1;
	this.giftFontMax = 18;
	this.giftFontSpace = 30;
	this.giftFontUpper = 4;
	this.giftFontAlpha = 1;
	//
	this.giftRects = [];
	this.giftRectsCount = 300;
	//
};

Trophy.prototype.draw = function() {

	if(this.trophies[0]) {
		if(this.trophies[0].x+this.trophies[0].w < 0) {
			this.remove(0);
		}
	}

	for(let i = 0; i < this.trophies.length; i++) {
		this.trophies[i].x -= App.map.obstacle.speed;
		//
		if(!this.trophies[i].v) continue; 
		//
		if(!this.trophies[i].j) {
			this.trophies[i].y -= this.trophies[i].jSpeed;
			this.trophies[i].jCount++;
			if(this.trophies[i].jCount == this.trophies[i].jMax) this.trophies[i].j = true;
		} else {
			this.trophies[i].y += this.trophies[i].jSpeed;
			this.trophies[i].jCount--;
			if(this.trophies[i].jCount == 0) this.trophies[i].j = false;
		}
		//
		App.ctx.drawImage(App.trophyImg,this.trophies[i].x,this.trophies[i].y,this.trophies[i].w,this.trophies[i].h);

		App.test_ctx.drawImage(App.trophyImg,this.trophies[i].x,this.trophies[i].y,this.trophies[i].w,this.trophies[i].h);
		App.test_ctx.fillStyle = 'blue';
		App.test_ctx.fillRect(this.trophies[i].x,this.trophies[i].y,this.trophies[i].w,this.trophies[i].h);
	}

	if(this.giftAnimation) {
		for(let i = 0; i < this.giftRects.length; i++) {
			this.giftRects[i].x += this.giftRects[i].sX;
			this.giftRects[i].y += this.giftRects[i].sY;
			this.giftRects[i].alpha -= this.giftRects[i].sA;
			App.ctx.fillStyle = this.giftRects[i].c+','+this.giftRects[i].alpha+')';
			App.ctx.fillRect(this.giftRects[i].x,this.giftRects[i].y,5,5);
		};
		console.log(this.giftValue);
		//
		App.ctx.font = this.giftFont+'pt Arial';
		App.ctx.fillStyle = 'rgba(255,255,255,'+this.giftFontAlpha+')';
		App.ctx.fillText("+"+this.giftValue, App.ship.x-this.giftFontSpace, App.ship.y-this.giftFontSpace);
		if(this.giftFont <= this.giftFontMax) {
			this.giftFont += this.giftFontUpper;
		} else {
			this.giftFontAlpha -= 0.05;
			if(this.giftFontAlpha <= 0) {
				this.giftFont = 1;
				this.giftFontAlpha = 1;
				this.giftAnimation = false;
			}
		}
	}
};

Trophy.prototype.giftAnimationInit = function() {
	for(let i = 0; i < this.giftRectsCount; i++) {
		this.giftRects[i] = {};
		this.giftRects[i].alpha = 1;
		this.giftRects[i].c = 'rgba('+_GLOBAL.rand(50,250)+','+_GLOBAL.rand(50,250)+','+_GLOBAL.rand(50,250);
		this.giftRects[i].x = App.ship.x;
		this.giftRects[i].y = App.ship.y;
		this.giftRects[i].s = 5;
		this.giftRects[i].sX = _GLOBAL.rand(-90,90);
		this.giftRects[i].sY = _GLOBAL.rand(-25,25);
		this.giftRects[i].sA = 0.01;
	}
};

Trophy.prototype.giftAnimationDeclare = function(giftValue) {
	this.giftAnimation = true;
	this.giftValue = giftValue;
};

Trophy.prototype.push = function() {
	this.spaceY = _GLOBAL.rand(80,150);
	this.spaceX = _GLOBAL.rand(0,20);
	this.tmp_y = Math.round(_GLOBAL.d/2)-this.spaceY;
	this.tmp_x = _GLOBAL.w+this.spaceX;
	this.tmp_w = 28;
	this.tmp_h = 28;
	//
	for(let i = 0; i < App.map.obstacles.length; i++) {
		if((this.tmp_x <= App.map.obstacles[i].x+App.map.obstacles[i].w && this.tmp_x >= App.map.obstacles[i].x) || (this.tmp_x+this.tmp_w >= App.map.obstacles[i].x && this.tmp_x+this.tmp_w <= App.map.obstacles[i].x+App.map.obstacles[i].w) || (this.tmp_x >= App.map.obstacles[i].x && this.tmp_x+this.tmp_w <= App.map.obstacles[i].x+App.map.obstacles[i].w)) {
			return;
		}
	}
	//
	this.trophies.push({
		x: this.tmp_x,
		y: this.tmp_y,
		w: this.tmp_w,
		h: this.tmp_h,
		v: true,
		j: false,
		jCount: 0,
		jSpeed: 0.7,
		jMax: 20
	});
};

Trophy.prototype.remove = function(index) {
	this.trophies.splice(index,1);
};

Trophy.prototype.hide = function(index) {
	this.trophies[index].v = false;
};
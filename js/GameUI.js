var gameUI = (function ()
{
    var self = {
        initialize: function () {
            this.game = game;
            this.game.tictac(this.moveDown);
            this.game.onBottomChange(this.drawBottom);
            this.canvas = document.getElementById('canvas');
            this.canvasBottom = document.getElementById('canvasBottom');
            this.container = document.getElementById('container');
            this.painter = new Painter(this.canvas, this.container, this.game.width, this.game.height);
            this.bottomPainter = new Painter(this.canvasBottom, this.container, this.game.width, this.game.height);

            window.addEventListener('resize', this.resizeCanvas, false);

            this.resizeCanvas();

            document.body.addEventListener('touchmove', function (event) {
                event.preventDefault();
            }, false);

            this.canvas.ontouchstart = function (event) {
                self.touchStartAt = event.touches[0].pageY;
                self.touchStarted = true;
            };

            this.canvas.ontouchmove = function (event) {
                var touchDistance = event.touches[0].pageY - self.touchStartAt;
                if(self.touchStarted && touchDistance > 1){
                    self.fallingShapeToBottom();
                    self.foo = true;
                }
                self.touchStarted = false;
            };

            this.canvas.ontouchend = function (event) {
                if(!self.foo) {
                    self.rotateFallingShape();
                }
                self.foo = false;
            };

            window.addEventListener('deviceorientation', function (event) {
                var vel = Math.round(event.gamma / 30);
                var dx = vel / Math.abs(vel) || 0;
                if(dx !== 0){
                    self.shiftFallingShape(vel, 0);
                    console.log('eehh', vel);
                }
            });

            window.onkeydown = function(event) {
                if(event.which === 38){
                    self.rotateFallingShape();
                }
                if(event.which === 37){
                    self.shiftFallingShape(-1, 0);
                }
                if(event.which === 39){
                    self.shiftFallingShape(1, 0);
                }
                if(event.which === 40){
                    self.fallingShapeToBottom();
                }
            };
        },

        rotateFallingShape: function () {
            self.painter.clear(self.game.shape);
            self.game.rotateFallingShape();
            self.painter.draw(self.game.shape);
        },

        shiftFallingShape: function (dx, dy) {
            self.painter.clear(self.game.shape);
            self.game.shiftFallingShape(dx, dy);
            self.painter.draw(self.game.shape);
        },

        fallingShapeToBottom: function () {
            self.painter.clear(self.game.shape);
            self.game.shiftFallingShape(0, self.game.distanceToBottom());
            self.painter.draw(self.game.shape);
        },

        setCanvasDimensions: function (canvas) {
            var ratio = this.game.height / this.game.width;
            if (this.container.offsetHeight / this.container.offsetWidth < ratio) {
                canvas.height = this.container.offsetHeight;
                canvas.width = this.container.offsetHeight / ratio;
            }
            else {
                canvas.width = this.container.offsetWidth;
                canvas.height = ratio * this.container.offsetWidth;
            }

            canvas.style.left = (this.container.offsetWidth - canvas.width)/2.0 + 'px';
        },

        resizeCanvas: function () {
            self.setCanvasDimensions(self.canvas);
            self.setCanvasDimensions(self.canvasBottom);
            self.painter.l = self.canvas.width / self.game.width;
            self.bottomPainter.l = self.canvas.width / self.game.width;
            self.painter.draw(self.game.shape);
        },

        moveDown: function () {
            self.shiftFallingShape(0, 1);
        },

        drawBottom: function () {
            var i;

            self.resizeCanvas();

            for(i = 0; i < self.game.rows.length; i++){
                self.bottomPainter.draw(self.game.rows[i]);
            }
        }
    };
    return self;
 }) ();

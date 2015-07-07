/**
 * src/com/ibeam/cv/view/components
 *
 * @class Bullseye.js - A background class providing visual continuity
 * for revision glyph groupings.
 *
 * @extends
 *
 * @author pebanfield
 *
 * 10:47:55 PM2011
 *
 */
cv.view.Bullseye = new Class({

    diameter: null,
    _stage: null,
    _container: null,
    _stroke: null,

    _winWidth: function(){ return Window.getSize().x;},
    _winHeight: function(){ return Window.getSize().y;},

    initialize: function(stage, diameter, stroke){

    	this._stage = stage;
        this.diameter = diameter;
        this._stroke = stroke;
        this._draw();

        window.addEvent('resize', this._onResizeHandler.bind(this));
    },

    _onResizeHandler: function(){

       // Logger.log("RESIZE " + this.$canvas);
       this._stage.canvas.width = Window.getSize().x;
       this._stage.canvas.height = Window.getSize().y;
       for(var j=0; j<this._container.getNumChildren(); j++){
    	   this._container.getChildAt(j).graphics.clear();
    	   this._container.removeChildAt(j);
       }
       this._stage.removeChild(this._container);
       this._draw();
    },
    
    _draw: function() {

    	this._container = new Container();
        for(var i=0; i<cv.view.Bullseye.NUMBER_OF_CIRCLES; i++){

            var instanceRadius =
                (this.diameter*cv.view.Bullseye.DIAMETER_MULTIPLE)*(i+1);

            var circleX = this._winWidth()/2;
            var circleY = this._winHeight()/2;
            var circle = new Shape();
            circle.graphics.setStrokeStyle(0.2);
            circle.graphics.beginStroke(this._stroke);
            circle.graphics.drawCircle(0,0,instanceRadius);
            circle.alpha = 1;
            circle.x = circleX;
            circle.y = circleY;
            circle.compositeOperation = "lighter";
            
            this._container.addChild(circle); 
        }
        
        this._stage.addChild(this._container);
        this._stage.update();
    }
});

cv.view.Bullseye.NUMBER_OF_CIRCLES = 9;
cv.view.Bullseye.DIAMETER_MULTIPLE = 0.1;



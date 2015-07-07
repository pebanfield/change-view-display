/**
 * src/com/ibeam/cv/view/components/glyphs
 *
 * @class EntryGlyph.js - Circular view control representing
 * a single revision entry with labels and visual elements
 * indicating entry properties.
 *
 * @extends
 *
 * @author pebanfield
 *
 * 10:18:50 AM2011
 *
 */
cv.view.EntryGlyph = new Class({

	id: null,
    canvas: null,
    _parentContainer: null,
    _circle: null,
    _entryShadow: null,
    _entryVO: null,
    _title: null,
    
    _padding: 4,
    
    _winWidth: function(){ return Window.getSize().x;},
    _winHeight: function(){ return Window.getSize().y;},
    
    _bgWidth: 0,
    _radius: 0,
    _ringRadius: 0,
    _offSet: 18,
    _angle: -1,
    _centerPositionType: "",
    _stroke: null,
    _fill: null,


    initialize: function(parentContainer, properties){

    	//cv.utils.Logger.log("EntryGlyph : initialize " + properties.radius);
        
    	this._entryVO = properties.entryVO;
        this.id = this._entryVO .id;
        this._bgWidth = properties.bgWidth;
        this._radius = properties.radius;
        this._ringRadius = properties.ringRadius - this._offSet; 
        this._angle = properties.angle;
        this._stroke = properties.stroke;
        this._fill = properties.fill;
        this._parentContainer = parentContainer;
        this._draw();
    },
    
    cloneShape: function(){
    	
    	var shape = this._drawCircle(this._radius, this._stroke, this._fill, 1, true);
    	shape = this._positionEntryGlyph(shape);
    	return shape;
    },
    
    getMetadata: function(){
    	
    	return {name: this._entryVO.name,
    		    x: this._x , 
    		    y: this._y, 
    		    radius: this._radius, 
    		    strokeColor: this._stroke,
    		    fillColor: this._fill};
    		    
    },

    _draw: function(){

    	this._circle = this._drawCircle(this._radius, this._stroke, this._fill, 1, true);
    	 
        this._positionEntryGlyph(this._circle, 0);
        	 
        this._parentContainer.addChild(this._circle); 
        
    },
    
    _drawCircle: function(radius, stroke, fill, alpha, hasStroke){
    	
    	var circle = new Shape();
    	
    	if(hasStroke){
    		circle.graphics.setStrokeStyle(6);
    		circle.graphics.beginStroke(stroke);
    	}
    	if(fill != null){
    		circle.graphics.beginFill(fill);
    	}
    	circle.graphics.drawCircle(0,0,radius);
    	circle.alpha = alpha;
    	circle.compositeOperation = "source-over";
    	
    	return circle;
    },
    
    _positionEntryGlyph: function(shape, offset){
    	
    	if(this._angle == 0){
    		
       	    shape.x = 0 + offset;
       	    shape.y = 0 + offset;
        }else{
        	var vector = 
            	this._getPositionVector(this._angle, this._ringRadius);
        	shape.x = vector.x + offset;
        	shape.y = vector.y + offset;
        }
    	this._x = shape.x;
    	this._y = shape.y;
    },
    
    _getPositionVector: function(angle, radius) {
		
		//point on circle = centerX + radius * Math cos/sin angle	
    	var vector = new Object();
		if(angle > -1){
			vector.x = Math.round(radius * Math.cos(angle));
			vector.y = Math.round(radius * Math.sin(angle));
		}else{
			vector.x = 0;
			vector.y = 0;
		}
		return vector;
	},
	
	setActive: function() {
		
		cv.utils.Logger.log("SETTING ACTIVE");
		this._entryShadow = this._drawCircle(this._radius, "#162433", "#162433", 0.8, false);
		
		this._entryShadow.shadow = new Shadow(this._fill, 0, 0, 80);
		this._positionEntryGlyph(this._entryShadow, 0);
		this._parentContainer.addChildAt(this._entryShadow, 0);
		
    	this._parentContainer.addChild(this._title);
    },
    
    clearActive: function() {
		
    	this._parentContainer.removeChild(this._entryShadow);
    	this._parentContainer.removeChild(this._title);
    }

});


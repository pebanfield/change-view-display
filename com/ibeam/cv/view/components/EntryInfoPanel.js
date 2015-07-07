/**
 * src/com/ibeam/cv/view/components
 *
 * @class EntryInfoPanel.js - View component providing Slick
 * access to revision info panel page elements.
 *
 * @extends
 *
 * @author pebanfield
 *
 * 8:56:20 PM2011
 *
 */
cv.view.EntryInfoPanel = new Class({

	Implements: Events,
	
	_width: 230,
    _height: 100,
	_stage: null,
    _canvas: null,
    _entryVO: null,
    _sliceColor: null,
    
    //entry modification type
    _changeType: null,
    //pie chart slice value
    _percentageDifference: null,
    
    _PIE_CHART_RADIUS: null,
    _DEGREE_START: 270,
    
    //entry modification types
    _DELETE : 0,
    _ADD : 1,
    _MODIFY_ADD : 2,
    _MODIFY_SUBTRACT : 3,
    
    initialize: function(){

    	this._PIE_CHART_RADIUS = this._height * 0.3;
    },

    draw: function(repoPath, activeRevision, revGlyph, entryVO, data){

    	this._preRender(entryVO.name);
    	
    	this._entryVO = entryVO;
    		
    	$("entryTitle").set("text", entryVO.name);
    	$("status").set("text", entryVO.status);
    	$("size").set("text", entryVO.size);
    	$("significance").set("text", entryVO.significance);
    		
    	try {
    		$("authors").set("text", entryVO.authorHistory.length);
    		$("changes").set("text", entryVO.uuidHistory.length);
    	}catch(e){
        	cv.utils.Logger.log("EntryInfoPanel : " + e);
        }
    		
    	//$("viewChanges").set("href", "/code?code=" + 
    	//		encodeURIComponent(entryVO.patch) + "&style=brush: " + styleName);
    	$("viewChanges").set("href", "https://github.com" + repoPath + "/commit/" + activeRevision.identifier);
    	$("closeBtn").addEvent("click", this._onClose.bind(this));
    		
    	var point = cv.utils.Translate.localToGlobal(data.x, data.y);
    	var height = $("entryDetails").getStyle("height");
    	height = height.substring(0, height.length-2);
    	point.y = point.y - (height/2);
    		
    	//keep dialog from going off top of screen
    	if(point.y < 60){
    		point.y = 60;
    	}else if(point.y > Window.getSize().y - height - 150){
    		point.y = Window.getSize().y - height - 150;
    	}
    		
    	$("entryDetails").setStyles({visibility: "visible", top: point.y, left: point.x});
    		
    	this._renderVisuals(revGlyph);
    	this._stage.update();
    },
    
    _preRender: function(name){
    	
    	this._canvas = new Element("canvas");
    	this._width = $("entryVisuals").getStyle("width");
    	this._height = $("entryVisuals").getStyle("height");
    	this._width = this._width.substring(0, this._width.length-2);
    	this._height = this._height.substring(0, this._height.length-2);
    	this._canvas.setStyles({id: name, width: this._width, height: this._height});
    	this._stage = new Stage(this._canvas);
    	this._stage.enableMouseOver(0);
    	$("entryVisuals").grab(this._canvas);
    },
    
    _renderVisuals: function(revGlyph){
    	
		var metadata = revGlyph.getMetadata();
		cv.utils.Logger.log("metadata " + metadata.length);
		
		if(metadata.length > 1){
			this._renderGlyph(metadata);
		}
		
		this._determineChangeType();
		this._renderPieChart(revGlyph);

    },
    
    _renderGlyph: function(metadata){
    	
    	var revContainer = new Container();
        for(var j=0; j< metadata.length; j++){
			
        	var stroke = null;
        	if(metadata[j].name == this._entryVO.name){
        		stroke = "#000";
        	}
			var entryGlyph = 
				this._drawCircle(metadata[j].radius,
						         metadata[j].fillColor, stroke);
			entryGlyph.x = metadata[j].x * 0.4;
			entryGlyph.y = metadata[j].y * 0.4;
			revContainer.addChild(entryGlyph);
		}

		revContainer.scaleX = 0.3;
		revContainer.scaleY = 0.3;
		revContainer.alpha = 0.9;
		revContainer.x = this._width*0.75;
		revContainer.y = this._height/2;
		this._stage.addChild(revContainer);
    },
    
    _renderPieChart: function(revGlyph){
    	
    	var currentEntry = this._getCurrentEntry(revGlyph);
    	var revContainer = new Container();
    	
        var entryGlyph = 
			this._drawCircle(this._PIE_CHART_RADIUS,
					         currentEntry.fillColor);
		entryGlyph.x = 0;
		entryGlyph.y = 0;
		
		this._sliceColor = currentEntry.fillColor;
		
		revContainer.addChild(entryGlyph);
		revContainer.x = this._width*0.25;
		revContainer.y = this._height/2;
		
		switch(this._changeType){
	        
	        case this._ADD : 
	        	//TODO - add additional feedback
	        	break;
	        case this._DELETE : 
	        	//TODO - add additional feedback
	        	break;
	        case this._MODIFY_ADD : 
	        	var slice = this._drawPieSlice(true);
	    		revContainer.addChild(slice);
	        	break;
	        case this._MODIFY_SUBTRACT : 
	        	var slice = this._drawPieSlice(false);
	    		revContainer.addChild(slice);
	        	break;
     
       }
     
		this._stage.addChild(revContainer);
    },
    
    _determineChangeType: function(){
    	
    	var previousSize = this._entryVO.sizeHistory[this._entryVO.sizeHistory.length-2];
    	var newSize = this._entryVO.sizeHistory[this._entryVO.sizeHistory.length-1];
    	
    	var difference = newSize - previousSize;
    	
    	cv.utils.Logger.log("previousSize = " + previousSize);
    	cv.utils.Logger.log("newSize = " + newSize);
    	cv.utils.Logger.log("difference = " + difference);
    	cv.utils.Logger.log("this._entryVO.sizeHistory.length = " + this._entryVO.sizeHistory.length);

    	difference = Math.abs(difference);
    	this._percentageDifference = difference / previousSize;
    	
    	if(this._entryVO.sizeHistory.length == 1){ // NEW ENTRY 
    		this._changeType = this._ADD;
    	}
    	else if(newSize == 0){ // ENTRY DELETED
    		this._changeType = this._DELETE;	
    	}
    	else if(previousSize > newSize){ //FILE SIZE DECREASE
    		this._changeType = this._MODIFY_SUBTRACT;
    	}
    	else if(previousSize < newSize){ //FILE SIZE INCREASE
    		this._changeType = this._MODIFY_ADD;
    	}
    	
    	cv.utils.Logger.log("this._changeType = " + this._changeType);
    	
    },
    
    _drawPieSlice: function(isPositive){
    	
    	cv.utils.Logger.log("_drawPieSlice");
    	cv.utils.Logger.log("this._percentageDifference = " + this._percentageDifference);
    	
    	if(isPositive){
    		color = "#000";
    	}else{
    		color = "#ff0000";
    	}
    	var pieRatio = Math.round(this._percentageDifference * 360);
    	cv.utils.Logger.log("pieRatio = " + pieRatio);
    	
    	var slice = new Shape();
    	
    	slice = this._drawSliceLine(slice, this._DEGREE_START * Math.PI/180, color);
    	slice = this._drawSliceLine(slice, (this._DEGREE_START + pieRatio) * Math.PI/180, color);

    	slice.alpha = 0.5;
    	return slice;
    },
    
    _drawSliceLine: function(shape, startVector, color) {
    	
    	shape.graphics.setStrokeStyle(0.6).beginStroke(color);
		var startX = Math.round(this._PIE_CHART_RADIUS * Math.cos(startVector));
		var startY = Math.round(this._PIE_CHART_RADIUS * Math.sin(startVector));
		cv.utils.Logger.log("startX = " + startX);
		cv.utils.Logger.log("startY = " + startY);
		shape.graphics.moveTo(0,0).lineTo(startX,startY);
		shape.graphics.endStroke();
		
		return shape;
    },
    
    _getTintedColor: function(color, v) {
    	
        if (color.length >6) { color= color.substring(1,color.length)};
        var rgb = parseInt(color, 16); 
        var r = Math.abs(((rgb >> 16) & 0xFF)+v); if (r>255) r=r-(r-255);
        var g = Math.abs(((rgb >> 8) & 0xFF)+v); if (g>255) g=g-(g-255);
        var b = Math.abs((rgb & 0xFF)+v); if (b>255) b=b-(b-255);
        r = Number(r < 0 || isNaN(r)) ? 0 : ((r > 255) ? 255 : r).toString(16); 
        if (r.length == 1) r = '0' + r;
        g = Number(g < 0 || isNaN(g)) ? 0 : ((g > 255) ? 255 : g).toString(16); 
        if (g.length == 1) g = '0' + g;
        b = Number(b < 0 || isNaN(b)) ? 0 : ((b > 255) ? 255 : b).toString(16); 
        if (b.length == 1) b = '0' + b;
        var hexStr = "#" + r + g + b;
        return hexStr;
    },
    
    _getCurrentEntry: function(revGlyph){
    	
    	var metadata = revGlyph.getMetadata();
    	for(var i=0; i<metadata.length; i++){
    		if(this._entryVO.name == metadata[i].name){
    			return metadata[i];
    		}
    	}
    	return null;
    },
    
    _onClose: function(){
    	
    	$("entryDetails").setStyle("visibility", "hidden");
    	if(this._canvas != null){
    		this._canvas.dispose();
        	this._canvas.destroy();
        	this._canvas = null;
        	this._stage = null;
    	}
    	
    	this.fireEvent(cv.model.EventTypes.WINDOW_CLOSE);
    },
    
    _drawCircle: function(radius, fill, stroke){
    	
    	cv.utils.Logger.log("drawing circle - radius = " + radius);
    	var circle = new Shape();
    	if(stroke){
    		circle.graphics.setStrokeStyle(4);
    		circle.graphics.beginStroke(stroke);
    	}
    	circle.graphics.beginFill(fill);
    	circle.graphics.drawCircle(0,0,radius);
    	circle.alpha = 1;
    	circle.compositeOperation = "source-over";
    	
    	return circle;
  }

});


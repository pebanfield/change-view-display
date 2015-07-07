/* src/com/ibeam/cv/view/components
 *
 * @class Timeline.js - Shows dates, lines and brackets of each revision on a 
 * horizonal plane.
 *
 * @extends
 *
 * @author pebanfield
 *
 *
 */
cv.view.Timeline = new Class({
	
	REV_WIDTH: 87,
	_REV_HEIGHT: 22,
	_BRACKET_HEIGHT: 40,
	
	width: null,
	_length: 0,
	_color: "#000",
	
	_container: null,
	_dividers: null,
	_revisions: null,
	
	_glyphContainer: null,
	_glyphIcons: [],
	_activeContainer: null,
	_activeTime: null,
	_preciseTime: null,
	activeIndex: null,
	
	
	initialize: function(config){
		
		this._container = config.viewContainer;
		this.width = config.width;
		this._color = config.color;
		this._draw();
	}, 
	
	_draw: function(){
		
		this._renderBracket();
	},
	
	_renderBracket: function(){
		
		var bracket = new Shape();
		bracket.graphics.setStrokeStyle(0.6).beginStroke(this._color);
		bracket.graphics.moveTo(0,0).lineTo(0,this._BRACKET_HEIGHT).lineTo(this.width,
				                                         this._BRACKET_HEIGHT).lineTo(this.width, 0);
		bracket.graphics.endStroke();
		this._container.addChild(bracket);
	},
	
	_renderDividers: function(length){
		
        this._dividers = new Shape();
		
		this._dividers.graphics.setStrokeStyle(0.3).beginStroke(this._color);

		for(var i=1; i<length; i++){
			this._dividers.graphics.moveTo(this.REV_WIDTH*i,this._BRACKET_HEIGHT - this._REV_HEIGHT);
			this._dividers.graphics.lineTo(this.REV_WIDTH*i,this._BRACKET_HEIGHT);
		}
		
		this._dividers.graphics.endStroke();
		this._container.addChild(this._dividers);
	},
	
	setActive: function(index) {
		
		if(!this._activeContainer){
			
			this._initActiveContainer();
		}
		
		var timeObj = cv.utils.DateParser.parse(this._revisions[index].dateStr);
		var dayStr = cv.utils.DateParser.getGregorianDay(this._revisions[index].dateStr);
		var monthStr = cv.utils.DateParser.getGregorianMonth(this._revisions[index].dateStr);
		var dateStr = dayStr + " " + monthStr + " " + timeObj.day + "\n" + timeObj.year;
		
		this._activeTime.initialize(dateStr, "12px Arial", this._color);
		this._preciseTime.initialize(timeObj.time, "12px Arial", this._color);
		
		this._activeContainer.x = this.REV_WIDTH*index + 4;
		this._activeContainer.y = -76;
		
		if(this.activeIndex != null){
			
			this._glyphContainer.getChildAt(this.activeIndex).shadow = null;
			this._glyphContainer.getChildAt(this.activeIndex).alpha = 0.9;
		}
		
		this.activeIndex = index;
		var rev = this._revisions[this.activeIndex];
		var revGlyph = rev.glyph;
		var metadata = revGlyph.getMetadata();
		this._glyphContainer.getChildAt(this.activeIndex).shadow = new Shadow(metadata[0].fillColor, 2, 2, 20);
		this._glyphContainer.getChildAt(this.activeIndex).alpha = 1;
		
		this._container.addChild(this._activeContainer);
	},
	
	_initActiveContainer: function(){
		
		this._activeContainer = new Container();
		
		this._activeTime = new Text("", "12px Arial", this._color);
		this._activeTime.textBaseline = "top";
		
		this._preciseTime = new Text("", "12px Arial", this._color);
		this._preciseTime.textBaseline = "top";
		this._preciseTime.y = 100;
		
		var highlightLine = new Shape();
		highlightLine.graphics.setStrokeStyle(0.8).beginStroke(this._color);
		highlightLine.graphics.moveTo(-4,70);
		highlightLine.graphics.lineTo(-4, 150);
		highlightLine.graphics.endStroke();
		
		this._activeContainer.addChild(this._preciseTime);
		this._activeContainer.addChild(this._activeTime);
		this._activeContainer.addChild(highlightLine);
	},
	
	renderTimeline: function(revisions){
		
		this._revisions = revisions;
		
		for(var j=0; j<this._revisions.length; j++){
			
			var timeObj = cv.utils.DateParser.parse(this._revisions[j].dateStr);
			var timeArray = timeObj.time.split(":");
			var timeStr = timeArray[0] + ":" + timeArray[1];
			
			var time = new Text(timeStr, "12px Arial", this._color);
			time.textBaseline = "top"; 
			time.x = this.REV_WIDTH*j + 4;
			time.y = 24;
			this._container.addChild(time);
			
			if(j == 0 || cv.utils.DateParser.dateIsDifferent(this._revisions[j-1].dateStr, this._revisions[j].dateStr)){
				
				var dayStr = cv.utils.DateParser.getGregorianDay(this._revisions[j].dateStr);
				var monthStr = cv.utils.DateParser.getGregorianMonth(this._revisions[j].dateStr);
				var dateTitle = dayStr + " " + monthStr + " " + timeObj.day;
				
				var day = new Text(dateTitle, "12px Arial", this._color);
				day.textBaseline = "top"; 
				day.x = this.REV_WIDTH*j + 4;
				day.y = 42;
				this._container.addChild(day);
			} 
		}

		this._renderDividers(this._revisions.length);
	},
	
	renderHistoryGlyphs: function(revisions){
		
		if(this._glyphContainer){
			this._clearGlyphs();
		}
		this._glyphContainer = new Container();
		this._revisions = revisions;
		
		for(var i=0; i<revisions.length; i++){
			
			var revGlyph = revisions[i].glyph;
			var metadata = revGlyph.getMetadata();
			var revContainer = new Container();
			for(var j=0; j< metadata.length; j++){
				
				var entryGlyph = 
					this._drawCircle(metadata[j].radius,
							         metadata[j].stroke,
							         metadata[j].fillColor);
				entryGlyph.x = metadata[j].x * 0.4;
				entryGlyph.y = metadata[j].y * 0.4;
				revContainer.addChild(entryGlyph);
				
			}

			revContainer.scaleX = 0.3;
			revContainer.scaleY = 0.3;
			revContainer.alpha = 0.7;
			
			revContainer.x = i*this.REV_WIDTH + (this.REV_WIDTH/2);
			revContainer.y = -12;
			this._glyphContainer.addChild(revContainer);
		}
		this._container.addChild(this._glyphContainer);
		
	},
	
	clear: function(){
		
		for(var i=0; i<this._container.getNumChildren(); i++){
			var child = this._container.removeChildAt(i); 
			child = null;
		}
	},
	
	_clearGlyphs: function(){
		
		for(var i=0; i<this._glyphContainer.getNumChildren(); i++){
			var child = this._glyphContainer.removeChildAt(i); 
			child = null;
		}
	},
	
	_drawCircle: function(radius, stroke, fill){
	    	
	    	var circle = new Shape();
	    	circle.graphics.setStrokeStyle(3);
    		circle.graphics.beginStroke("#ffffff");
	    	circle.graphics.beginFill(fill);
	    	circle.graphics.drawCircle(0,0,radius);
	    	circle.alpha = 0.6;
	    	circle.compositeOperation = "source-over";
	    	
	    	return circle;
	  }
	
});
	
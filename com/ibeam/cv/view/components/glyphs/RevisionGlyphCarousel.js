/**
 * src/com/ibeam/cv/view/components/glyphs
 *
 * @class RevisionGlyphCarousel.js - Provides managed access to glyph collections.
 * Responsible for glyph layout and adding/removing glyphs.
 *
 * @extends
 *
 * @author pebanfield
 *
 * 10:15:14 AM2011
 *
 */
cv.view.RevisionGlyphCarousel = new Class({

	Implements: Events,
	
    _revisions: null,
    _container: null,
    
	_activeRevision: 0,
	_activeIndex: -1,
	
	_positionGlyphs: [],
	_positionAnchors: null,
	_currentPositionStruct: null,
	_startPositionStruct: null,
	_endPositionStruct: null,
	
	_numPositions: 5,
	_completeCount: 0,
	_tweenCount: 0,
	
	_slideLeft: null,
	_slideRight: null,
	
	_winWidth: function(){ return Window.getSize().x;},
    _winHeight: function(){ return Window.getSize().y;},
	
    initialize: function(container){

        this._container = container;
    },
    
    draw: function(activeRevisionIndex, revisions){
   	
    	//clear previous
    	if(this._container.getNumChildren() > 0){
    		this._resetView();
    	}
    	if(revisions){
    		this._revisions = revisions;
    	}
		if(this._positionAnchors){
			this._clearPositionAnchors();
		}
		//draw
		this._positionAnchors = [];
    	this._generatePositionAnchors();
    	this._generatePositionStructures();
    	
    	this._layoutGlyphs(activeRevisionIndex, false);
    	
    	if(this._activeIndex != activeRevisionIndex){
    		this._activeIndex = activeRevisionIndex;
    		this._revisions[this._activeIndex].glyph.setActive();
    	}
    	
    },
    
    repositionGlyphs: function(){
    	
    	this._clearPositionAnchors();
    	this._generatePositionAnchors();
    	
        for(var i=0; i<this._numPositions; i++){
    		
    		var pos = this._currentPositionStruct[i];
    		
    		try{
    			if(this._activeIndex+pos.offset > this._revisions.length-1 || 
    			   this._activeIndex+pos.offset	< 0){
    				break;
    			}
    			var glyph = this._revisions[this._activeIndex+pos.offset].glyph.viewContainer;
    		    glyph.x = this._positionAnchors[pos.name].x;
        		glyph.y = this._positionAnchors[pos.name].y;
        		this._positionAnchors[pos.name].glyph = glyph;
    		}catch(e){ 
    			cv.utils.Logger.log("bailing out because " + e);
    			break; 
    		} //hack for cleaner code	

    	}
    	
    },
    
    slideLeft: function(){
    	
    	if(this._activeIndex > -1){
    		this._revisions[this._activeIndex].glyph.clearActive();
    	}
    	this._tweenGlyph(this._fromLeft);	 
    },
    
    slideRight: function(){
    	
    	if(this._activeIndex > -1){
    		this._revisions[this._activeIndex].glyph.clearActive();
    	}
    	this._tweenGlyph(this._fromRight);
    },
    
    _layoutGlyphs: function(startIndex){
    	
    	if(startIndex < 2){
    		this._currentPositionStruct = this._endPositionStruct;
    	}else{
    		this._currentPositionStruct = this._startPositionStruct;
    	}
    	
    	for(var i=0; i<this._numPositions; i++){
    		
    		var pos = this._currentPositionStruct[i];
    		
    		try{
    		    var glyph = this._positionGlyph(pos.name,
			                                    this._revisions[startIndex+pos.offset].glyph.viewContainer);
    		}catch(e){ 
    			//cv.utils.Logger.log("bailing out because " + e);
    			break; 
    		} //hack for cleaner code	
    		
    		this._positionAnchors[pos.name].glyph = glyph;
        	this._container.addChild(glyph);

    	}
	},
	
	_positionGlyph: function(position, glyph){
		
		glyph.x = this._positionAnchors[position].x;
		glyph.y = this._positionAnchors[position].y;
		glyph.alpha = this._positionAnchors[position].alpha;
		glyph.scaleX = this._positionAnchors[position].scale;
		glyph.scaleY = this._positionAnchors[position].scale;
		
		return glyph;
	},
	
	_generatePositionAnchors: function(){
		
		//bottom left
		this._positionAnchors["start"] = 
		    {x: this._winWidth()*0.05, y: this._winHeight()*0.5, alpha: 0.4, scale: 0.2, glyph: null};
		//mid left
		this._positionAnchors["leftMid"] = 
		    {x: this._winWidth()*0.20, y: this._winHeight()*0.5, alpha: 0.4, scale: 0.6, glyph: null};
		//center
		this._positionAnchors["center"] = 
		    {x: this._winWidth()/2, y: this._winHeight()/2, alpha: 0.6, scale: 1, glyph: null};
		//mid right
		this._positionAnchors["rightMid"] = 
		    {x: this._winWidth()*0.80, y: this._winHeight()*0.5, alpha: 0.4, scale: 0.6, glyph: null};
		//top right
		this._positionAnchors["end"] = 
		    {x: this._winWidth()*0.95, y: this._winHeight()*0.5, alpha: 0.4, scale: 0.2, glyph: null};

	},
	
	_clearPositionAnchors: function(){
		
		this._positionAnchors["start"] = null;
		this._positionAnchors["leftMid"] = null;
		this._positionAnchors["center"] = null;
		this._positionAnchors["rightMid"] = null;
		this._positionAnchors["end"] = null;
	},
	
	_generatePositionStructures: function(){
		
		this._startPositionStruct = [{name:"center", offset: 0}, 
		                             {name:"leftMid", offset: -1}, 
		                             {name:"start", offset: -2}, 
		                             {name: "rightMid", offset: +1}, 
		                             {name: "end", offset: +2}];
		
		this._endPositionStruct = [{name:"center", offset: 0}, 
		                             {name:"rightMid", offset: +1}, 
		                             {name:"end", offset: +2}, 
		                             {name: "leftMid", offset: -1}, 
		                             {name: "start", offset: -2}];
		
		this._fromLeft = ["end", "rightMid", "center", "leftMid", "start"];
		this._fromRight = ["start", "leftMid", "center", "rightMid", "end"];
	},
    
    _tweenGlyph: function(slideArray){
    	
    	var start = this._determineStart(slideArray[0]);
    	
    	for(var i=start; i<this._container.getNumChildren(); i++){
     		
    		if(this._positionAnchors[slideArray[i]].glyph != null && 
         	   slideArray.length>i+1){
         		
         		this._tweenCount++;
         	    var tween = Tween.get(this._positionAnchors[slideArray[i]].glyph, {loop:false,useTicks:false})
         	    .to({x:this._positionAnchors[slideArray[i+1]].x, 
         		     y:this._positionAnchors[slideArray[i+1]].y,
         		     alpha:this._positionAnchors[slideArray[i+1]].alpha,
         		     scaleX:this._positionAnchors[slideArray[i+1]].scale,
         		     scaleY:this._positionAnchors[slideArray[i+1]].scale}, 
         		     400, Ease.circOut).call(this._onAnimationComplete.bind(this));
         	    
         	}
     	}
    },
    
    /*
     * handle start/end of array edge cases
     * where carousel has empty positions.
     */
    _determineStart: function(startPos){
    	
    	var start=0;
    	
    	if(this._activeIndex == 0 && startPos == "start"){
    		start=2;
    	}else if(this._activeIndex == 1 && startPos == "start"){
    		start=1;
    	}else if(this._activeIndex == 2 && startPos == "start"){
    		start=0;
    	}else if(this._activeIndex == 3 && startPos == "start"){
    		start=0;
    	}else if(this._activeIndex == this._revisions.length-2 && startPos == "end"){
    		start=1;
    	}	
    	return start;
    },
    
    _onAnimationComplete: function(){
    	
    	this._completeCount++;
    	if(this._completeCount == this._tweenCount){
    		
    		this._resetView();
        	this.fireEvent(cv.model.EventTypes.CAROUSEL_SLIDE_COMPLETE);
    	}
    },
    
    _resetView: function(){
    	
    	this._revisions[this._activeIndex].glyph.clearActive();
    	this._clearGlyphs();
		this._completeCount = 0;
		this._tweenCount = 0;
    },
    
    _clearGlyphs: function(){
		
		var length = this._container.getNumChildren();
		for(var i=0; i<length; i++){
			this._container.removeChildAt(0);
		}
	},

});
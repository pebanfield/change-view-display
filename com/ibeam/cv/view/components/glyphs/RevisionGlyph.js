/**
 * src/com/ibeam/cv/view/components/glyphs
 *
 * @class Glyph.js - Responsible for Glyph creation from a collection of
 * entries. Manages sub collections of entries for layout logic. Utilizes glyph
 * render for layout rules.
 *
 * @extends
 *
 * @author pebanfield
 *
 * 10:16:46 AM2011
 *
 */
cv.view.RevisionGlyph = new Class({
	
    viewContainer: null,

	allEntryGlyphs : [],

    _MAX_LICHEN_RADIUS: 40,
    _MIN_LICHEN_RADIUS: 14,

    _number: null,
	_anchorIndex : null,
    _positionIndex : null,
	_curvePosition : null,
	_isAnimating : null,
	
	_active : false,
	_viewportWidth : 0,
	_centerPositionType : "",
	
	_revision : null,
	_rings : null,
	_addedCount : 0,

    initialize: function(revision, viewportWidth){

    	this._revision = revision;
        this.viewContainer = new Container();
        this._viewportWidth = viewportWidth;
        
        this._draw();
    },

    _draw: function(){

    	this._buildRings();
    	cv.view.GlyphRenderer.sortEntries(this._revision.entries, this._rings);
    	this._applyLayoutRules();
    	
    },
    
    _applyLayoutRules: function(){
    	
    	//cv.utils.Logger.log("apply layout rules");
    	
    	//CENTER RING
		this._rings["CENTER_RING"].container = new Container();
		this.viewContainer.addChild(this._rings["CENTER_RING"].container);
		
		if(this._rings["CENTER_RING"].entries.length == 1){
			this._centerPositionType = cv.view.GlyphRenderer.SINGLE_CENTER;
			this._rings["CENTER_RING"].entries[0].angle = 0;
			this._createEntryGlyphs(this._rings["CENTER_RING"]);
		}else{
			this._centerPositionType = 
				cv.view.GlyphRenderer.setCenterAngles(this._revision.entries,
						                              this._rings["FIRST_RING"].entries,
						                              this._rings["CENTER_RING"]);
			this._createEntryGlyphs(this._rings["CENTER_RING"]);
		}
		
		//FIRST RING
		if(this._rings["FIRST_RING"].entries.length > 0){
			
			this._positionRingEntries("FIRST_RING");
		}
		
		//SECOND RING
		if(this._rings["SECOND_RING"].entries.length > 0){
			
			this._positionRingEntries("SECOND_RING");
		}
		
		//THIRD RING
		if(this._rings["THIRD_RING"].entries.length > 0){
			
			this._positionRingEntries("THIRD_RING");
		}
    },
    
    _positionRingEntries: function(ringName){
    	
    	this._rings[ringName].container = new Container();
		
    	if(ringName == "FIRST_RING"){
    		cv.view.GlyphRenderer.setFirstRingAngles(this._revision.entries,
                                                     this._rings["CENTER_RING"].entries,
                                                     this._rings["FIRST_RING"],
                                                     this._centerPositionType);
    	}else{
    		cv.view.GlyphRenderer.setOuterRingAngles(this._rings[ringName]);
    	}
		this._createEntryGlyphs(this._rings[ringName]);
		this.viewContainer.addChild(this._rings[ringName].container);
		
		
    },
    
    _createEntryGlyphs: function(ring){
    
       for(var i=0; i<ring.entries.length; i++){

    	   var entryVO = ring.entries[i];
    	   
    	   var radius = entryVO.size/100 + this._MIN_LICHEN_RADIUS;
    	   if(radius>this._MAX_LICHEN_RADIUS)radius = this._MAX_LICHEN_RADIUS;
 
    	   var entryGlyph = new cv.view.EntryGlyph(ring.container, 
    			                              {entryVO: entryVO, 
    		                                  bgWidth:radius*2, 
    		                                  radius:radius,
    		                                  ringRadius:ring.radius,
    		                                  angle:entryVO.angle,
    		                                  stroke:this._revision.stroke,
    		                                  fill:this._revision.fill});
    	   
    	   
    	   ring.glyphs.push(entryGlyph); 
    	   this.allEntryGlyphs.push(entryGlyph);
       }
    	
    },
    
    _buildRings: function(){
    	
    	this._rings = [];
    	
    	this._rings["CENTER_RING"] = 
    	    {type: "CENTER_RING", 
    	     entries: [],
    	     glyphs: [],
    	     radius: this._viewportWidth*0.12};
    	
    	this._rings["FIRST_RING"] = 
	        {type: "FIRST_RING", 
	         entries: [],
	         glyphs: [],
	         radius: this._viewportWidth*0.22};
    	
    	this._rings["SECOND_RING"] = 
            {type: "SECOND_RING", 
             entries: [],
             glyphs: [],
             radius: this._viewportWidth*0.32};
    	
    	this._rings["THIRD_RING"] = 
            {type: "THIRD_RING", 
             entries: [],
             glyphs: [],
             radius: this._viewportWidth*0.42};
    },
     
     _clearEntries: function(){
    	 
    	 for(var i in this._rings){
     		
     		if (this._rings.hasOwnProperty(i)){
     			for(var j=0; j<this._rings[i].glyphs.length; j++){
         			
         			var glyph = this._rings[i].glyphs[j];
         			var context = glyph.canvas.getContext('2d');
         			context.clearRect(0, 0, this._winWidth(), this._winHeight());
         		}
     		}
     	}
     },
   
     getMetadata: function() {
    	 
    	 var metadata = [];
    	 var cGlyphs = this._rings["CENTER_RING"].glyphs;
    	 for(var i=0; i<cGlyphs.length; i++){
    		 metadata.push(cGlyphs[i].getMetadata());
    	 }
    	 var fGlyphs = this._rings["FIRST_RING"].glyphs;
    	 for(var j=0; j<fGlyphs.length; j++){
    		 metadata.push(fGlyphs[j].getMetadata());
    	 }
    	 var sGlyphs = this._rings["SECOND_RING"].glyphs;
    	 for(var j=0; j<sGlyphs.length; j++){
    		 metadata.push(sGlyphs[j].getMetadata());
    	 }
    	 var tGlyphs = this._rings["THIRD_RING"].glyphs;
    	 for(var j=0; j<tGlyphs.length; j++){
    		 metadata.push(tGlyphs[j].getMetadata());
    	 }
    	 return metadata;
     },
     
     setActive: function() {
    	 
    	 for(var i in this._rings){
    		 
    		 if (this._rings.hasOwnProperty(i)){
      			for(var j=0; j<this._rings[i].glyphs.length; j++){
          			
          			var glyph = this._rings[i].glyphs[j];
          			glyph.setActive();
          		}
      		}
    	 }
     }, 
     
     clearActive: function() {
    	 
         for(var i in this._rings){
    		 
    		 if (this._rings.hasOwnProperty(i)){
      			for(var j=0; j<this._rings[i].glyphs.length; j++){
          			
          			var glyph = this._rings[i].glyphs[j];
          			glyph.clearActive();
          		}
      		}
    	 }
     }

});
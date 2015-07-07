/**
 * src/com/ibeam/cv/view/components
 *
 * @class RevisionGraph.js - Manages layout and animation logic.
 * Updates RevGlyphManager with revision data.
 *
 * @extends
 *
 * @author pebanfield
 *
 * 10:38:26 AM2011
 *
 */
cv.view.RevisionGraph = new Class({

	Implements: Events,
	
	_DEPTH: 500,
	_SLIDE_TIMER_INTERVAL: 25,
	
    _revGlyphCarousel: null,
    _revGlyphContainer: null,
    _revSelector: null,
    _revSelectorContainer: null,
    _stage: null,
    
    _revisions: null,
    _periodicalID: null,
    _activeRevisionIndex: 0,
    
    _viewportWidth: 0,
    _windowWidth: 0,
    
	_isAnimating: false,
	_slideInitialised: false,

    initialize: function(stage, viewportWidth){

    	this._viewportWidth = viewportWidth;
    	this._windowWidth = Window.getSize().x;
        this._stage = stage;

        window.addEvent('resize', this._onResizeHandler.bind(this));
    },

    update: function(activeRevisionIndex, revisions){

    	this._activeRevisionIndex = activeRevisionIndex;
    	this._revisions = revisions;
    	
    	if(!this._revGlyphContainer){
    		
    		//REVISION GLYPHS
    		this._revGlyphContainer = new Container();
    		this._stage.addChild(this._revGlyphContainer);
    		
    		//CAROUSEL
    		this._revGlyphCarousel =
                new cv.view.RevisionGlyphCarousel(this._revGlyphContainer);
            this._revGlyphCarousel.addEvent(cv.model.EventTypes.CAROUSEL_SLIDE_COMPLETE,
                    this._onCarouselSlideComplete.bind(this));
            
            //REVISION SELECTOR
            this._revSelectorContainer = new Container();
            this._revSelector = new cv.view.RevisionSelector(this._revSelectorContainer);
            
            this._revSelector.update(this._revisions[activeRevisionIndex].identifier);
            this._revSelector.addEvent(cv.model.EventTypes.PREVIOUS_REVISION,
                    this._onSelectPrevious.bind(this));
            this._revSelector.addEvent(cv.model.EventTypes.NEXT_REVISION,
                    this._onSelectNext.bind(this));
            
            this._stage.addChild(this._revSelectorContainer);
            
    	}
    	this._revGlyphCarousel.draw(activeRevisionIndex, this._revisions);
    	this.fireEvent(cv.model.EventTypes.REVISION_RENDER_COMPLETE);
    },
   
    changeActiveIndex: function(activeRevisionIndex){
    	
    	this._activeRevisionIndex = activeRevisionIndex;
    	this._revGlyphCarousel.draw(activeRevisionIndex);
    	this._revSelector.update(this._revisions[activeRevisionIndex].identifier);
    },
    
    redraw: function(data){
    	
    	this._revisions = data.currentPage;
    	this._activeRevisionIndex = data.currentIndex;
    	this._revGlyphCarousel.draw(this._activeRevisionIndex, this._revisions);
    },
    
    slideLeft: function(){
    	
    	this._revGlyphCarousel.slideLeft();
    },
    
    slideRight: function(){
    	
    	this._revGlyphCarousel.slideRight();
    },
    
    _onCarouselSlideComplete: function() {
    	
    	this.fireEvent(cv.model.EventTypes.CAROUSEL_SLIDE_COMPLETE);
    },
    
    _onSelectPrevious: function(){
    	
    	this.fireEvent(cv.model.EventTypes.PREVIOUS_REVISION);
    },
    
    _onSelectNext: function(){
    	
    	this.fireEvent(cv.model.EventTypes.NEXT_REVISION);
    },
    
    _onResizeHandler: function(){
    	
    	if(this._windowWidth == Window.getSize().x)return;
    	
    	this._windowWidth = Window.getSize().x;
    	//strange race condition on android webkit and tilt
    	try{
    	    this._revGlyphCarousel.repositionGlyphs();
    	    this.fireEvent(cv.model.EventTypes.REQUEST_STAGE_UPDATE);
    	}catch(e){};
    },
     
});




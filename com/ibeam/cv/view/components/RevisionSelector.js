
cv.view.RevisionSelector = new Class({
	
	Implements: Events,
	_container: null,
	_revNumDisplay: null,
	
	initialize: function(container){

        this._container = container;
	    
	    var prevBtn = $("previousBtn");
	    prevBtn.addEvent("click", this._onPreviousClick.bind(this));
	    
	    var nextBtn = $("nextBtn");
	    nextBtn.addEvent("click", this._onNextClick.bind(this));
	    
	    this._revNumDisplay = $("revNumDisplay");
	    
    },
    
    update: function(revStr){
    	
    	this._revNumDisplay.innerText = revStr.slice(0,4) + "...";
    },
    
    _onPreviousClick: function(){
    	cv.utils.Logger.log("click");
    	this.fireEvent(cv.model.EventTypes.PREVIOUS_REVISION);
    }, 
    
    _onNextClick: function(){
    	cv.utils.Logger.log("click2");
    	this.fireEvent(cv.model.EventTypes.NEXT_REVISION);
    },
    
    _onImgLoaded: function(e){
    	cv.utils.Logger.log(e);
    }
});
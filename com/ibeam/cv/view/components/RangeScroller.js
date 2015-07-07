/**
 * src/com/ibeam/cv/view/components
 *
 * @class RangeScroller.js - Displays a range of commits graphically. Provides
 * navigational buttons.
 *
 * @extends
 *
 * @author pebanfield
 *
 *
 */
cv.view.RangeScroller = new Class(/**
 * @author pebanfield
 *
 */
{
	
	Implements: Events,
	
	_THRESHOLD_WIDTH: 1100,
	_MAX_RANGE_WIDTH: 870,
	_MIN_RANGE_WIDTH: 609,
	
	_canvas: null,
	_stage: null,
	_width: null,
	_revisions: null,
	_lineColor: null,
	_activeIndex: null,
	
	_timeline: null,
	_timelineContainer: null,
	_historyDisplayContainer: null,
	
	_boundPageNext: null,
	_boundPagePrev: null,
	_boundRevNext: null,
	_boundRevPrev: null,
	
	initialize: function(width, lineColor){
		 
		this._lineColor = lineColor;
		
    	this._canvas = $("rangeScroller");
    	
    	this._boundRevNext = this._onNext.bind(this);
    	this._boundRevPrev = this._onPrevious.bind(this);
    	this._boundPageNext = this._onPageNext.bind(this);
    	this._boundPagePrev = this._onPagePrevious.bind(this);
    	
    	$("revLinkLayer").addEvent("click", this._onRevSelected.bind(this));
    	
    	$("b_nextBtn").addEvent("click", this._boundRevNext);
    	$("b_prevBtn").addEvent("click", this._boundRevPrev);
    	$("prevPageBtn").addEvent("click", this._boundPagePrev);
    	$("nextPageBtn").addEvent("click", this._boundPageNext);

    	this._width = width;
    	this._canvas.width = this._width;
        this._canvas.height = 240;
        
        this._stage = new Stage(this._canvas);
        this._stage.enableMouseOver(0);
        
        Ticker.addListener(this);
        this._draw();
	},
	
	_draw: function(){
		
		this._timelineContainer = new Container();
		this._timelineContainer.x = 0;
		this._timelineContainer.y = 140;
		
		var timelineConfig = {viewContainer: this._timelineContainer,
				              width: this._width,
				              color: this._lineColor};
		
		this._timeline = new cv.view.Timeline(timelineConfig);
		this._stage.addChild(this._timelineContainer);
		
	},
	
    redraw: function(redrawObj){
		
		this._revisions = redrawObj.currentPage;
		this._width = this._setWidth();
		this._clearTimeline();
		
		this._canvas.width = this._width;
		this._draw();
    	this._timeline.renderTimeline(this._revisions);
    	this._timeline.renderHistoryGlyphs(this._revisions);
    	this.setActive(redrawObj.currentIndex);
    	
    	this._stage.update();
	},
	
	update: function(activeRevisionIndex, revisions){
		
		this._activeIndex = activeRevisionIndex;
		this._revisions = revisions;
		
		this._timeline.renderTimeline(this._revisions);
	},
	
    setHistoryDisplay: function(revisions){
		
		this._revisions = revisions;
		this._timeline.renderHistoryGlyphs(this._revisions);
	},
	
	setActive: function(index){
		
		this._timeline.setActive(index);
	},
	
	disableRevNext: function(){
		$("b_nextBtn").removeEvent("click", this._boundRevNext);
		$("b_nextBtn").setStyle("opacity", "0.4");
	},
	
	disableRevPrev: function(){
		$("b_prevBtn").removeEvent("click", this._boundRevPrev);
		$("b_prevBtn").setStyle("opacity", "0.4");
	},
	
	enableRevNext: function(){
		$("b_nextBtn").addEvent("click", this._boundRevNext);
		$("b_nextBtn").setStyle("opacity", "1");
	},
	
	enableRevPrev: function(){
		$("b_prevBtn").addEvent("click", this._boundRevPrev);
		$("b_prevBtn").setStyle("opacity", "1");
	},
	
	disablePagePrevious: function(){
		$("prevPageBtn").removeEvent("click", this._boundPagePrev);
		$("prevPageBtn").setStyle("opacity", "0.4");
	},
	
	disablePageNext: function(){
		$("nextPageBtn").removeEvent("click", this._boundPageNext);
		$("nextPageBtn").setStyle("opacity", "0.4");
	},
	
	activatePaging: function(){
		$("nextPageBtn").addEvent("click", this._boundPageNext);
		$("prevPageBtn").addEvent("click", this._boundPagePrev);
		$("nextPageBtn").setStyle("opacity", "1");
		$("prevPageBtn").setStyle("opacity", "1");
	},
	
	_clearTimeline: function(){
		
		this._timeline.clear();
    	this._stage.removeChild(this._timelineContainer);
    	this._timelineContainer = null;
	},
	
    _setWidth: function(){
		
		var width = Window.getSize().x;
		
		if(width > this._THRESHOLD_WIDTH){
    		width = this._MAX_RANGE_WIDTH;
    	}else{
    		width = this._MIN_RANGE_WIDTH;
    	}
		return width;
	},
	
	/*
	 * Select the correct icon index based
	 * on mouse click client x. 
	 */
	_onRevSelected: function(event){
		
		var relativeXdiff = Window.getSize().x - event.target.clientWidth;
		var relativeX = event.client.x - relativeXdiff/2;
		var selectedIndex = Math.floor(relativeX / this._timeline.REV_WIDTH);
		this.fireEvent(cv.model.EventTypes.SELECT_BY_INDEX, selectedIndex);
	},
	
	_onNext: function(){
		this.fireEvent(cv.model.EventTypes.NEXT_REVISION);
	},
	
	_onPrevious: function(){
		this.fireEvent(cv.model.EventTypes.PREVIOUS_REVISION);
	},
	
	_onPageNext: function(){
		cv.utils.Logger.log("_onPageNext");
		this.fireEvent(cv.model.EventTypes.NEXT_PAGE);
	},
	
	_onPagePrevious: function(){
		this.fireEvent(cv.model.EventTypes.PREVIOUS_PAGE);
	},
	
	tick: function() {
		
		this._stage.update();
    }

});
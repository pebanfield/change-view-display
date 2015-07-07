/**
 * src/com/ibeam/cv/view
 *
 * @class MainView.js - Parent viewComponent class for application.
 *
 * @extends
 *
 * @author pebanfield
 *
 * 11:04:22 AM2011
 *
 */
cv.view.MainView = new Class({

	Implements: Events,
	
	_BIG_COMMIT_LENGTH: 6,
	_MAX_LICHEN_RADIUS: 40,
	
	_LINK_PADDING_X: -2,
	_LINK_PADDING_Y: -2,
	
    element: null,
    facade: null,
    
    _stage: null,
    _canvas: null,
    _swipeZone: null,
    _background: null,
    _startX: null,
    _currentLinks: [],
    _currentRevGlyph: null,
    lineColor: null,

    initialize: function(el, lineColor)
    {
        this.element = new Element(el, lineColor);
        this.lineColor = lineColor;
        
        this._swipeZone = document.getElementById("swipeZone");
        this._addEventListeners();
        
    	this._canvas = document.getElementById("revGraph");
    	
    	this._canvas.width = Window.getSize().x;
        this._canvas.height = Window.getSize().y;
        this._stage = new Stage(this._canvas);
        this._stage.enableMouseOver(0);
        
        this._positionLoader();
        
        window.addEvent('resize', this._onResizeHandler.bind(this));
        if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1){
            window.addEvent('focus', this._onFocus.bind(this));
        }
        //this._stage.onMouseUp = function(evt){console.log("mouseup");}; 
        //not working
        //this._stage.onClick = function(evt){console.log("click");}; 
        
        Ticker.addListener(this);
        
        this.facade = cv.ApplicationFacade.getInstance();
        this.facade.startup(this);
    },

    visible: function(isVisible) {
    	
    	if(isVisible){
    		$('root').setStyle('visibility', 'visible');
    	}else{
    		$('root').setStyle('visibility', 'hidden');
    	}
    	
    },
    
    showLoading: function(visible){
    	
    	if(visible){
    		$('loading').setStyle('visibility', 'visible');
    	}else{
    		$('loading').setStyle('visibility', 'hidden');
    	}
    	
    },
    
    displayLinks: function(revision){
    	
    	this._currentRevGlyph = revision.glyph;
    	var linkLayer = $("linkLayer");
    	var metadata = this._currentRevGlyph.getMetadata();
    	
    	for(var i=0; i<metadata.length; i++){
    		
    		var link = this._createLink(metadata[i]);
    		this._currentLinks.push({link: link, data: metadata[i]});
        	link = this._positionLink(metadata[i].radius, metadata[i].x, metadata[i].y, link);
        	linkLayer.adopt(link);
    	}
    	
    },
    
    clearLinks: function(){
    	
    	if(this._currentLinks.length < 1)return;
    	
    	for(var i=0; i<this._currentLinks.length; i++){
    		
    		this._currentLinks[i].link.dispose();
    		this._currentLinks[i].link.destroy();
    	}
    },
    
    _createLink: function(data){
    	
    	var styleName;
    	if(this._lineColor == "#000"){
    		styleName = 'entryLink';
    	}else{
    		styleName = 'darkEntryLink';
    	}
    	var scope = this;
    	var link = new Element('a', {
    	    href: '#',
    	    'class': styleName,
    	    html: data.name + " <span style='font-size:8px'>&#62;&#62;</span>",
    	    events: {
    	        click: function(target){
    	        	
    	        	scope.fireEvent(cv.model.EventTypes.ENTRY_SELECTED, data);
    	        }
    	    }
    	});
    	return link;
    },
    
    _positionLink: function(metaRadius, metaX, metaY, link){
    	
    	var stagePoint = cv.utils.Translate.localToGlobal(metaX, metaY);
    	
    	var linkY;
    	var linkX;
    	//keep text from overlapping on larger entries
    	if(metaRadius > this._MAX_LICHEN_RADIUS*0.5){
    		linkY = stagePoint.y + 6;
        	linkX = stagePoint.x + 6;
    	}else{
    		linkY = stagePoint.y + metaRadius + this._LINK_PADDING_Y;
        	linkX = stagePoint.x + metaRadius + this._LINK_PADDING_X;
    	}
    	
    	
    	link.setStyles({left: linkX, top: linkY});
    	return link;
    },
    
    _positionLoader: function(){
    	
    	$('loading').setStyle("top", Window.getSize().y/2 - 15);
        $('loading').setStyle("left", Window.getSize().x/2 - 50);
    },
    
    toElement: function() {
        return this.element;
    },
    
    setStage: function(stage){
    	this._stage = stage;
    },
    
    getStage: function(){
    	return this._stage;
    },
    
    tick: function() {
    	
    	this._stage.update();
    },
    
    _addEventListeners: function(){
    	
    	this._swipeZone.addEventListener("touchmove", 
                this._onTouchMove.bind(this), 
                true);
    	this._swipeZone.addEventListener("touchstart", 
                this._onTouchStart.bind(this), 
                true);
    	this._swipeZone.addEventListener("touchend", 
                this._onTouchEnd.bind(this), 
                true);
    	
    },
    
    _onTouchMove: function(evtObj){
    	
    	evtObj.preventDefault();
    	if (event.targetTouches.length > 0 & event.changedTouches.length == 1) {
    	    
    	    if(evtObj.touches.item(0).pageX > this._startX){
    		    this.fireEvent(cv.model.EventTypes.SLIDE_RIGHT);
    	    }else if(evtObj.touches.item(0).pageX < this._startX){
    		    this.fireEvent(cv.model.EventTypes.SLIDE_LEFT);
    	    }
    	    this._startX = -1;
    	}
    }, 
    
    _onTouchStart: /**
     * @param evtObj
     */
    function(evtObj){
    	
    	evtObj.preventDefault();
    	
    	this._startX = evtObj.touches.item(0).pageX;
    }, 
    
    _onTouchEnd: function(){
    	
    },
    
    _onResizeHandler: function(){
		
        for(var i=0; i<this._currentLinks.length; i++){
    		
        	var link = this._currentLinks[i].link;
        	var data = this._currentLinks[i].data;
        	this._positionLink(data.radius, data.x, data.y, link);

    	}
        this._positionLoader();
        this.fireEvent(cv.model.EventTypes.RESIZE);
	},
	
	_onFocus: function(){
		
		//cv.utils.Logger.log("focus");
		//fixes screen draw/blur bug in chrome where elements disappear
		if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1){
			//window.location.reload();
		}
	
	}
});






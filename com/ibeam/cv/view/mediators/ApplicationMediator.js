/**
 * src/com/ibeam/cv/view/mediators
 *
 * @class ApplicationMediator.js - Provides mediation for app level logic
 * such as key event handling and data binding. Handles keyboard input.
 *
 * @extends Mediator
 *
 * @author pebanfield
 *
 * 11:03:07 AM2011
 *
 */
cv.view.ApplicationMediator = new Class({

    Extends: Mediator,
    keyboard: null,
    self: null,
    
    //TODO - refactor - think about media queries & layout management
	_THRESHOLD_WIDTH: 1100,
	_LARGE_RANGE_SCROLLER_WIDTH : 870,
    _SMALL_RANGE_SCROLLER_WIDTH : 609,

	listControlLength: null,
    
    _configProxy: null,
    _repoDataProxy: null,
    
    _isSliding: false,
    _newActiveRevIndex: null,
    _revisionGlyphs: null,
    _activeRevisionGlyph: null,
    _appIsActive: true,
    _numAnimatorsCompleted: 0,
    

    initialize: function(viewComponent){

        this.parent(cv.view.ApplicationMediator.NAME, viewComponent);
        this._configProxy = this.facade.retrieveProxy(cv.model.ConfigProxy.NAME);
        this._repoDataProxy = this.facade.retrieveProxy(cv.model.RepoDataProxy.NAME);
        this.viewComponent.addEvent(cv.model.EventTypes.SLIDE_RIGHT,
    	        this._onArrowLeft.bind(this));
        this.viewComponent.addEvent(cv.model.EventTypes.SLIDE_LEFT,
    	        this._onArrowRight.bind(this));
        this.viewComponent.addEvent(cv.model.EventTypes.ENTRY_SELECTED,
    	        this._onEntrySelected.bind(this));
        this.viewComponent.addEvent(cv.model.EventTypes.RESIZE,
    	        this._onResize.bind(this));
        
        this.listControlLength = this._getRangeScrollerLength();
    },
    
    listNotificationInterests: function(){
    	
    	return [cv.model.NotificationTypes.GLYPH_RENDERING_COMPLETE,
    	        cv.model.NotificationTypes.CAROUSEL_SLIDE_COMPLETE,
    	        cv.model.NotificationTypes.NEXT_REVISION,
    	        cv.model.NotificationTypes.PREVIOUS_REVISION,
    	        cv.model.NotificationTypes.NEXT_PAGE,
    	        cv.model.NotificationTypes.PREVIOUS_PAGE,
    	        cv.model.NotificationTypes.SELECT_BY_INDEX,
    	        cv.model.NotificationTypes.SET_MODAL_WINDOW_ACTIVE,
    	        cv.model.NotificationTypes.INDEX_CHANGED,
    	        cv.model.NotificationTypes.REQUEST_STAGE_UPDATE];
    },
    
    handleNotification: function(notification){
    	
    		
    	switch(notification.name){
    	
    	    case cv.model.NotificationTypes.GLYPH_RENDERING_COMPLETE :
    	    	
    	    	if(!this._appIsActive)return;
    	    	this._displayLinks();
    	    	this.viewComponent.showLoading(false);
    	    	this.viewComponent.tick();
    	    	Ticker.setPaused(true);
    	    	this.viewComponent.visible(true);
    	    	break;
    	    case cv.model.NotificationTypes.CAROUSEL_SLIDE_COMPLETE :
    	    	
    	    	if(!this._appIsActive)return;
    	    	this._isSliding = false;
    	    	this._repoDataProxy.setActiveRevision(this._newActiveRevIndex);
    	    	this._displayLinks();
    	    	Ticker.setPaused(true);
    	    	break;
    	    case cv.model.NotificationTypes.NEXT_REVISION :
    	    	
    	    	if(!this._appIsActive)return;
    	    	if(this._isSliding)return;
    	    	this._selectNext();
    	    	break;
    	    case cv.model.NotificationTypes.PREVIOUS_REVISION :
    	    	
    	    	if(!this._appIsActive)return;
    	    	if(this._isSliding)return;
    	    	this._selectPrevious();
    	    	break;
    	    case cv.model.NotificationTypes.NEXT_PAGE : 
    	    	
    	    	this.viewComponent.visible(false);
    	    	this.viewComponent.showLoading(true);
    	    	this._repoDataProxy.nextPage();
    	    	this.viewComponent.clearLinks();
    	    	break;
    	    case cv.model.NotificationTypes.PREVIOUS_PAGE :
    	    	
    	    	this.viewComponent.visible(false);
    	    	this.viewComponent.showLoading(true);
    	    	this._repoDataProxy.previousPage();
    	    	this.viewComponent.clearLinks();
    	    	break;
    	    case cv.model.NotificationTypes.SELECT_BY_INDEX :
    	    	
    	    	if(!this._appIsActive)return;
    	    	
    	    	this._numAnimatorsCompleted = 0;
    	    	this.viewComponent.clearLinks();
    	    	this._newActiveRevIndex = notification.getBody();
    	    	Ticker.setPaused(false);
        		this.facade.sendNotification(cv.model.NotificationTypes.CHANGE_INDEX, this._newActiveRevIndex);
				break;
    	    case cv.model.NotificationTypes.SET_MODAL_WINDOW_ACTIVE :
    	    	
    	    	this._appIsActive = notification.getBody();
    	    	break;
    	    case cv.model.NotificationTypes.INDEX_CHANGED : 
    	    	
    	    	this._numAnimatorsCompleted++;
    	    	if(this._numAnimatorsCompleted > 1){
    	    		
    	    		this.viewComponent.tick();
    	    		Ticker.setPaused(true);
    	    		this._repoDataProxy.setActiveRevision(this._newActiveRevIndex);
    	    		this._displayLinks();
    	    		this._numAnimatorsCompleted = 0;
    	    	}
    	    	break;
    	    case cv.model.NotificationTypes.REQUEST_STAGE_UPDATE :
    	    	
    	    	this.viewComponent.tick();
    	    	break;
    	    default : 
    	    	cv.utils.Logger.log("App Mediator : unhandled notification");
    	}
    },
   
    setKeyboard: function(kb){

        this.keyboard = kb;
        this.keyboard.addEvents({
            'left': this._onArrowLeft.bind(this),
            'right': this._onArrowRight.bind(this),
            'up': this._onArrowUp.bind(this),
            'down': this._onArrowDown.bind(this)
        });
        this.keyboard.activate();

    },

    _requestData: function(){

    	cv.utils.Logger.log("requestData");
        //TODO - pass object
        //this.facade.sendNotification(CommandTypes.REQUEST_REV_DATA, requestor);
    },
    
    _displayLinks: function(){
    	
    	var index = this._repoDataProxy.activeRevisionIndex;
    	var activeRevision = this._repoDataProxy.currentPage[index];
    	this.viewComponent.displayLinks(activeRevision);
    },
    
    _selectNext: function(){
    	
    	//cv.utils.Logger.log("_selectNext " + this._repoDataProxy.activeRevisionIndex);
    	if(this._repoDataProxy.activeRevisionIndex < this._repoDataProxy.currentPage.length-1){
    		
    		Ticker.setPaused(false);
    		this.viewComponent.clearLinks();
    		this._newActiveRevIndex = this._repoDataProxy.activeRevisionIndex+1;
    		this.facade.sendNotification(cv.model.NotificationTypes.SLIDE_LEFT);
    		this.facade.sendNotification(cv.model.NotificationTypes.CHANGE_RANGE_INDEX, this._newActiveRevIndex);
			this._isSliding = true;
		}
    },
    
    _selectPrevious: function(){
    	
    	//cv.utils.Logger.log("_selectPrevious " + this._repoDataProxy.activeRevisionIndex);
    	if(this._repoDataProxy.activeRevisionIndex > 0){
    		
    		Ticker.setPaused(false);
    		this.viewComponent.clearLinks();
    		this._newActiveRevIndex = this._repoDataProxy.activeRevisionIndex-1;
    		this.facade.sendNotification(cv.model.NotificationTypes.SLIDE_RIGHT);
    		this.facade.sendNotification(cv.model.NotificationTypes.CHANGE_RANGE_INDEX, this._newActiveRevIndex);
			this._isSliding = true;
		}
    },
    
    _onArrowLeft: function(){
        //cv.utils.Logger.log('arrowLeft');
        if(this._isSliding || !this._appIsActive)return;
        this._selectPrevious();
    },

    _onArrowRight: function(){
    	//cv.utils.Logger.log('arrowRight');
    	if(this._isSliding || !this._appIsActive)return;
    	this._selectNext();
    },

    _onArrowUp: function(){
    	cv.utils.Logger.log('arrowUp');
    },

    _onArrowDown: function(){
    	cv.utils.Logger.log('arrowDown');
    },
    
    _onEntrySelected: function(eventObj){
    	
    	this.facade.sendNotification(cv.model.NotificationTypes.SHOW_ENTRY_INFO, 
    			{revGlyph: this._repoDataProxy.currentPage[this._repoDataProxy.activeRevisionIndex].glyph,
    		     entryVO: this._repoDataProxy.getCurrentEntryByName(eventObj.name), 
    		     data: eventObj});
    }, 
    
    _requestPage: function(pageNum){

        mainView.facade.sendNotification(cv.model.CommandTypes.REQUEST_REV_DATA, null, pageNum);
    },
    
    _onResize: function(){
    
    	var length = this._getRangeScrollerLength();
    	
    	if(this.listControlLength != length){
    		
    		this.listControlLength = length;
    		this._repoDataProxy.resetPageSize(this.listControlLength);
    		
    		var resizeConfig = {currentPage: this._repoDataProxy.currentPage,
    				            currentIndex: this._repoDataProxy.activeRevisionIndex};
    		this.facade.sendNotification(cv.model.NotificationTypes.RESIZE, resizeConfig);
    	}
    	
    },
    
    _getPageState: function(index){
    	
    	if(index == 0){
    		
    	}
    	
    },

	_getRangeScrollerLength: function(){
		
		var width = Window.getSize().x;
		var length;
		if(width > this._THRESHOLD_WIDTH){
			length = this._repoDataProxy.LARGE_PAGE_LENGTH;
		}else{
			length = this._repoDataProxy.SMALL_PAGE_LENGTH;
		}
		return length;
	},
	
	getRangeScrollerWidth: function(){
		
		if(this.listControlLength == this._repoDataProxy.LARGE_PAGE_LENGTH){
			return this._LARGE_RANGE_SCROLLER_WIDTH;
		}else{
			return this._SMALL_RANGE_SCROLLER_WIDTH;
		}
	},
	
});

cv.view.ApplicationMediator.NAME = "ApplicationMediator";



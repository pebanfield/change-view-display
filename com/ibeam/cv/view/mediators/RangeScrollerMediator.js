/**
 * src/com/ibeam/cv/view/mediators
 *
 * @class RangeScrollerMediator.js - Provides mediation for the RangeScoller 
 * component. Updates RangeScroller activeIndex and loads new range data.
 *
 * @extends Mediator
 *
 * @author pebanfield
 *
 *
 */
cv.view.RangeScrollerMediator = new Class({

    Extends: Mediator,
    
    _repoDataProxy: null,
    _rendered: false,
    
    initialize: function(viewComponent){
    	
    	this.parent(cv.view.RangeScrollerMediator.NAME, viewComponent);
    },
    
    setData: function(data){

        this._repoDataProxy = data;
        this._repoDataProxy.addEvent(cv.model.EventTypes.REVISIONS_LOADED,
                this._onRevisionsLoaded.bind(this));
        this._repoDataProxy.addEvent(cv.model.EventTypes.ACTIVE_REV_CHANGE,
    	        this._onActiveRevChanged.bind(this));
        
        this.viewComponent.addEvent(cv.model.EventTypes.PREVIOUS_REVISION,
                this._onSelectPrevious.bind(this));
        this.viewComponent.addEvent(cv.model.EventTypes.NEXT_REVISION,
                this._onSelectNext.bind(this));
        this.viewComponent.addEvent(cv.model.EventTypes.NEXT_PAGE,
    	        this._onSelectNextPage.bind(this));
        this.viewComponent.addEvent(cv.model.EventTypes.PREVIOUS_PAGE,
    	        this._onSelectPreviousPage.bind(this));
        this.viewComponent.addEvent(cv.model.EventTypes.SELECT_BY_INDEX,
    	        this._onSelectByIndex.bind(this));
       
    },
    
    listNotificationInterests: function(){
    	
    	return [cv.model.NotificationTypes.CHANGE_INDEX,
    	        cv.model.NotificationTypes.CHANGE_RANGE_INDEX,
    	        cv.model.NotificationTypes.GLYPH_RENDERING_COMPLETE,
    	        cv.model.NotificationTypes.RESIZE,
    	        cv.model.NotificationTypes.PAGE_CHANGED];
    },
    
    handleNotification: function(notification){
    	
    	switch(notification.name){
    	
    	    case cv.model.NotificationTypes.GLYPH_RENDERING_COMPLETE :
    	    	
    	    	cv.utils.Logger.log("RangeScroller - Render complete");
    	    	this.viewComponent.setHistoryDisplay(this._repoDataProxy.currentPage);
    	    	if(this._rendered){
    	    		var resizeConfig = {currentPage: this._repoDataProxy.currentPage,
				            currentIndex: this._repoDataProxy.activeRevisionIndex};
    	    		this.viewComponent.redraw(resizeConfig);
    	    	}
    	    	this._rendered = true;
    	    	break;
    	    case cv.model.NotificationTypes.CHANGE_RANGE_INDEX : 
    	    	
    	    	this.viewComponent.enableStageUpdate = true;
    	    	this.viewComponent.setActive(notification.getBody());
    	    	break;
    	    case cv.model.NotificationTypes.CHANGE_INDEX :
    	    	
    	    	this.viewComponent.enableStageUpdate = true;
    	    	var newIndex = notification.getBody();
    	    	this.viewComponent.setActive(newIndex);
    	    	this.viewComponent.tick();
    	    	this.facade.sendNotification(cv.model.NotificationTypes.INDEX_CHANGED);
    	    	break;
    	    case cv.model.NotificationTypes.RESIZE : 
    	    	
    	    	this.viewComponent.redraw(notification.getBody());
    	    	break;
    	    case cv.model.NotificationTypes.PAGE_CHANGED : 
    	    	
    	    	switch( notification.getBody() ){
    	    	
    	    	    //TODO - fix bugs
    	    	    case "latest" : 
    	    	    	cv.utils.Logger.log("RangeScrollerMed : latest state");
    	    	    	this.viewComponent.disablePageNext();
    	    	    	this.viewComponent.disableRevNext();
    	    	    	break;
    	    	    case "first" :
    	    	    	cv.utils.Logger.log("RangeScrollerMed : first state");
    	    	    	this.viewComponent.disablePagePrevious();
    	    	    	this.viewComponent.disableRevPrev();
    	    	    	break;
    	    	    case "mid" : 
    	    	    	cv.utils.Logger.log("RangeScrollerMed : mid state");
    	    	    	this.viewComponent.activatePaging();
    	    	    	this.viewComponent.enableRevNext();
    	    	    	this.viewComponent.enableRevPrev();
    	    	    	break;
    	    	}
    	    	
    	    	break;
    	    default : 
    	    	cv.utils.Logger.log("RangeScroller Mediator : unhandled notification");
    	}
    },
    
    
    _onRevisionsLoaded: function(){
    	
    	this.viewComponent.update(this._repoDataProxy.activeRevisionIndex,
                this._repoDataProxy.currentPage);
    	this.viewComponent.setActive(this._repoDataProxy.activeRevisionIndex);
    	this.viewComponent.tick();
    },
    
    _onActiveRevChanged: function(){
    	
    },
    
    _onSelectNext: function(){
    	this.facade.sendNotification(cv.model.NotificationTypes.NEXT_REVISION);
    },
    
    _onSelectPrevious: function(){
    	this.facade.sendNotification(cv.model.NotificationTypes.PREVIOUS_REVISION);
    },
    
    _onSelectNextPage: function(){
    	cv.utils.Logger.log("selecting next page");
    	this.facade.sendNotification(cv.model.NotificationTypes.NEXT_PAGE);
    },
    
    _onSelectPreviousPage: function(){
    	this.facade.sendNotification(cv.model.NotificationTypes.PREVIOUS_PAGE);
    }, 
    
    _onSelectByIndex: function(index){
    	
    	this.facade.sendNotification(cv.model.NotificationTypes.SELECT_BY_INDEX, index);
    }
   

});

cv.view.RangeScrollerMediator.NAME = "RangeScrollerMediator";

        
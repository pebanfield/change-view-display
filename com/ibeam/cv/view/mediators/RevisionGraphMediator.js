/**
 * src/com/ibeam/cv/view/mediators
 *
 * @class RevisionGraphMediator.js - Listens to data changes and updates
 * graph carousel accordingly. Listens to key driven notifications.
 *
 * @extends
 *
 * @author pebanfield
 *
 * 10:24:49 AM2011
 *
 */
cv.view.RevisionGraphMediator = new Class({

    Extends: Mediator,
    _repoDataProxy: null,

    initialize: function(viewComponent){

        this.parent(cv.view.RevisionGraphMediator.NAME, viewComponent);
    },

    setData: function(data){

        this._repoDataProxy = data;
        this._repoDataProxy.addEvent(cv.model.EventTypes.REVISIONS_LOADED,
                this._onRevisionsLoaded.bind(this));
        
        this.viewComponent.addEvent(cv.model.EventTypes.CAROUSEL_SLIDE_COMPLETE,
                this._onCarouselSlideComplete.bind(this));
        this.viewComponent.addEvent(cv.model.EventTypes.PREVIOUS_REVISION,
                this._onSelectPrevious.bind(this));
        this.viewComponent.addEvent(cv.model.EventTypes.NEXT_REVISION,
                this._onSelectNext.bind(this));
        this.viewComponent.addEvent(cv.model.EventTypes.REVISION_RENDER_COMPLETE,
        		this._onRenderComplete.bind(this));
        this.viewComponent.addEvent(cv.model.EventTypes.REQUEST_STAGE_UPDATE,
        		this._onStageUpdateRequest.bind(this));
    },
    
    listNotificationInterests: function(){
    	return [cv.model.NotificationTypes.SLIDE_LEFT,
    	        cv.model.NotificationTypes.SLIDE_RIGHT,
    	        cv.model.NotificationTypes.CHANGE_INDEX,
    	        cv.model.NotificationTypes.RESIZE];
    },
    
    handleNotification: function(notification){
    	
    	switch(notification.name){
    	
    	    case cv.model.NotificationTypes.SLIDE_LEFT :
    	    	
    	    	this.viewComponent.slideLeft();
    	    	break;
            case cv.model.NotificationTypes.SLIDE_RIGHT :
            	
    	    	this.viewComponent.slideRight();
    	    	break;
            case cv.model.NotificationTypes.CHANGE_INDEX : 
            	
            	this.viewComponent.changeActiveIndex(notification.getBody());
            	this.facade.sendNotification(cv.model.NotificationTypes.INDEX_CHANGED);
            	break;
            case cv.model.NotificationTypes.RESIZE : 
            	this.viewComponent.redraw(notification.getBody());
            	break;
    	    default : 
    	    	cv.utils.Logger.log("RevisionGraphMediator : unhandled notification");
    	}
    },

    _onRevisionsLoaded: function(){

    	this.viewComponent.update(this._repoDataProxy.activeRevisionIndex,
        		                  this._repoDataProxy.currentPage);
        this._repoDataProxy.addEvent(cv.model.EventTypes.ACTIVE_REV_CHANGE,
                this._onActiveRevChanged.bind(this));
    },
    
    _onActiveRevChanged: function() {
    	
    	this.viewComponent.changeActiveIndex(this._repoDataProxy.activeRevisionIndex);
    },
    
    _onCarouselSlideComplete: function(){
    	
    	this.facade.sendNotification(cv.model.NotificationTypes.CAROUSEL_SLIDE_COMPLETE);
    },
    
    _onSelectPrevious: function(){
    	this.facade.sendNotification(cv.model.NotificationTypes.PREVIOUS_REVISION);
    },
    
    _onSelectNext: function(){
    	this.facade.sendNotification(cv.model.NotificationTypes.NEXT_REVISION);
    },
    
    _onRenderComplete: function(){
    	
    	this.facade.sendNotification(cv.model.NotificationTypes.GLYPH_RENDERING_COMPLETE);
    },
    
    _onStageUpdateRequest: function(){
    	
    	this.facade.sendNotification(cv.model.NotificationTypes.REQUEST_STAGE_UPDATE);
    }
    
});

cv.view.RevisionGraphMediator.NAME = "RevisionGraphMediator";


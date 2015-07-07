/**
 * src/com/ibeam/cv/view/mediators
 *
 * @class EntryInfoMediator.js - listens to data changes and
 * updates rev info panel accordingly.
 *
 * @extends
 *
 * @author pebanfield
 *
 */
cv.view.EntryInfoMediator = new Class({

    Extends: Mediator,
    
    _repoDataProxy: null,
    _entryVO: null,

    initialize: function(viewComponent){

        this.parent(cv.view.EntryInfoMediator.NAME, viewComponent);
        this.viewComponent.addEvent(cv.model.EventTypes.WINDOW_CLOSE,
    	        this._onWindowClose.bind(this));
        this._repoDataProxy = 
        	this.facade.retrieveProxy(cv.model.RepoDataProxy.NAME);
    },
    
    listNotificationInterests: function(){
    	
    	return [cv.model.NotificationTypes.SHOW_ENTRY_INFO];
    },
    
    handleNotification: function(notification){
    	
    	switch(notification.name){
    	
    	    case cv.model.NotificationTypes.SHOW_ENTRY_INFO : 
    	    	
    	    	this._entryVO = notification.getBody().entryVO;
    	    	var revGlyph = notification.getBody().revGlyph;
    	    	
    	    	var fileExtension = this._entryVO.name.split(".")[1];
    	    	//var resourceUrl = this._repoDataProxy.codeStyleMap.getResourceByExtension(fileExtension);
    	    	
    			//var style = this._repoDataProxy.codeStyleMap.getStyleByExtension(fileExtension);
    	    	
    	    	
    	    	this.viewComponent.draw(this._repoDataProxy.currentRepoPath, this._repoDataProxy.getActiveRevision(),
    	    			                              revGlyph, this._entryVO, notification.getBody().data);
    	    	this.facade.sendNotification(cv.model.NotificationTypes.SET_MODAL_WINDOW_ACTIVE, false);
    	    	
    	    	/*
    	    	SyntaxHighlighter.defaults['toolbar'] = false;
    	    	var codeStyleUrl = style + ' ' + resourceRoot + '/js/highlighter/' + resourceUrl;
    	    	cv.utils.Logger.log(codeStyleUrl);
    	    	SyntaxHighlighter.autoloader(codeStyleUrl);
    	    	
    	    	Asset.javascript(resourceRoot + "/js/highlighter" + resourceUrl, {
    	    	    id: resourceUrl,
    	    	    onLoad: this._onStyleScriptLoaded.bind(this)
    	    	});
    	    	SyntaxHighlighter.all();
    	    	*/
    	    	
    	    	break;
    	    default : 
    	    	
    	    	cv.utils.Logger.log("EntryInfoMediator : unhandled notification");
    	    	break;
    	}
    	
    },
    
    _onWindowClose: function(){
    	
    	this.facade.sendNotification(cv.model.NotificationTypes.SET_MODAL_WINDOW_ACTIVE, true);
    },
    
    _onStyleScriptLoaded: function(){
    	
    	cv.utils.Logger.log("script loaded");

    	
    }

});

cv.view.EntryInfoMediator.NAME = "EntryInfoMediator";


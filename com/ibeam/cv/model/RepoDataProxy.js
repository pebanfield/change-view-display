/**
 * src/com/ibeam/cv/model
 *
 * @class RepoDataProxy.js - Stores revision history data accessed
 *  via the SVN JSON service.
 *
 * @extends Proxy
 *
 * @author pebanfield
 *
 * 11:01:47 AM2011
 *
 */
cv.model.RepoDataProxy = new Class({

    Extends: Proxy,
    Implements: Events,

    LARGE_PAGE_LENGTH : 10,
    SMALL_PAGE_LENGTH : 7,
    
    cvsType: null,
    activeRevisionIndex: -1,
    visualPageTotal: 0,
    truePageTotal: 0,
    currentPage: null,
    currentPageNum: 1,
    currentPageSize: 10,
    activePageIndex: -1,
    _cursorIndex: 0,
    repoLocation: "file:///Users/pebanfield/SVNrep/ChangeView",
    currentRepoPath: null,
    codeStyleMap: null,
    viewportWidth: 0,
    
    _revisions: [],
    _glyphs: [],
    _authors: [],
    _activeRevision: null,
    _repoRootPath: null,
    _colors: null,
    _colorIndex: -1,
    _currentAuthor: "",
    _containsLatest: false,
    _containsFirst: false,

    initialize: function(){

        this.parent(cv.model.RepoDataProxy.NAME);
        this.codeStyleMap = new cv.utils.CodeStyleMap();
    },

    getActiveRevision: function(){

        return this._activeRevision;
    },

    setActiveRevision: function(index){

        this.activeRevisionIndex = index;
        this._activeRevision = this.currentPage[this.activeRevisionIndex];
        this.fireEvent(cv.model.EventTypes.ACTIVE_REV_CHANGE, this._activeRevision);
    },

    setRepoRootPath: function(path){

        this._repoRootPath = path;
        this.fireEvent(cv.model.EventTypes.REPO_TITLE_CHANGE, this._repoRootPath);
    },
    
    setColors: function(colors){
    	
    	this._colors = colors;
    },

    getRepoPath: function(){

        return this._repoRootPath;
    },

    addPage: function(revisions, isLatest, isFirst){

    	cv.utils.Logger.log("ADD PAGE");
    	cv.utils.Logger.log("revisions.length = " + revisions.length);
    	cv.utils.Logger.log("isLatest = " + isLatest);
    	cv.utils.Logger.log("isFirst = " + isFirst);
    	//generate glyphs
    	revisions = this._addRevisionGlyphs(revisions);
    	//add page to total revisions
    	this._revisions = this._revisions.concat(revisions);
    	//calculate current page width
    	this.visualPageTotal = this._revisions.length / this.LARGE_PAGE_LENGTH;
    	this.truePageTotal = this._revisions.length / this.LARGE_PAGE_LENGTH;
    	
    	//determine cursor position based on page width
    	if(this._revisions.length < this.currentPageSize){
    		this._cursorIndex=0;
    	}else{
    		this._cursorIndex = this._revisions.length - (this.currentPageSize * this.currentPageNum);
    	}
        this.currentPage = this._getCurrentPage();
    	
        //reset revision index based on page width
    	if(this.activeRevisionIndex == -1){
    		
    		if(this._revisions.length < this.currentPageSize){
    			this.activeRevisionIndex = this._revisions.length-1;
    		}else{
    			this.activeRevisionIndex = this.currentPageSize-1;
    		}
    		
    		this.setActiveRevision(this.activeRevisionIndex);
    		this.facade.sendNotification(cv.model.CommandTypes.APP_READY);
    	}
    	
    	this.fireEvent(cv.model.EventTypes.REVISIONS_LOADED);
    	
    	//check state of paging - first, latest, or mid
    	this._containsLatest = isLatest;
    	this._containsFirst = isFirst;
    	if(this._containsLatest){
    		this.facade.sendNotification(cv.model.NotificationTypes.PAGE_CHANGED, "latest");
    	}else if(this._containsFirst){
    		this.facade.sendNotification(cv.model.NotificationTypes.PAGE_CHANGED, "first");
    	}else{
    		this.facade.sendNotification(cv.model.NotificationTypes.PAGE_CHANGED, "mid");
    	}
    	
    	//TODO - fix this
    	this.activePageIndex++;
    	
    },
    
    //moving toward the most recent commit in repo
    nextPage: function(){
    	
    	cv.utils.Logger.log("nextPage");
    	cv.utils.Logger.log("this.activePageIndex = " + this.activePageIndex);
    	cv.utils.Logger.log("this.truePageTotal = " + this.truePageTotal);
    	if(this.activePageIndex == 1 && this._containsLatest){ 
    			
    		this.facade.sendNotification(cv.model.NotificationTypes.PAGE_CHANGED, "latest");
    	}else{
    		this.facade.sendNotification(cv.model.NotificationTypes.PAGE_CHANGED, "mid");
    	}
    	this.activePageIndex--;	
    	this._cursorIndex = 0;
    	this._currentPage = this._getCurrentPage();	
    	
    },
    
    //moving toward the first commit in repo
    previousPage: function(){
    	
    	cv.utils.Logger.log("previousPage");
    	cv.utils.Logger.log("this.activePageIndex = " + this.activePageIndex);
    	cv.utils.Logger.log("this.truePageTotal = " + this.truePageTotal);
    	
    	if(this.activePageIndex < this.truePageTotal-1){
    	    
    	    this._cursorIndex = this.currentPageSize-1;
    	    this.currentPage = this._getCurrentPage();
    	    this.activePageIndex++;
    	    
    	} 
    	else if(this.activePageIndex == this.truePageTotal-1){
    		
			if(!this._containsFirst){
				
				mainView.facade.sendNotification(cv.model.CommandTypes.REQUEST_REV_DATA, 
                                                 {requestor: null, pageNum: (this.truePageTotal + 1)});
			}else{
				this.facade.sendNotification(cv.model.NotificationTypes.PAGE_CHANGED, "first");
			}
    			
    	}
    },
    
    //TODO - page size should be dynamic rather than statically fixed at large and small sizes
    resetPageSize: function(size){
    	
    	if(this.currentPageSize == this.LARGE_PAGE_LENGTH && this.activeRevisionIndex > 6){
    		this._cursorIndex += 3;
    	}else if(this.currentPageSize == this.LARGE_PAGE_LENGTH && this.activeRevisionIndex < 4){
    		this._cursorIndex = 0;
    		this.currentPageSize = size;
    	}else if(this.currentPageSize == this.SMALL_PAGE_LENGTH){
    		this._cursorIndex = 0;
    		this.currentPageSize = size;
    	}
    	this.currentPage = this._getCurrentPage();
    	this.currentPageSize = size;
    	this.activeRevisionIndex = this._getNewActiveIndex();
    },
    
    _getCurrentPage: function(){

    	var page = [];
    	for(var i=this._cursorIndex; i<this._cursorIndex+this.currentPageSize; i++){
    		
    		if(i > this._revisions.length-1)break;
    		page.push(this._revisions[i]);
    	}
        return page;
    },
    
    _addRevisionGlyphs: function(revisions){

        for(var i=0; i<revisions.length; i++){
        	
        	    //add the author color
        	    if(!this._authors[revisions[i].author]){
        	    	
        	    	if(this._colorIndex == this._colors.length-1){
     	    		    this._colorIndex = 0;
     	    	    }else{
     	    		    this._colorIndex++;
     	    	    }
        	    	this._authors[revisions[i].author] = {stroke: this._colors[this._colorIndex].stroke,
        	    			                              fill: this._colors[this._colorIndex].fill};
        	    }
        	    
        	    revisions[i].stroke = this._authors[revisions[i].author].stroke;
    	    	revisions[i].fill = this._authors[revisions[i].author].fill;
	            var revGlyph =
	                new cv.view.RevisionGlyph(revisions[i], this.viewportWidth);
	            revisions[i].glyph = revGlyph;
        }

        return revisions;
    },
   
    _getNewActiveIndex: function(){
    	
    	for(var i=0; i<this.currentPage.length; i++){
    		if(this._activeRevision == this.currentPage[i]){
    			return i;
    		}
    	}
    	return this.currentPage.length-1;
    },
    
    getCurrentEntryByName: function(name){
    	
    	for(var i=0; i<this._activeRevision.entries.length; i++){
    		
    		var entry = this._activeRevision.entries[i];
    		if(name == entry.name){
    			return entry;
    			break;
    		}
    	}
    	return null;
    }

});

cv.model.RepoDataProxy.entriesAreSimilar = function(entry1, entry2) {
	
	//TODO - play with this  - split the path and look for matching packages
	if(entry1.path == entry2.path)
	{
		return true;
	}
	else
	{
		return false;
	}
};

cv.model.RepoDataProxy.NAME = "RepoDataProxy";
cv.model.RepoDataProxy.NUM_GLYPHS_TO_SHOW = 7;


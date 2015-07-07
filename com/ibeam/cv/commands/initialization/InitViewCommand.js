/**
 * src/com/ibeam/cv/commands/initialization
 *
 * @class InitViewCommand.js - Application initialization logic divided into
 * child commands. The MacroCommand base class provides easy application
 * configuration.
 *
 * @extends MacroCommand
 *
 * @author pebanfield
 *
 * 10:37:05 AM2011
 *
 */
cv.commands.InitViewCommand = new Class({

    Extends: SimpleCommand,

    execute: function(notification){

    	var rdProxy =
            this.facade.retrieveProxy(cv.model.RepoDataProxy.NAME);
        var configProxy = 
        	this.facade.retrieveProxy(cv.model.ConfigProxy.NAME);
        
        var appMediator = 
        	this.facade.retrieveMediator(cv.view.ApplicationMediator.NAME);
        var mainView = appMediator.viewComponent;
        
        configProxy.lineColor = mainView.lineColor;
        
        //TODO - refactor - messy
        rdProxy.currentPageSize = appMediator.listControlLength;
        rdProxy.viewportWidth = configProxy.viewportWidth;
        
        if(mainView.getStage()){
            
            var background = new cv.view.Bullseye(mainView.getStage(), 1000, configProxy.lineColor);
            
            var revInfoPanel = new cv.view.RevisionInfoPanel();
            var revInfoMediator = new cv.view.RevisionInfoMediator(revInfoPanel);
            revInfoMediator.setData(rdProxy);

            var revGraph = 
            	new cv.view.RevisionGraph(mainView.getStage(), 
            			                  configProxy.viewportWidth);
            var revGraphMediator = 
            	new cv.view.RevisionGraphMediator(revGraph);
            revGraphMediator.setData(rdProxy); 
            this.facade.registerMediator(revGraphMediator);
           
            var rangeScroller = 
            	new cv.view.RangeScroller(appMediator.getRangeScrollerWidth(), configProxy.lineColor);
            var rangeScrollerMediator = 
            	new cv.view.RangeScrollerMediator(rangeScroller);
            rangeScrollerMediator.setData(rdProxy);
            this.facade.registerMediator(rangeScrollerMediator);
            
            var entryInfoPanel = 
            	new cv.view.EntryInfoPanel(configProxy.lineColor);
            var entryInfoMediator = 
            	new cv.view.EntryInfoMediator(entryInfoPanel);
            this.facade.registerMediator(entryInfoMediator);
           
        }
        else{
            $('root').appendText("Sorry - this application requires HTML5 support.");
        } 
    }
});


/**
 * src/com/ibeam/cv/commands/initialization
 *
 * @class ShowAppCommand.js - 
 *
 * @extends SimpleCommand
 *
 * @author pebanfield
 *
 * 10:37:05 AM2011
 *
 */
cv.commands.AppReadyCommand = new Class({

    Extends: SimpleCommand,

    execute: function(notification)
    {
       var appMediator = 
    	   this.facade.retrieveMediator(cv.view.ApplicationMediator.NAME);
       var mainView = appMediator.viewComponent;
       mainView.visible(true);

    }
});
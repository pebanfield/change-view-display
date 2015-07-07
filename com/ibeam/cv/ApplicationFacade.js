/**
 * src/com/ibeam/cv
 *
 * @class ApplicationFacade.js - The concrete PureMVC facade singleton. 
 *  An abstraction providing access to Model, View and Controller utilities.  
 *  
 * @extends Facade
 * 
 * @author pebanfield
 *
 * 11:05:19 AM2011
 * 
 */
cv.ApplicationFacade = new Class({

    Extends: Facade,

    initializeController: function()
    {
		this.parent();
		this.registerCommand(cv.model.CommandTypes.INITIALIZE_APP, 
				 cv.commands.InitAppCommand);
    },

    startup: function(viewComponent)
    {
    	this.sendNotification(cv.model.CommandTypes.INITIALIZE_APP, viewComponent);
    }
});

cv.ApplicationFacade.getInstance = function()
{
    if (Facade.instance == undefined)
    {
		Facade.instance = new cv.ApplicationFacade();
    }
    return Facade.instance;
};





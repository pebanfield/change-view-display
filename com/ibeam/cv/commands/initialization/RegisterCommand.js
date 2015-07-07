/**
 * src/com/ibeam/cv/commands/initialization
 *
 * @class RegisterCommand.js - 
 *  
 * @extends 
 * 
 * @author pebanfield
 *
 * 9:29:08 PM2011
 * 
 */
cv.commands.RegisterCommand = new Class({

    Extends: SimpleCommand,

    execute: function(notification)
    {
		this.facade.registerCommand(cv.model.CommandTypes.REQUEST_REV_DATA, 
			 cv.commands.RequestRevDataCommand);
		this.facade.registerCommand(cv.model.CommandTypes.APP_READY, 
				 cv.commands.AppReadyCommand);
		this.facade.registerCommand(cv.model.CommandTypes.AUTO_LOAD_CODE_STYLE, 
				 cv.commands.InitCodeViewCommand);
    }
});
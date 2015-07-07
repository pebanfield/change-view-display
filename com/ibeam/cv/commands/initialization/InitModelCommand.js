/**
 * src/com/ibeam/cv/commands/initialization
 *
 * @class InitModelCommand.js - Initializes the RepoDataProxy &
 *  utility delegate for accessing SVN Repository JSON service.
 *
 * @extends SimpleCommand
 *
 * @author pebanfield
 *
 * 10:37:05 AM2011
 *
 */
cv.commands.InitModelCommand = new Class({

    Extends: SimpleCommand,

    execute: function(notification){
        //TODO - set JSON delegate
        this.facade.registerProxy(new cv.model.RepoDataProxy());
        this.facade.registerProxy(new cv.model.ConfigProxy());
    }
});




/**
 * src/com/ibeam/cv/commands/initialization
 *
 * @class InitAppControlCommand.js - Initializes AppMediator
 * instance.
 *
 * @extends SimpleCommand
 *
 * @author pebanfield
 *
 * 10:37:05 AM2011
 *
 */
cv.commands.InitAppControlCommand = new Class({

    Extends: SimpleCommand,

    execute: function(notification)
    {
        var mainView = notification.getBody();

        var appMediator = new cv.view.ApplicationMediator(mainView);
        var keyboard = new Keyboard({
            defaultEventType: 'keyup'
        });
        appMediator.setKeyboard(keyboard);
        this.facade.registerMediator(appMediator);

    }
});


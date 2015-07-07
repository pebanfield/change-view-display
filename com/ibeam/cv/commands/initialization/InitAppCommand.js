/**
 * src/com/ibeam/cv/commands/initialization
 *
 * @class InitAppCommand.js - Application initialization logic divided into
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
cv.commands.InitAppCommand = new Class({

    Extends: MacroCommand,

    initializeMacroCommand: function()
    {
        this.addSubCommand(cv.commands.RegisterCommand);
        this.addSubCommand(cv.commands.InitModelCommand);
        this.addSubCommand(cv.commands.InitAppControlCommand);
        this.addSubCommand(cv.commands.InitViewCommand);
    }
});



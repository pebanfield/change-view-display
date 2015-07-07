/**
* @misc
* The Controller class for PureMVC
* @class A Singleton <code>Controller</code> implementation.
* <P>
* In PureMVC, the <code>Controller</code> class follows the
* 'Command and Controller' strategy, and assumes these
* responsibilities:
* <UL>
* <LI> Remembering which <code>SimpleCommand</code>s
* or <code>MacroCommand</code>s
* are intended to handle which <code>Notifications</code>.</LI>
* <LI> Registering itself as an <code>Observer</code> with
* the <code>View</code> for each <code>Notification</code>
* that it has a <code>SimpleCommand</code>
* or <code>MacroCommand</code>  mapping for.</LI>
* <LI> Creating a new instance of the proper <code>SimpleCommand</code>
* or <code>MacroCommand</code>
* to handle a given <code>Notification</code> when notified by the <code>View</code>.</LI>
* <LI> Calling the <code>SimpleCommand</code>'s
* or <code>MacroCommand</code>'s  <code>execute</code>
* method, passing in the <code>Notification</code>.</LI>
* </UL>
*
*
* @author Justin Wilaby w/ modifications pebanfield
*/

var Controller = new Class({

    view: null,
    commandMap: {},

    initialize: function(){
    	this.initializeController();
    },

    initializeController: function(){
    	this.view = View.getInstance();
    },

    executeCommand: function(note){
		var commandClassRef = this.commandMap[note.getName()];
		if (!commandClassRef)
		    return;
		var command = new commandClassRef();
		command.execute(note);
    },

    registerCommand: function(notificationName, commandClassRef){
    	if (!this.commandMap[notificationName])
    		this.view.registerObserver(notificationName, new Observer(this.executeCommand, this));
    	this.commandMap[notificationName] = commandClassRef;
    },

    hasCommand: function(notificationName){
    	return this.commandMap[notificationName] != null;
    },


    removeCommand: function(notificationName){
		if (!this.hasCommand(notificationName))
		    return;
		this.view.removeObserver(notificationName, this);
		delete this.commandMap[notificationName];
    }
});

Controller.getInstance = function() {
    if (Controller.instance == undefined)
    {
    	Controller.instance = new Controller();
    }
    return Controller.instance;
};

/**
 * @misc
 * In PureMVC, the <code>Model</code> class provides
 * access to model objects (Proxies) by named lookup.
 *
 * @class A Singleton <code>Model</code> implementation in the form
 * of a JSON object.
 * <P>
 * The <code>Model</code> assumes these responsibilities:</P>
 *
 * <UL>
 * <LI>Maintain a cache of <code>Proxy</code> instances.</LI>
 * <LI>Provide methods for registering, retrieving, and removing
 * <code>Proxy</code> instances.</LI>
 * </UL>
 *
 * <P>
 * Your application must register <code>Proxy</code> instances
 * with the <code>Model</code>. Typically, you use a
 * <code>SimpleCommand</code> to create and register <code>Proxy</code>
 * instances once the <code>Facade</code> has initialized the Core
 * actors.</p>
 *
 ** @author Justin Wilaby
 *
 */

var Model = new Class({


    initialize: function(){
    	this.initializeModel();
    },

    proxyMap: {},

    registerProxy: function(proxy){
    	this.proxyMap[proxy.getProxyName()] = proxy;
    	proxy.onRegister();
    },

    retrieveProxy: function(proxyName){
    	return this.proxyMap[proxyName];
    },

    hasProxy: function(proxyName)
    {
    	return this.proxyMap[proxyName] != null;
    },

    removeProxy: function(proxyName){
		var proxy = this.proxyMap[proxyName];
		if (proxy)
		{
		    delete this.proxyMap[proxyName];
		    proxy.onRemove();
		}
		return proxy;
    },

    initializeModel: function(){

    }
});

Model.getInstance = function(){
    if (Model.instance == undefined)
    {
    	Model.instance = new Model();
    }
    return Model.instance;
};

/**
* The View class in PureMVC.
*
* @class A Singleton <code>View</code> implementation.
* In PureMVC, the <code>View</code> class assumes these responsibilities:
* <UL>
* <LI>Maintain a cache of <code>Mediator</code> instances.</LI>
* <LI>Provide methods for registering, retrieving, and removing <code>IMediators</code>.</LI>
* <LI>Notifiying <code>Mediators</code> when they are registered or removed.</LI>
* <LI>Managing the observer lists for each <code>Notification</code> in the application.</LI>
* <LI>Providing a method for attaching <code>Observers</code> to an <code>INotification</code>'s observer list.</LI>
* <LI>Providing a method for broadcasting an <code>Notification</code>.</LI>
* <LI>Notifying the <code>Observers</code> of a given <code>Notification</code> when it broadcast.</LI>
* </UL>
*
* @author Justin Wilaby
*/

var View = new Class({

    mediatorMap: {},
    observerMap: {},

    registerObserver: function(notificationName, observer){
    	
		var observers = this.observerMap[notificationName];
		if (observers)
		    observers.push(observer);
		else
		    this.observerMap[notificationName] = [observer];
    },

    notifyObservers: function(notification){
    	
		var name = notification.getName();
		if (this.observerMap[name] == null)
		    return;
		// Copy the array
		var observers = this.observerMap[name].concat();
		var len = observers.length;
		for (var i = 0; i < len; i++)
		{
		    var observer = observers[i];
		    observer.notifyObserver(notification);
		}
    },

    removeObserver: function(notificationName, notifyContext){
    	
		var observers = this.observerMap[notificationName];
		var i = observers.length;
		while(i--)
		{
		    var observer = observers[i];
		    if (observer.compareNotifyContext(notifyContext))
		    {
			observers.splice(i, 1);
			break;
		    }
		}
		// Remove empty observer lists.
		if (!observers.length)
		    delete this.observerMap[notificationName];
    },

    registerMediator: function(mediator){
    	
		var name = mediator.getMediatorName();
		if (this.mediatorMap[name])
		    return;
		this.mediatorMap[name] = mediator;
		var interests = mediator.listNotificationInterests();
		var len = interests.length;
		if (len)
		{
		    var observer = new Observer(mediator.handleNotification, mediator);
		    for (var i = 0; i < len; i++)
			this.registerObserver(interests[i], observer);
		}
		mediator.onRegister();
    },

    retrieveMediator: function(mediatorName){
    	return this.mediatorMap[mediatorName];
    },

    removeMediator: function(mediatorName){
		var mediator = this.mediatorMap[mediatorName];
		if (mediator)
		{
		    var interests = mediator.listNotificationInterests();
		    var i = interests.length;
		    while(i--)
			this.removeObserver(interests[i], mediator);
	
		    delete this.mediatorMap[mediatorName];
		    mediator.onRemove();
		}
		return mediator;
    },

    hasMediator: function(mediatorName){
    	return this.mediatorMap[mediatorName] != null;
    }
});

View.getInstance = function(){
    if (View.instance == undefined)
    {
    	View.instance = new View();
    }
    return View.instance;
};

/**
 * @class A base <code>Notification</code> implementation.
 * 
 * <P>
 * The Observer Pattern as implemented within PureMVC exists
 * to support event-driven communication between the
 * application and the actors of the MVC triad.</P>
 *
 * @author Justin Wilaby
 *
 */

var Notification = new Class({

    name: null,
    body: null,
    type: null,
    
    initialize: function(name, body, type){
		this.name = name;
		this.body = body;
		this.type = type;
    },

    getName: function(){
    	return this.name;
    },

    setBody: function(body){
    	this.body = body;
    },

    getBody: function(){
    	return this.body;
    },

    setType: function(type){
    	this.type = type;
    },

    getType: function(){
    	return this.type;
    },

    toString: function(){
		var msg = "Notification Name: "+this.getName();
		msg += "\nBody:"+(( this.body == null )?"null":this.body.toString());
		msg += "\nType:"+(( this.type == null )?"null":this.type);
		return msg;
    }
});


/**
 * @class A base Singleton <code>Facade</code> implementation.
 * <P>
 * In PureMVC, the <code>Facade</code> class assumes these
 * responsibilities:
 * <UL>
 * <LI>Initializing the <code>Model</code>, <code>View</code>
 * and <code>Controller</code> Singletons.</LI>
 * <LI>Providing all the applicable methods of the <code>Model,
 * View, & Controller</code> singletons.</LI>
 * <LI>Providing a single point of contact to the application for
 * registering <code>Commands</code> and notifying <code>Observers</code></LI>
 * </UL>
 * <P>
 * <P>
 * This <code>Facade</code> implementation is a Singleton,
 * and cannot be instantiated directly, but instead call the static Singleton
 * Factory method <code>Facade.getInstance()</code>
 *
 * @author Justin Wilaby w/ modifications pebanfield
 * @see original port
 */
var Facade = new Class({

    view: null,
    model: null,
    controller: null,

    initialize: function(){
    	this.initializeFacade();
    },

    initializeFacade: function(){
    	this.initializeModel();
    	this.initializeController();
    	this.initializeView();
    },

    initializeModel: function(){
    	this.model = Model.getInstance();
    },

    initializeController: function(){
    	this.controller = Controller.getInstance();
    },

    initializeView: function(){
    	this.view = View.getInstance();
    },

    registerCommand: function(notificationName, commandClassRef){
    	this.controller.registerCommand(notificationName, commandClassRef);
    },

    removeCommand: function(notificationName){
    	this.controller.removeCommand(notificationName);
    },

    hasCommand: function(notificationName){
    	return this.controller.hasCommand(notificationName);
    },

    registerProxy: function(proxy){
    	this.model.registerProxy(proxy);
    },

    retrieveProxy: function(proxyName){
    	return this.model.retrieveProxy(proxyName);
    },

    removeProxy: function(proxyName){
    	this.model.removeProxy(proxyName);
    },

    hasProxy: function(proxyName){
    	return this.model.hasProxy(proxyName);
    },

    registerMediator: function(mediator){
    	this.view.registerMediator(mediator);
    },

    retrieveMediator: function(mediatorName){
    	return this.view.retrieveMediator(mediatorName);
    },

    removeMediator: function(mediatorName){
    	return this.view.removeMediator(mediatorName);
    },

    hasMediator: function(mediatorName){
    	return this.view.hasMediator(mediatorName);
    },

    sendNotification: function(notificationName, body, type){
    	this.notifyObservers(new Notification(notificationName, body, type));
    },

    notifyObservers: function(notification){
    	this.view.notifyObservers(notification);
    }
});

Facade.getInstance = function(){
    if (Facade.instance == undefined)
    {
    	Facade.instance = new Facade();
    }
    return Facade.instance;
};


/**
 * @class The Base <code>Notifier</code> implementation.
 * <P>
 * <code>MacroCommand, Command, Mediator</code> and <code>Proxy</code>
 * all have a need to send <code>Notifications</code>. <P>
 * <P>
 * The <code>Notifier</code> base class provides a common method called
 * <code>sendNotification</code> that relieves implementation code of
 * the necessity to actually construct <code>Notifications</code>.</P>
 *
 * @author Justin Wilaby
 */
var Notifier = new Class({

    facade: null,

    initialize: function(){
    	this.facade = Facade.getInstance();
    },

    sendNotification: function(notificationName, body, type){
    	this.facade.sendNotification(notificationName, body, type);
    }
});


/**
 * @class A base <code>Observer</code> implementation.
 * <P>
 * An <code>Observer</code> is an object that encapsulates information
 * about an interested object with a method that should
 * be called when a particular <code>Notification</code> is broadcast. </P>
 *
 * <P>
 * In PureMVC, the <code>Observer</code> class assumes these responsibilities:
 * <UL>
 * <LI>Encapsulate the notification (callback) method of the interested object.</LI>
 * <LI>Encapsulate the notification context (this) of the interested object.</LI>
 * <LI>Provide methods for setting the notification method and context.</LI>
 * <LI>Provide a method for notifying the interested object.</LI>
 * </UL>
 * 
 */

var Observer = new Class({

    notify: null,
    context: null,

    initialize: function(notifyMethod, notifyContext){
    	this.notify = notifyMethod;
    	this.context = notifyContext;
    },

    setNotifyMethod: function(notifyMethod){
    	this.notify = notifyMethod;
    },

    setNotifyContext: function(notifyContext){
    	this.context = notifyContext;
    },

    getNotifyMethod: function(){
    	return this.notify;
    },

    getNotifyContext: function(){
    	return this.context;
    },

    notifyObserver: function(notification){
    	this.notify.apply(this.context, [notification]);
    },

    compareNotifyContext: function(object){
    	return object === this.context;
    }
});

/**
 * @misc
 * @class A base <code>Command</code> implementation.
 * <P>
 * Your subclass should override the <code>execute</code>
 * method where your business logic will handle the <code>Notification</code>. </P>
 * @extends Notifier
 */

var SimpleCommand = new Class({
	
    Extends: Notifier,

    initialize: function(){
    	this.parent();
    },

    execute: function(notification){}
});


/**
 * @misc
 * @class A base <code>Command</code> implementation that executes other <code>Command</code>s.
 * <P>
 * A <code>MacroCommand</code> maintains an list of
 * <code>ICommand</code> Class references called <i>SubCommands</i>.</P>
 *
 * <P>
 * When <code>execute</code> is called, the <code>MacroCommand</code>
 * instantiates and calls <code>execute</code> on each of its <i>SubCommands</i> turn.
 * Each <i>SubCommand</i> will be passed a reference to the original
 * <code>INotification</code> that was passed to the <code>MacroCommand</code>'s
 * <code>execute</code> method.</P>
 *
 * <P>
 * Unlike <code>SimpleCommand</code>, your subclass
 * should not override <code>execute</code>, but instead, should
 * override the <code>initializeMacroCommand</code> method,
 * calling <code>addSubCommand</code> once for each <i>SubCommand</i>
 * to be executed.</P>
 *
 * <P>
 * @extends Notifier
 */

var MacroCommand = new Class({
	
    Extends: Notifier,

    subCommands: [],

    initialize: function(){
    	this.initializeMacroCommand();
    },

    initializeMacroCommand: function(){},

    addSubCommand:function(commandClassRef){
    	this.subCommands.push(commandClassRef);
    },

    execute: function(notification){
		var len = this.subCommands.length;
		for (var i = 0; i < len; i++)
		{
		    var commandClassRef = this.subCommands[i];
		    var commandInstance = new commandClassRef();
		    commandInstance.execute(notification);
		}
    }
});


/**
 * @class A base <code>Mediator</code> implementation.
 * <P>
 * Typically, a <code>Mediator</code> will be written to serve
 * one specific control or group controls and so,
 * will not have a need to be dynamically named.</P>
 * Typically, a <code>Mediator</code> will be written to serve
 * one specific control or group controls and so,
 * will not have a need to be dynamically named.</P>
 * @extends Notifier
 * @param {String} mediatorName the name of the Mediator.
 * @param {Object} viewComponent The <code>Mediator</code>'s view component.
 * 
 * @author Justin Wilaby
 */
var Mediator = new Class({
	
    Extends: Notifier,
    mediatorName: null,
    viewComponent: null,

    initialize: function(mediatorName, viewComponent){
		this.parent();
		this.mediatorName = mediatorName || Mediator.NAME;
		this.viewComponent = viewComponent;
    },

    listNotificationInterests: function(){
    	return [];
    },

    getMediatorName: function(){
    	return this.mediatorName;
    },

    getViewComponent: function(){
    	return this.viewComponent;
    },

    setViewComponent: function(viewComponent){
    	this.viewComponent = viewComponent;
    },

    handleNotification: function(notification){},

    onRegister: function(){},

    onRemove: function(){}
});

Mediator.NAME = "Mediator";

/**
 * @class A base <code>Proxy</code> implementation.
 * <P>
 * In PureMVC, <code>Proxy</code> classes are used to manage parts of the
 * application's data model. </P>
 *
 * <P>
 * A <code>Proxy</code> might simply manage a reference to a local data object,
 * in which case interacting with it might involve setting and
 * getting of its data in synchronous fashion.</P>
 *
 * @author Justin Wilaby
 */

var Proxy = new Class({
	
    Extends: Notifier,

    proxyName: null,
    data: null,

    initialize: function(proxyName, data){
    	
		this.parent();
		this.proxyName = proxyName || Proxy.NAME;
		this.data = data;
    },

    getProxyName: function(){
    	return this.proxyName;
    },

    setData: function(data){
    	this.data = data;
    },

    getData: function(){
    	return this.data;
    },

    onRegister: function(){},

    onRemove: function(){}
});

Proxy.NAME = "Proxy";


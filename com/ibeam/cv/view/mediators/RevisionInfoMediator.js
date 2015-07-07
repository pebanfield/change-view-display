/**
 * src/com/ibeam/cv/view/mediators
 *
 * @class RevisionInfoMediator.js - listens to data changes and
 * updates rev info panel accordingly.
 *
 * @extends
 *
 * @author pebanfield
 *
 * 12:39:16 AM2011
 *
 */
cv.view.RevisionInfoMediator = new Class({

    Extends: Mediator,
    _repoDataProxy: null,

    initialize: function(viewComponent){

        this.parent(cv.view.RevisionInfoMediator.NAME, viewComponent);
    },

    setData: function(data){

        this._repoDataProxy = data;
        this._repoDataProxy.addEvent(cv.model.EventTypes.REPO_TITLE_CHANGE,
                                    this.onRepoTitleChanged.bind(this));
        this._repoDataProxy.addEvent(cv.model.EventTypes.ACTIVE_REV_CHANGE,
                                    this.onActiveRevChanged.bind(this));
    },

    onActiveRevChanged: function(evtObj){

        this.viewComponent.update(evtObj);
    },

    onRepoTitleChanged: function(evtObj){

        this.getViewComponent().setRepoPathTitle(evtObj);
    }
});

cv.view.RevisionInfoMediator.NAME = "RevisionInfoMediator";


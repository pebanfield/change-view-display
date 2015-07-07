/**
 * src/com/ibeam/cv/model
 *
 * @class ConfigProxy.js - Stores configuration settings data. Seems pointless
 * to abstract this into a settings file as javascript requires no
 * compilation.
 *
 * @extends Proxy
 *
 * @author pebanfield
 *
 * 11:01:47 AM2011
 *
 */
cv.model.ConfigProxy = new Class({

    Extends: Proxy,

    //serviceDomain: "192.168.0.6:9089",
    serviceDomain: "localhost:9089",
    revisionsMethod: "/lichen/repodata/revisions",
    pageNum: null,
    pageSize: 7,
    viewportWidth: 1000,
    lineColor: "#000",
    requestObj: null,
    requestor: null,

    initialize: function(){
        this.parent(cv.model.ConfigProxy.NAME);
    }

});

cv.model.ConfigProxy.NAME = "ConfigProxy";





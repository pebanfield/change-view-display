/**
 * src/com/ibeam/cv/model
 *
 * @class ServiceRequestConfig.js - defines required request
 * parameters for NetRequestor.
 *
 * @extends
 *
 * @author pebanfield
 *
 * 4:35:28 PM2011
 *
 */

cv.model.ServiceRequestConfig = new Class({

    type: null,
    domain: null,
    method: null,
    repoPath: null,
    pageNum: null,
    pageSize: null,
    args: null,
    isSecure: null,
    
    getArgs: function(){
    	
    	return "repoType=" + this.type + 
    		   "&repoPath="+ this.repoPath + 
    		   "&pageNum=" + this.pageNum +
    		   "&pageSize=" + this.pageSize;
        
    }

});


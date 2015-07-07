/**
 * src/com/ibeam/cv/model/utils
 *
 * @class ServiceRequestor.js -
 *
 *
 * @author pebanfield
 *
 * 1:37:35 AM2011
 *
 */
cv.model.ServiceRequestor = new Class({

	configObj: null,
    type: null,
    domain: null,
    repoPath: null,
    httpMethod: null,
    args: null,
    pageNum: null,
    successHandler: null,
    failureHandler: null,
    _reqURL: null,
    _protocol: null,

     initialize: function(configObj){

    	 this.configObj = configObj;
         this.type = configObj.type;
         this.domain = configObj.domain;
         this.method = configObj.method;
         this.pageNum = configObj.pageNum;
         this.args = configObj.getArgs();
         this.generateUrl();
     },
     
     setPageNum: function(num){
    	 
    	 this.configObj.pageNum = num;
    	 this.args = this.configObj.getArgs();
     },
     
     generateUrl: function(){
    	 
         this.configObj.isSecure ? this._protocol = "https://" : this._protocol = "http://";
         
         /*
         if(this.configObj.fullPath){
        	 this._reqURL = this.configObj.fullPath;
         }else{
        	 this._reqURL =
                 this._protocol + this.domain + this.method;
         }
         */
         this._reqURL = this.method;
         if(this.args) this._reqURL += "?" + this.args;
     },

     send: function(){

    	 cv.utils.Logger.log("Sending service url = " + this._reqURL);
         var errorMsg = "Request Handlers must be assigned before calling send.";

         if(!this.successHandler || !this.failureHandler){
             throw new Error(errorMsg);
         }
         var requestOptions = {url: this._reqURL,
                               onSuccess: this.successHandler,
                               onFailure: this.failureHandler,
                               method: this.httpMethod};

         var jsonRequest =
                new Request.JSON(requestOptions).send();
     },

     setMethod: function(method){
         this.httpMethod = method;
     }

});


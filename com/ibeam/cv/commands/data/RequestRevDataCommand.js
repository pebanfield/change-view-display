/**
 * src/com/ibeam/cv/commands/data
 *
 * @class RequestRevDataCommand.js - Performs a JSON request on a remote
 * restful service. Both GITHUB and Lichen SVN service types are supported.
 * This command handles request success and failure and updates appropriate
 * proxy objects. Two separate request utility classes encapsulate request
 * signature differences.
 *
 * @extends SimpleCommand
 *
 * @author pebanfield
 *
 * 1:41:50 PM2011
 *
 */

cv.commands.RequestRevDataCommand = new Class({

    Extends: SimpleCommand,

    execute: function(notification){

        var configProxy = this.facade.retrieveProxy(cv.model.ConfigProxy.NAME);
        var repoDataProxy = this.facade.retrieveProxy(cv.model.RepoDataProxy.NAME);

        repoDataProxy.activeRevisionIndex = -1;
        
        var noteObj = notification.getBody();
        
        if(notification.getBody().requestor){
        	
        	 configProxy.requestor = notification.getBody().requestor;
             repoDataProxy.cvsType = configProxy.requestor.type;
             configProxy.requestor.setMethod('GET');
        }
        
        if(notification.getBody().pageNum != undefined){
        	configProxy.requestor.setPageNum(notification.getBody().pageNum);
        	configProxy.requestor.generateUrl();
        }
        configProxy.requestor.successHandler = this.successHandler;
        configProxy.requestor.failureHandler = this.failureHandler;

        try {
        	configProxy.requestor.send();
        }catch(e){
            cv.utils.Logger.log(e.message);
        }
    },

    successHandler:function(result){

         var rdProxy = mainView.facade.retrieveProxy(cv.model.RepoDataProxy.NAME);
         
         rdProxy.repoLocation = result.repoLocation;
         rdProxy.setRepoRootPath(result.repoRootPath);
         var isLatest = result.isLatest;
         var isFirst = result.isFirst;
         rdProxy.addPage(cv.model.DataParser.parseRevisions(result), isLatest, isFirst);

        /* if(rdProxy.cvsType == VCSTypes.SVN){
             rdProxy.setRevisions(SVNDataParser.parseRevisions(result));
         }
         else if(rdProxy.cvsType == VCSTypes.GIT){
             rdProxy.setRevisions(GitDataParser.parseCommits(result));
             this.facade.sendNotification(CommandTypes.REQUEST_ENTRY_DATA,
                                          this.$requestor);
         }
*/
         //rdProxy.setActiveRevision(rdProxy.getRevisions().length-1);
    },

    failureHandler:function(result){
        cv.utils.Logger.log("JSON Request failed = " + result);
    }


});


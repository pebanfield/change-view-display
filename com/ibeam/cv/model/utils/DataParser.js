/**
 * src/com/ibeam/cv/model/utils
 *
 * @class DataParser.js -
 *
 * @extends
 *
 * @author pebanfield
 *
 * 3:26:50 PM2011
 *
 */
cv.model.DataParser = new Class({

});

cv.model.DataParser.parseRevisions = function(revData){

    var revisions = [];
    for(var i=0; i<revData.revisions.length; i++) {

        var revObj = revData.revisions[i];
        var revision = new cv.model.Revision();
        revision.vcs = cv.model.VCSTypes.GIT;
        revision.identifier = revObj.revision;
        revision.annotation = revObj.annotation;
        revision.dateStr = revObj.date;
        revision.commitTime = revObj.commitTime;
        revision.author = revObj.author;
        revision.entries = [];
        
        //handle merges with no commits
        if(revObj.entries.length == 0){
        	var entry = new cv.model.Entry();
            entry.size = 0;
            entry.significance = 0;
            entry.name = "Git merge";
            revision.entries.push(entry);
        }

        for(var j=0; j<revObj.entries.length; j++) {

            var entryObj = revObj.entries[j];
            var entry = new cv.model.Entry();
            entry.revision = entryObj.revision;
            entry.path = entryObj.path;
            entry.name = entryObj.name;
            entry.size = entryObj.size;
            entry.significance = entryObj.significance;
            entry.status = entryObj.status;
            entry.author = entryObj.author;
            entry.type = entryObj.type;
            entry.kind = entryObj.kind;
            entry.uuid = entryObj.uuid;
            entry.patch = entryObj.patch;
            entry.raw_url = entryObj.raw_url;
            entry.commit_date = entryObj.commit_date;
            entry.commit_time = entryObj.commit_time;
            entry.commit_revision = entryObj.commit_revision;
            entry.sizeHistory = entryObj.sizeHistory;
            entry.authorHistory = entryObj.authorHistory;
            entry.pathHistory = entryObj.pathHistory;
            entry.updateTimeHistory = entryObj.updateTimeHistory;
            entry.revisionHistory = entryObj.revisionHistory;
            entry.uuidHistory = entryObj.uuidHistory;
            revision.entries.push(entry);
        }

        revisions.push(revision);
    }
    revisions.reverse();
    return revisions;
};

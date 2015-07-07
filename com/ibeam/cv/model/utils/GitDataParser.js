/**
 * src/com/ibeam/gitview/model/utils
 *
 * @class GitDataParser.js - Parses data from Git for conversion into
 * client model objects.
 *
 * @extends
 *
 * @author pebanfield
 *
 * 3:26:50 PM2011
 *
 */
cv.model.GitDataParser = new Class({

});

cv.model.GitDataParser.parseCommits = function(commitData){

    cv.utils.Logger.log("commitData " + commitData.length);
    var revisions = [];
    for(var i=0; i<commitData.length; i++) {

        var revision = new cv.model.Revision();
        revision.vcs = cv.model.VCSTypes.GIT;
        revision.author = commitData[i].author.name;
        revision.dateStr = commitData[i].committer.date;
        revision.identifier = commitData[i].sha;
        revision.annotation = commitData[i].message;
        revision.treeURL = commitData[i].tree.url;
        revisions.push(revision);
    }
    return revisions;
};

cv.model.GitDataParser.parseTrees = function(treeData){

    var entries = [];
    for(var i=0; i<treeData.tree.length; i++) {

        var entry = new cv.model.Entry();
        entry.path = treeData.tree[i].path;
        entry.kind =
            treeData.tree[i].type = "blob" ? cv.model.EntityTypes.FILE : cv.model.EntityTypes.DIRECTORY;
        entry.size = treeData.tree[i].size;
        entries.push(entry);
    }
    return entries;
};

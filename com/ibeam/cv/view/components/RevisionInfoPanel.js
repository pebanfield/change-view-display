/**
 * src/com/ibeam/cv/view/components
 *
 * @class RevisionInfoPanel.js - View component providing Slick
 * access to revision info panel page elements.
 *
 * @extends
 *
 * @author pebanfield
 *
 * 8:56:20 PM2011
 *
 */
cv.view.RevisionInfoPanel = new Class({
	
    initialize: function(){

    },

    setRepoPathTitle: function(title){

        title = title.toUpperCase();
        //$("repoTitle").appendText(title);
    },

    update: function(revision){

    	try{
    		$("annotation").set('text','"' + revision.annotation + '"');
            $("identifier").set('text',revision.identifier);
            $("entriesNum").set('text',revision.entries.length);
            $("author").set('text',revision.author);
           // var dayStr = cv.utils.DateParser.getGregorianDay(revision.dateStr);
           // var monthStr = cv.utils.DateParser.getGregorianMonth(revision.dateStr);
            var timeObj = cv.utils.DateParser.parse(revision.dateStr);
           // var dateStr = dayStr + " " + monthStr + " " + timeObj.day + " " + timeObj.year + " - " + timeObj.time;
            $("time").set('html',"&nbsp;" + timeObj.time + "&nbsp;");
    	}catch(e){
    		cv.utils.Logger.log("RevInfoPanel : " + e);
    	}
        
    }

});


/**
 * src/com/ibeam/cv/view/components/glyphs
 *
 * @class GlyphRenderer.js - Determines the position of the the
 * entry glyphs according to weighting rules. The positions are 
 * set as positions on an analog clock and use geometric
 * angles. 
 *
 * @extends
 *
 * @author pebanfield
 *
 * 10:18:50 AM2011
 *
 */
cv.view.GlyphRenderer = new Class({});

cv.view.GlyphRenderer.sortEntries = function(entries, rings){
	
	if(entries == null || entries.length < 1){
		cv.utils.Logger.log("Error : null entries object"); 
		return;
	}else{
		cv.utils.Logger.log("entries.length = " + entries.length);
	}
	
	var topsignificance = entries[0].significance;

	var CENTER_TOTAL = 3; //3 * 120 degrees
	var FIRST_RING_TOTAL = 9; //12 * 30 degrees
	var SECOND_RING_TOTAL = 6; //24 * 15 degrees
	var ENTRY_DISPLAY_MAX = CENTER_TOTAL + FIRST_RING_TOTAL + SECOND_RING_TOTAL;
	
	//3 * 120 degrees
    var centerThreshold = topsignificance / CENTER_TOTAL;
    //12 * 30 degrees
    var firstThreshold = topsignificance / FIRST_RING_TOTAL;
    //24 * 15 degrees
    var secondThreshold = topsignificance / SECOND_RING_TOTAL;

    var length;
    if(entries.length > ENTRY_DISPLAY_MAX){
    	length = ENTRY_DISPLAY_MAX;
    }else{
    	length = entries.length;
    }
    for (var i=0; i<length; i++){
    	
	    var ring;
	    var entry = entries[i];
	    
	    if(entry.significance >= centerThreshold && rings["CENTER_RING"].entries.length < CENTER_TOTAL)
	    {
		    ring = rings["CENTER_RING"];
	    }
	    else if(entry.significance >= firstThreshold && rings["FIRST_RING"].entries.length < FIRST_RING_TOTAL)
	    {
		    ring = rings["FIRST_RING"];
	    }
	    else if(entry.significance >= secondThreshold && rings["SECOND_RING"].entries.length < SECOND_RING_TOTAL)
	    {
		    ring = rings["SECOND_RING"];
	    }
	    else
	    {
		    ring = rings["THIRD_RING"];
	    }	
	    ring.entries.push(entry);
	    
	    alphabetizePath = function(a, b){
	    	
	    	if(a.path == b.path){
	    		return 0;
	    	}else{
	    		return (a.path < b.path) ? -1 : 1;
	    	}
	    };
	    
	    ring.entries.sort(alphabetizePath);
    }

};

cv.view.GlyphRenderer.setCenterAngles = function(entries, firstRingEntries, ring){
	
	if(ring.entries.length == 2){
		if(firstRingEntries > 1){
			if(cv.model.RepoDataProxy.entriesAreSimilar(entries[0], entries[1])){
			
				if(cv.model.RepoDataProxy.entriesAreSimilar(firstRingEntries[0], firstRingEntries[firstRingEntries.length-1])){
					//8 & 12
					ring.entries[0].angle = cv.model.AnalogPositions.TWELVE_O_CLOCK;
					ring.entries[1].angle = cv.model.AnalogPositions.EIGHT_O_CLOCK;
					return cv.view.GlyphRenderer.TWELVE_AND_EIGHT;
				}else{
					//12 & 4
					ring.entries[0].angle = cv.model.AnalogPositions.TWELVE_O_CLOCK;
					ring.entries[1].angle = cv.model.AnalogPositions.FOUR_O_CLOCK;
					return cv.view.GlyphRenderer.TWELVE_AND_FOUR;
				}
			}else{
				//9 & 3
				ring.entries[0].angle = cv.model.AnalogPositions.NINE_O_CLOCK;
				ring.entries[1].angle = cv.model.AnalogPositions.THREE_O_CLOCK;
				return cv.view.GlyphRenderer.NINE_AND_THREE;
			}
			//one or less entries in next outer ring
		}else{
			//12 & 4
			ring.entries[0].angle = cv.model.AnalogPositions.TWELVE_O_CLOCK;
			ring.entries[1].angle = cv.model.AnalogPositions.FOUR_O_CLOCK;
			return cv.view.GlyphRenderer.TWELVE_AND_FOUR;
		}
		
	}else{
		//place 3 entries at 4,8, and 12
		ring.entries[0].angle = cv.model.AnalogPositions.FOUR_O_CLOCK;
		ring.entries[1].angle = cv.model.AnalogPositions.EIGHT_O_CLOCK;
		ring.entries[2].angle = cv.model.AnalogPositions.TWELVE_O_CLOCK;
		return cv.view.GlyphRenderer.ALL_THREE;
	}

};

cv.view.GlyphRenderer.setFirstRingAngles = function(entries, centerRingEntries, ring, centerPositionType){
	
	var positionOrderFrom1 = [cv.model.AnalogPositions.ONE_O_CLOCK,
	                          cv.model.AnalogPositions.TWO_O_CLOCK,
	                          cv.model.AnalogPositions.THREE_O_CLOCK,
	                          cv.model.AnalogPositions.EIGHT_O_CLOCK,
	                          cv.model.AnalogPositions.NINE_O_CLOCK,
	                          cv.model.AnalogPositions.ELEVEN_O_CLOCK,
	                          cv.model.AnalogPositions.TEN_O_CLOCK,
	                          cv.model.AnalogPositions.TWELVE_O_CLOCK,
	                          cv.model.AnalogPositions.FOUR_O_CLOCK];
	
	var positionOrderFrom11 = [cv.model.AnalogPositions.ELEVEN_O_CLOCK,
	                          cv.model.AnalogPositions.TEN_O_CLOCK,
	                          cv.model.AnalogPositions.NINE_O_CLOCK,
	                          cv.model.AnalogPositions.FOUR_O_CLOCK,
	                          cv.model.AnalogPositions.ONE_O_CLOCK,
	                          cv.model.AnalogPositions.TWO_O_CLOCK,
	                          cv.model.AnalogPositions.THREE_O_CLOCK,
	                          cv.model.AnalogPositions.TWELVE_O_CLOCK,
	                          cv.model.AnalogPositions.EIGHT_O_CLOCK];
	
	if(entries.length > 0){
		var isSimilar = cv.model.RepoDataProxy.entriesAreSimilar(entries[0], centerRingEntries[0]);
	}
		
	if(centerPositionType == cv.view.GlyphRenderer.SINGLE_CENTER){
		
		cv.view.GlyphRenderer.setAnglesPerOrder(positionOrderFrom1, ring);
	}
	else if(centerPositionType == cv.view.GlyphRenderer.NINE_AND_THREE){
		
		cv.view.GlyphRenderer.setAnglesPerOrder(positionOrderFrom11, ring);
	}
	else if(centerPositionType == cv.view.GlyphRenderer.TWELVE_AND_EIGHT && isSimilar){
		
		cv.view.GlyphRenderer.setAnglesPerOrder(positionOrderFrom1, ring);
	}
	else if(centerPositionType == cv.view.GlyphRenderer.TWELVE_AND_EIGHT && !isSimilar){
		
		cv.view.GlyphRenderer.setAnglesPerOrder(positionOrderFrom1, ring);
	}
	else if(centerPositionType == cv.view.GlyphRenderer.TWELVE_AND_FOUR && isSimilar){
		
		cv.view.GlyphRenderer.setAnglesPerOrder(positionOrderFrom1, ring);
	}
	else if(centerPositionType == cv.view.GlyphRenderer.TWELVE_AND_FOUR && !isSimilar){
		
		cv.view.GlyphRenderer.setAnglesPerOrder(positionOrderFrom11, ring);
	}
	else if(centerPositionType == cv.view.GlyphRenderer.ALL_THREE){
		
		cv.view.GlyphRenderer.setAnglesPerOrder(positionOrderFrom1, ring);
	}
};

cv.view.GlyphRenderer.setAnglesPerOrder = function(orderArray, ring){
	
	for(var j in ring.entries){
		ring.entries[j].angle = orderArray[j];
	}
};

cv.view.GlyphRenderer.setOuterRingAngles = function(ring){
	
	var positionOrderFrom1 = [cv.model.AnalogPositions.TEN_O_CLOCK,
	                          cv.model.AnalogPositions.NINE_O_CLOCK,
	                          cv.model.AnalogPositions.EIGHT_O_CLOCK,
	                          cv.model.AnalogPositions.TWO_O_CLOCK,
	                          cv.model.AnalogPositions.THREE_O_CLOCK,
	                          cv.model.AnalogPositions.FOUR_O_CLOCK];
	
	cv.view.GlyphRenderer.setAnglesPerOrder(positionOrderFrom1, ring);
};

cv.view.GlyphRenderer.SINGLE_CENTER = "singleCenter";
cv.view.GlyphRenderer.NINE_AND_THREE = "nineAndThree";
cv.view.GlyphRenderer.TWELVE_AND_FOUR = "twelveAndFour";
cv.view.GlyphRenderer.TWELVE_AND_EIGHT = "twelveAndEight";
cv.view.GlyphRenderer.ALL_THREE = "allThree";


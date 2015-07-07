/**
 * src/com/ibeam/cv/utils
 *
 * @class Translate.js - coordinate manipulation util.
 *
 * @extends
 *
 * @author pebanfield
 *
 *
 */
cv.utils.Translate = new Class({});

cv.utils.Translate.localToGlobal = function(x, y){

   var stageX = Window.getSize().x/2;
   var stageY = Window.getSize().y/2;
    	
   x += stageX;
   y += stageY;
    	
   return {x: x, y: y};
    
};
    
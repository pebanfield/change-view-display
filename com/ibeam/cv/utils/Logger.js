/**
 * src/com/ibeam/cv/utils
 *
 * @class Logger.js -
 *
 * @extends
 *
 * @author pebanfield
 *
 * 11:42:07 PM2011
 *
 */
cv.utils.Logger = new Class({});

cv.utils.Logger.log = function(msg){
    if (window.console) {
        console.log(msg);
    }
};
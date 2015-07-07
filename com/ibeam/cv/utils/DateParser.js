/**
 * src/com/ibeam/cv/utils
 *
 * @class DateParser.js - parses date string format from github.
 *
 * @extends
 *
 * @author pebanfield
 *
 *
 */
cv.utils.DateParser = new Class({});

cv.utils.DateParser.parse = function(dateStr){
    
	var dateArray = dateStr.split("T");
	
	var ymd = dateArray[0];
	var ymdArray = ymd.split("-");
	var year = ymdArray[0];
	var month = ymdArray[1];
	var day = ymdArray[2];
	
	var time = dateArray[1].split("-")[0];
	
	return {ymd: ymd, year: year, month: month, day: day, time: time};
};

cv.utils.DateParser.getGregorianDay = function(dateStr){
	
	var dateObj = cv.utils.DateParser.parse(dateStr);
	
	var date = new Date();
	date.setFullYear(Number(dateObj.year));
	date.setMonth(Number(dateObj.month-1));
	date.setDate(Number(dateObj.day));
	
	var week = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
	
	return week[date.getDay()];
};

cv.utils.DateParser.getGregorianMonth = function(dateStr){
	
	var dateObj = cv.utils.DateParser.parse(dateStr);
	
	var date = new Date();
	date.setFullYear(Number(dateObj.year));
	date.setMonth(Number(dateObj.month-1));
	date.setDate(Number(dateObj.day));
	
	var monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var index = Number(date.getMonth());

	return monthArray[index];
};

cv.utils.DateParser.dateIsDifferent = function(dateStr1, dateStr2){
	
	try{
	    var dateObj1 = cv.utils.DateParser.parse(dateStr1);
	    var dateObj2 = cv.utils.DateParser.parse(dateStr2);
	}catch(e){
		return true;
	}
	
	if(dateObj1.year != dateObj2.year){
		return true;
	}
	else if(dateObj1.month != dateObj2.month){
		return true;
	}
	else if(dateObj1.day != dateObj2.day){
		return true;
	}
	else{
		return false;
	}
};




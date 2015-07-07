/**
 * src/com/ibeam/cv/utils
 *
 * @class CodeStyleMap.js - Returns a code highlight css sytle name based on the supplied
 * file extension.
 *
 * @extends
 *
 * @author pebanfield
 *
 *
 */
cv.utils.CodeStyleMap = new Class({
	
	styleMap: [],
	resourceMap: [],
	
	initialize: function(){
		
		this.styleMap['scpt'] = {name:'applescript', resource:'shBrushAppleScript.js'};
		this.styleMap['as'] = {name:'actionscript3', resource:'shBrushAS3.js'};
		this.styleMap['sh'] = {name:'bash', resource:'shBrushBash.js'};
		this.styleMap['cfm'] = {name:'coldfusion', resource:'shBrushColdFusion.js'};
		this.styleMap['cpp'] = {name:'cpp', resource:'shBrushCpp.js'};
		this.styleMap['cs'] = {name:'c#', resource:'shBrushCSharp.js'};
		this.styleMap['css'] = {name:'css', resource:'shBrushCss.js'};
		this.styleMap['pas'] = {name:'delphi', resource:'shBrushDelphi.js'};
		this.styleMap['diff'] = {name:'diff', resource:'shBrushDiff.js'};
		this.styleMap['erl'] = {name:'erl', resource:'shBrushErlang.js'};
		this.styleMap['groovy'] = {name:'groovy', resource:'shBrushGroovy.js'};
		this.styleMap['java'] = {name:'java', resource:'shBrushJava.js'};
		this.styleMap['jfx'] = {name:'jfx', resource:'shBrushJavaFX.js'};
		this.styleMap['js'] = {name:'js', resource:'shBrushJScript.js'};
		this.styleMap['perl'] = {name:'pl', resource:'shBrushPerl.js'};
		this.styleMap['php'] = {name:'php', resource:'shBrushPhp.js'};
		this.styleMap['txt'] = {name:'text', resource:'shBrushPlain.js'};
		this.styleMap['py'] = {name:'py', resource:'shBrushPython.js'};
		this.styleMap['rb'] = {name:'ruby', resource:'shBrushRuby.js'};
		this.styleMap['scl'] = {name:'scala', resource:'shBrushScala.js'};
		this.styleMap['sql'] = {name:'sql', resource:'shBrushSql.js'};
		this.styleMap['vb'] = {name:'vb', resource:'shBrushVb.js'};
		this.styleMap['xml'] = {name:'xml', resource:'shBrushXml.js'};
		
	},
	
	getStyleByExtension: function(extension){
		
		try{
			return this.styleMap[extension].name;
		}catch(e){
			return 'text';
		}
		
	},
	
	getResourceByExtension: function(extension){
		
		try{
			return this.styleMap[extension].resource;
		}catch(e){
			return 'shBrushPlain.js';
		}
	}
	
});
	
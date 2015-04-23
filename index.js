/*
Wakanda Software (the "Software") and the corresponding source code remain
the exclusive property of 4D and/or its licensors and are protected by national
and/or international legislations.
This file is part of the source code of the Software provided under the relevant
Wakanda License Agreement available on http://www.wakanda.org/license whose compliance
constitutes a prerequisite to any use of this file and more generally of the
Software and the corresponding source code.
*/

var actions;

actions = {};

function getAndSelectCurrentLine()
{
	var selectedText = studio.currentEditor.getSelectedText();
	if (selectedText == "")
	{
		var selObj = studio.currentEditor.getSelectionInfo();
		var lastlineoff = selObj.lastLineOffset;
		var off = selObj.offsetFromStartOfText;
		if (lastlineoff > 0)
		{
			studio.currentEditor.selectFromStartOfText(off-lastlineoff, lastlineoff);
			selectedText = studio.currentEditor.getSelectedText();
		}
	}
	return selectedText;
}

function nextWord(s, additionnalChar)
{
	additionnalChar = additionnalChar || 'a';
	var len = s.length;
	for (var i = 0; i < len; ++i)
	{
		var c = s[i];
		if (!( (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') 
			|| c == '_' || c == '$' || c == additionnalChar))
			return s.substr(0, i);
		
	}
	return s;
}

actions.newDataClass = function newDataClass(message) {
	var selectedText = getAndSelectCurrentLine();
	if (selectedText == "")
		selectedText = "DataClass";
	var classname = selectedText;
	studio.extension.setPref("lastClassName", classname);
	var colname = classname+"Collection";
	var text = 'model.'+classname+' = new DataClass("'+ colname + '");';
	studio.currentEditor.insertText(text);
};

actions.newAttribute = function newAttribute(message, isaKey) {
	isaKey = isaKey || false;
	
	var typestr, keyauto;
	
	if (isaKey)
	{
		typestr = "long";
		keyauto = ', "key auto"';
	}
	else
	{
		typestr = "string";
		keyauto = "";
	}
		
	var selectedText = getAndSelectCurrentLine();
	if (selectedText == "")
	{
		if (isaKey)
			selectedText = "ID";
		else
			selectedText = "att";
	}
	
	var classname = null;
	var content = studio.currentEditor.getContent().substr(0, studio.currentEditor.getSelectionInfo().offsetFromStartOfText);
	var arr = content.split("model.");
	if (arr.length > 1)
	{
		var s = arr[arr.length-1];
		var word = nextWord(s);
		if (word != "")
			classname = word;
	}
	
	if (classname == null)
	{
		classname = studio.extension.getPref("lastClassName");
		if (classname == null || classname == "")
			classname = "DataClass";
	}
		
	var attname = selectedText;
	var arr = selectedText.split(",");
	if (arr.length > 1)
	{
		attname = arr[0];
		var typ = arr[1].toLowerCase();
		var types = {
			long: "long",
			l: "long",
			date: "date",
			d: "date",
			text: "string",
			str: "string",
			s: "string",
			string: "string",
			n: "number",
			number: "number",
			uuid: "UUID",
			u: "UUID",
			short: "short",
			byte: "byte",
			bool: "bool",
			b: "bool",
		}
		var typ = types[typ];
		if (typ != null)
			typestr = typ;
	}
	
	studio.extension.setPref("lastAttributeName", attname);
	
	var text = 'model.'+classname+'.'+attname+' = new Attribute("storage","'+typestr+'"'+keyauto+');';
	studio.currentEditor.insertText(text);
	
	/*
	if (selectedText === '') {
		var sel = studio.currentEditor.getSelectionInfo();
		studio.currentEditor.setCaretPosition(sel.offsetFromStartOfText - 6);
	}
	*/
};

actions.newKeyAttribute = function newAttribute(message) {
	actions.newAttribute(message, true);
};


function generateMethodText(applyTo)
{
	var selectedText = getAndSelectCurrentLine();
	if (selectedText == "")
		selectedText = "myMethod";
	
	var classname = null;
	var content = studio.currentEditor.getContent().substr(0, studio.currentEditor.getSelectionInfo().offsetFromStartOfText);
	var arr = content.split("model.");
	if (arr.length > 1)
	{
		var s = arr[arr.length-1];
		var word = nextWord(s);
		if (word != "")
			classname = word;
	}
	
	if (classname == null)
	{
		classname = studio.extension.getPref("lastClassName");
		if (classname == null || classname == "")
			classname = "DataClass";
	}
		
	var methodname = selectedText;
	var text = 'model.'+classname+'.'+applyTo+'.'+methodname+' = function() {\n\n}';
	return text;
}

actions.newFunction = function newFunction(message) {
	var text = generateMethodText("methods")+';';
	studio.currentEditor.insertText(text);
}

actions.newPublicFunction = function newPublicFunction(message) {
	var text = '('+generateMethodText("methods")+').scope="public";';
	studio.currentEditor.insertText(text);
}

actions.newEntityFunction = function newFunction(message) {
	var text = generateMethodText("entityMethods")+';';
	studio.currentEditor.insertText(text);
}

actions.newPublicEntityFunction = function newPublicFunction(message) {
	var text = '('+generateMethodText("entityMethods")+').scope="public";';
	studio.currentEditor.insertText(text);
}

actions.newEvent = function newEvent(message) {
	var selectedText = getAndSelectCurrentLine();
	if (selectedText != "")
	{
		var events = { 
			onget: "onGet", 
			onset: "onSet",
			onsave: "onSave",
			onvalidate: "onValidate",
			onrestrictingquery: "onRestrictingQuery",
			onrestrict: "onRestrictingQuery",
			onrestricting: "onRestrictingQuery",
			onload: "onLoad",
			oninit: "onInit",
			onremove: "onRemove",
			get: "onGet", 
			set: "onSet",
			save: "onSave",
			validate: "onValidate",
			restrictingquery: "onRestrictingQuery",
			restrict: "onRestrictingQuery",
			restricting: "onRestrictingQuery",
			load: "onLoad",
			init: "onInit",
			remove: "onRemove"
		}
		selectedText = events[selectedText.toLowerCase()];
	}
	if (selectedText != null && selectedText != "")
	{
		var classname = null;
		var content = studio.currentEditor.getContent().substr(0, studio.currentEditor.getSelectionInfo().offsetFromStartOfText);
		var arr = content.split("model.");
		if (arr.length > 1)
		{
			var s = arr[arr.length-1];
			var word = nextWord(s, '.');
			if (word != "")
				classname = word;
		}
		
		if (classname != null)
		{
			var extra ="";
			var arr = classname.split('.');
			if (arr.length > 0)
			{
				var attname = arr[1];
				if (attname == 'events' || attname == 'methods' || attname == 'entityMethods' || attname == 'collectionMethods' )
					classname = arr[0];
				else
					extra = "attributeName";
			}
			var text = 'model.'+classname+'.events.'+selectedText+' = function('+extra+') {\n\n}';
			studio.currentEditor.insertText(text);
		}
			
	}

};

//point d'entree unique de l'extension 
exports.handleMessage = function handleMessage(message) {

	var
		actionName;
	
	actionName = message.action;
	
	if (!actions.hasOwnProperty(actionName)) {
		studio.alert("I don't know about this message: " + actionName);
		return false;
	}
	
	//if (message.event === "fromSender") {
		actions[actionName](message);
	//}
}


//Daimofuu form lib by Atomtech since 2023 - 2025
//
//Utilities
let versionDF = [1,0,28,2025];
function getVersion(){
	return versionDF.join(".");
}


									//Used for the Integrated File Uploader
let FILEUPLOAD_SERVER = undefined; //Address to where files are upload
let FILEGET_SERVER = undefined; //Address to where to get the uploaded resources
let FILEREMOVE_SERVER = undefined; //Address where the remove file is handled


try{
	if(_ == null){
	function _(ghf){
		return document.getElementById(ghf);
	}

	}
}catch(e){
		
function _(ghf){
		return document.getElementById(ghf);
	}	
		
}

//element maker

function make(elm){
	return document.createElement(elm);
};


function cloneSafe(value) {
    const deepClone = (value) => {
        if (value === null || typeof value !== 'object') {
            return value;
        }

        if (typeof value === 'function') {
            return value;
        }

        if (Array.isArray(value)) {
            return value.map(deepClone);
        }

        return { ...value, ...Object.fromEntries(Object.entries(value).map(([key, val]) => [key, deepClone(val)])) };
    };

    return deepClone(value);
}



//Info Form Events (assigned function called for this events)
let MAX_EVENTTRIGGER = undefined;
let INPUT_VALIDATION_FALSE_EVENT = undefined;

var selectedInputIndex = 0;
var formMode = undefined;

if(typeof(IGNORE_REQ_CHECKING) == "undefined"){
	IGNORE_REQ_CHECKING = false;
}

let SHOW_PAGE_COUNTER = true; //Should Page counter be generated on form views

let formDatas = {
	//this are dummy form data,
	forms: [
		{'type': "header", value: "Header text"},
		
		{ "type": "text", "value": "", "label": "Label text", "fancy": true},


	],
	
	groups: [],

};

let formDataJSON = {};


let formIdCollections = [];

function genId(srt){
	srt = srt.replace(/[^a-zA-Z0-9 ]/g, "");
	srt = srt.split(" ").join("_");
	return srt.toLowerCase();
};



let eventsPreLoader = [];


const formMaker = {
	
	//Generate forms editable
	makeForm: function(type,attributes = {},readonly=false,editor=true,showAc=false,inputOnly=false){
		
		if(!type){
			type = "text";
		}
		
		let formElement;
			formElement = make("div");
			formElement.classList.add("df_form_con");
		let formElementLabel;
			formElementLabel = make("label");
			formElementLabel.classList.add("df_label_con");
		
		
			if(attributes.description){
			let formDesc = make("div");
				formDesc.classList.add("small","input_description_","primary_color_faded")
				formDesc.innerText = attributes.description;
				formElement.appendChild(formDesc);	
			}
		
		
		let formInput;
		
		if(type == "text"){
			formInput = make("input");
			formInput.type = "text";		
			
			
		}else if(type == "number"){
			formInput = make("input");
			formInput.type = "number";		
			
		}else if(type == "range" || type == "slider"){
			formInput = make("input");
			formInput.type = "range";	
			
			
		}else if(type == "textarea"){
			formInput = make("textarea");		
			
				
		}else if(type == "date"){
			formInput = make("input");
			formInput.type = "date";			
			
				
		}else if(type == "select"){
			formInput = make("select");
			formInput.type = "select";			
			
			if(readonly){
				formInput.disabled = true;
			}
		
				
		}else if(type == "checkboxes"){
			formInput = make("input");
			formInput.type = "hidden";

			if(attributes.required){
				formElementLabel.classList.add("required_custom");			
			}
							
		}else if(type == "map"){
			formInput = make("input");
			formInput.type = "text";
			

			
		}else if(type == "table"){
			formInput = make("input");
			formInput.type = "hidden";			
			
			if(attributes.required){
				formElementLabel.classList.add("required_custom");			
			}
				
		}else if(type == "header"){
			formInput = make("input");
			formInput.type = "text";	
			formInput.classList.add("header_input", "medium", "primary_background", "primary_color");	
			formInput.setAttribute("readonly",'');	
			
		}else if(type == "file"){
			formInput = make("input");
			formInput.type = "hidden";	
			// formInput.classList.add("header_input", "medium", "primary_background", "primary_color");	
			// formInput.setAttribute("readonly",'');	
			
			if(attributes.required){
				formElementLabel.classList.add("required_custom");			
			}
			
		}
		
		
		// Setting attributes for the form if defined on the attr. object
		
		if(attributes.id != undefined){

			formInput.setAttribute("id", attributes.id);
			formElement.setAttribute("onclick","selectFormIndex("+attributes.index+")");
			
		};
		if(attributes.label){
			formElementLabel.setAttribute('for', attributes.id);
			formElementLabel.innerText = attributes.label;
			
			if(attributes.required == true){
				formElementLabel.classList.add("required_style_label");
			}
			
		};
		
		
		if(attributes.row_span != undefined || attributes.row_span > 0){	
			formElement.style.gridRow = "span "+ attributes.row_span;
		}		
		if(attributes.col_span != undefined && attributes.col_span > 0){	
			// formElement.style.gridColumn = "span "+ attributes.col_span;
			formElement.classList.add("colspan_"+attributes.col_span);
		}
		
		if(attributes.span_column != undefined && attributes.span_column == true){
			formElement.classList.add("full_col_span");
		}
		

		
		if(attributes.list){
			if(type == 'select'){
				try{
					let src_list = _(attributes.list).innerHTML;
					formInput.innerHTML = src_list;
				}catch(e){
					console.warn("An error occured setting options for: ", attributes, e);
				}
			}else{
				formInput.setAttribute("list", attributes.list);
			}
		};		
		
		if(attributes.items){
			if(type == 'select'){
				try{
					for(each of attributes.items){
						let opt = make("option");
						opt.innerHTML = each;
						opt.value = each;
						formInput.appendChild(opt);
						
					}
				}catch(e){
					console.warn("An error occured setting options for: ", attributes, e);
				}
			}else{
				formInput.setAttribute("list", attributes.list);
			}
		};	
		
		if(attributes.config){
			if(type == 'checkboxes'){
				try{
					
					let choiceBoxes = make("div");
					choiceBoxes.setAttribute('id',"group_"+attributes.id+'_');
					choiceBoxes.appendChild(formElementLabel);
					
					//adding column class attribute if configured
					if(attributes.config.config.column_view){
						
						choiceBoxes.classList.add("check_container_two_cols");
					}else{
						choiceBoxes.classList.add("check_container_block");
					}
					
					//loop all chech_items
					let ext_id = 0;
					for(each of attributes.config.items){
						let checkItem = make('div');
							
							
						if(attributes.config.config.column_view){
							checkItem.classList.add("check_options","check_box_button");	
						}else{
							checkItem.classList.add("check_options");	
						}
						
							
						let opt = make("input");
						opt.value = each;	
						opt.type = 'checkbox';
						

						if(attributes.config.config.column_view){
							opt.classList.add("check_options_input","custom_check_hidden");
						}else{
							opt.classList.add("check_options_input");
						}
						
						if(readonly){
							opt.setAttribute("readonly","");
							opt.setAttribute("disabled","");
						}
						
						opt.setAttribute('id',"_"+attributes.id+'_'+ext_id);
						opt.setAttribute('oninput',"checkGroupsUpdate("+"group_"+attributes.id+'_'+","+attributes.id+")");
						
						let lab = make("label");
						lab.setAttribute('for',"_"+attributes.id+'_'+ext_id);
						lab.innerHTML = each;
						
						if(attributes.config.config.column_view){
							lab.classList.add("custom_check_button","small");
						}
						
						
						checkItem.appendChild(opt);
						checkItem.appendChild(lab);
						
					  choiceBoxes.appendChild(checkItem);
					  ext_id++;
					}
					
					//adding other input if others attribute is set to true
					if(attributes.config.config.allow_others){
						let checkItem = make('div');
						checkItem.classList.add("form_check_other_options_con");
						let other_inputs = formMaker.makeForm("text",{},readonly,0,0,true);
						other_inputs.type = "text";
						other_inputs.classList.add("check_options_input");
						other_inputs.classList.add("other_check_input","small");
						other_inputs.setAttribute('id',"_"+attributes.id+'_'+ext_id+"others");
						other_inputs.setAttribute('placeholder',"Others: ");
						other_inputs.setAttribute('oninput',"checkGroupsUpdate("+"group_"+attributes.id+'_'+","+attributes.id+")");
						other_inputs.setAttribute("checked","");
						let labs = make("label");
						labs.setAttribute('for',"_"+attributes.id+'_'+ext_id+"others");
						// labs.innerHTML = "Others: ";
						labs.classList.add("padded_label","primary_color_faded");
							
						
						
						// checkItem.appendChild(labs);
						checkItem.appendChild(other_inputs);
						
					  choiceBoxes.appendChild(checkItem);
					}
					
					
					
					formElement.appendChild(choiceBoxes);
				}catch(e){
					console.warn("An error occured setting options for: ", attributes, e);
				}
			}else if(type == "table"){
				try{
					
					let tableBoxes = make("div");
					tableBoxes.setAttribute('id',"table_"+attributes.id+'_');
					tableBoxes.classList.add("responsive_tabs_con");
					tableBoxes.appendChild(formElementLabel);
					
					if(attributes.fullspan){
						formElement.classList.add("full_col_span");
					}
					
					if(attributes.config.config.custom_row){
						let add_button = make("div");
							add_button.classList.add("buttom_add_tab_col", "fa", "fa-plus");
							add_button.setAttribute("onclick","addColsTable(this, "+attributes.index+")");
							add_button.setAttribute("form_id","_table_"+attributes.id);	
							add_button.setAttribute("form_index",attributes.index);	
						if(readonly != false){
							add_button.classList.add("hidden_button");
						}
						tableBoxes.appendChild(add_button);
	
					}

					let genTab = generateTables(attributes, readonly);
					tableBoxes.appendChild(genTab);
					
					formElement.appendChild(tableBoxes);
				}catch(e){
					console.warn("An error occured setting options for: ", attributes, e);
				}
			
			}else if(type == "file"){
				try{
					
					
					let filebox = make("div");
					filebox.setAttribute('id',"files_"+attributes.id+'_');
					filebox.classList.add("filePickerContainer");
					filebox.appendChild(formElementLabel);
				
		
					let filePickerLab = generateFilePickers(attributes, readonly);

					filebox.appendChild(filePickerLab);
					
					formElement.appendChild(filebox);
					
					
				}catch(e){
					console.error(e);
					
				}
				
	
				
				//--
			}else{
				//--
			}
		};
		
		if(attributes.value){
			
			if(type == "textarea"){
				formInput.innerText = attributes.value;
			}else if(type == "header"){
				formInput.value = attributes.value;				
			}else{
				formInput.setAttribute("value", attributes.value);
				formInput.value = attributes.value;
				try{
					if(attributes.onchange){
						// Add the asigned onchange function of this element
						// on an event Loop if there is a value
						eventsPreLoader.push(attributes.id);
					};
				}catch(e){
					//--
				}
				
			}
			
		};
		
		
		if(attributes.min){
			formInput.setAttribute("min", attributes.min);
		};
		if(attributes.max){
			formInput.setAttribute("max", attributes.max);
		};
		
		if(attributes.fancy == true){
			//Adds Fancy Placeholder class to label
			formElementLabel.classList.add("placeholder_label");
			
		};
		if(attributes.required){
			formInput.setAttribute("required","");
		};
		
		if(attributes.disabled){
			formInput.setAttribute("disabled","");
		};
		
		if(readonly){
			formInput.setAttribute("readonly","");
		};
		
		
		if(attributes.onchange){
			formInput.setAttribute("onchange",attributes.onchange);
			formInput.setAttribute("onclick",attributes.onchange);
			eventsPreLoader.push(attributes.id);
		};
		
		if(attributes.oninput){
			formInput.setAttribute("oninput",attributes.oninput);
		};
		
		
		
		formElementLabel.setAttribute("for",attributes.id);
		
		if(attributes.type != "header"){
			formInput.classList.add("fancy_form_df", "form_display");
		}else{
			formInput.classList.add("form_display");
		}
		
		try{
			if(attributes.eventlist.length > 0){
				formInput.setAttribute("oninput","loadListedEvents("+attributes.index+")");
			}
		}catch(e){
			//--
		}

		
		let inputContainer = make("div");
			inputContainer.classList.add("cols_con_");
			
			if(type == 'checkboxes' || type == "table" || type == "file"){
				inputContainer.appendChild(formInput);
				// inputContainer.appendChild(formElementLabel);
				 
			}else{
				  inputContainer.appendChild(formElementLabel);
				  inputContainer.appendChild(formInput);
			}
			

			
		let optionsButton = make("div");
			optionsButton.classList.add("optionFormButton");
			optionsButton.innerHTML = "<span class='fa fa-ellipsis-h nopoint'> </span>";
			optionsButton.setAttribute("onclick", "showOptions(this, "+attributes.index+")");
			
			if(editor==true){
				formElement.appendChild(optionsButton);
			}else{
				formElement.classList.add("seamless");
			}
			
			//Adds a quick copy button to the form input
			if(showAc && attributes.type != 'header'){
				let copyButton = make("div");
				copyButton.classList.add("optionFormButton","df_button_flat");
				copyButton.innerHTML = "<span class='fa fa-copy nopoint'> </span>";
				copyButton.setAttribute("onclick", "copyThisData(this, "+attributes.index+")");
				copyButton.setAttribute("title","Copy value to Clip board.");
				formElement.appendChild(copyButton);			
				
			}
			
		
		
		if(type=="map"){
			let mapClick = make('div');
				mapClick.classList.add("df_button_flat","primary_background_darker","primary_color", "map_picker_button");
				mapClick.classList.add("fa", "fa-map-marker");
				mapClick.title = "Open location Picker Panel.";
				mapClick.setAttribute('onclick','showMapPickerHelper("'+attributes.id+'")');
				
				
			inputContainer.appendChild(mapClick);
		}
		
		
		
		formElement.appendChild(inputContainer);
		if(inputOnly){
			return formInput;
		}
		return formElement;
	},
	
	
	//gets all form input values
	retriveFormInput: function(jsonSets=false){
		
		
		if(jsonSets){
		
			formDataJSON = {};
			
			for(each of formDatas.forms){
				if(each.type == 'header'){
					continue; //skip header type datas
				}
				try{
					each.value = _(each.id).value;
					formDataJSON[each.id] =  _(each.id).value;
				}catch(e){
					console.log(e);
				}
			}
			
			return formDataJSON;
		}
		
		
		
		for(each of formDatas.forms){
			if(each.type == 'header'){
				continue; //skip header type datas
			}
			try{
				each.value = _(each.id).value;
			}catch(e){
				console.log(e);
			}
		}
		return formDatas;
	},
	
	
	// validate a input based on the specification of its config..
		//accepts the index of the form on formDatas or the form object itself
		//returns true if checks are all passed or the form is invalid
	validateForm: function(id){
		let argType = typeof(id);
		let form = {};
		if(argType == 'number'){
			form = formDatas.forms[id];
		}else if(argType == 'object'){
			form = id;
		}
		
		let inputType = form.type;
		let values = _(form.id).value;
		
		//return true if the input is event hidden and is required
		if(_(form.id).getAttribute("event_hidden") == 'true'){
			return true;
		}
		
		
		switch (inputType){
			case "text" || "textarea":
				if(form['required']){
					if(removeWhitespace(values).length <= 0){
						
						return false;
						
					}
				}
			break;
			case "number" || "range":
				if(form['required']){
					if(removeWhitespace(values).length <= 0){
						return false;
					}
				}
				
				if(values > parseFloat(form['max']) || values < parseFloat(form['min'])){
					return false;
				}
			break;
			case "select":
				if(form['required']){
					if(removeWhitespace(values).length <= 0){
						return false;
					}
				}
				
				//Something in the Future
				
				
			break;
			case "checkboxes":
				if(form['required']){
					if(removeWhitespace(values).length <= 0){
						return false;
					}
					try{
						let min = parseInt(form.config.config.min);
						let max = parseInt(form.config.config.max);
						let object = JSON.parse(values).filter(Boolean);
						console.log(object);
						
						if(object.length < min || (object.length > max && max > 0)){
							return false;
						}
						
					}catch(e){
						//--
					}
				}
				
			case "table":
			if(form['required']){
				if(removeWhitespace(values).length <= 0){
					return false;
				}
				try{
					let min = parseInt(form.config.config.min);
					let max = parseInt(form.config.config.max);
					let object = JSON.parse(values).filter(Boolean);
					let inputsConfig = form.config.itemsConfig;

					
					let passedRow  = 0;
					
					for(let sd = 0; sd < object.length; sd++){
						if(removeWhitespace(object[sd].join(" ")).length){
							passedRow++;
						};
						
						//loop among the input config of each input of table
						for(let zf = 0; zf < inputsConfig.length; zf++){
							let isRequired = inputsConfig[zf].attributes.required;
							if(isRequired){
								
								var column = object[sd][zf]; //get the value of required input on column
								if(removeWhitespace(column).length <= 0){
									return false;
								};
								
							}
						}
						
					}
					
					// console.log(object, passedRow);
					if(passedRow < min || (passedRow > max && max > 0)){
						return false;
					}
					
				}catch(e){
					//--
				}
			}
		
			
			break;
			case "file":
				if(form['required']){
					if(removeWhitespace(values).length <= 0){
						return false;
					}
					try{
						let min = parseInt(form.config.min);
						let max = parseInt(form.config.max);
						let object = JSON.parse(values).filter(Boolean);
						console.log(object);
						
						if(object.length < min || object.length > max){
							return false;
						}
						
					}catch(e){
						//--
					}
				}
			default:
				if(form['required']){
					if(removeWhitespace(values).length <= 0){
						return false;
					}
				}
			break;
		}
		
		function removeWhitespace(str) {
			return str.replace(/\s+/g, '');
		}
		
		return true;
		
	}
	
	
	
	
};

function showMapPickerHelper(elmid){
	try{
		showMapPicker(elmid);
	}catch(e){
		console.warn("Map picker is not installed yet.");
	}
	
	
}


//table generator helper for table type inputs
function generateTables(attributes, readonly=false){
		//loop all table_colms
		// console.log(attributes);
		let tableForm; 
		
		if(attributes.rowed){
			tableForm = make("div");
		}else{
			tableForm = make("table");
		}
			
		
		
			tableForm.classList.add('table_form_input');
		
		let remove_helper = make("div");
			remove_helper.classList.add("removehelper_float", 'fa' , 'fa-remove', 'primary_color_faded', 'into_right');
			remove_helper.title = "Remove Entry";
			remove_helper.setAttribute("onclick", "removeTableCol(this, "+attributes.index+")");
		
	let trItemsHeader ;
		
		if(attributes.rowed){
			trItemsHeader = make("div");
			trItemsHeader.classList.add("tabs_header_table");
		}else{
			trItemsHeader = make("tr");
			trItemsHeader.classList.add("tabs_header_table");
		}
			
		
	//Generating the Headers	
	let trItemsInput;
		if(attributes.rowed){
			trItemsInput = make("div");
			trItemsInput.classList.add("tabs_input_table", "rowed_table");
		
			if(attributes.responsivespan){
					trItemsInput.classList.add("span_width");
			}
			
		}else{
			trItemsInput = make("tr");
			trItemsInput.classList.add("tabs_input_table");
		}
			
			
		let ext_id = 0;
		for(each of attributes.config.items){
			let tdItem;
				
			if(attributes.rowed){
				tdItem = make("div");
				tdItem.style.display = "none";
			}else{
				tdItem = make("td");
			}
			
				tdItem.innerText = each;
				trItemsHeader.appendChild(tdItem);
				//optimized geneneration of the input rows
				let tdItemInput;
				
					if(attributes.rowed){
						tdItemInput = make("div");
						tdItemInput.classList.add("df_form_con");
					}else{
						tdItemInput = make("td");
					}
				
				let types = "text";
				let atr_item = {};
		
			try{
					types = attributes.config.itemsConfig[ext_id].type	
					atr_item = attributes.config.itemsConfig[ext_id];
			}catch(e){
				//-
				// console.log(e);
			}
				
				if(attributes.rowed){
					let formContainer = make("div");
						formContainer.classList.add("cols_con_");
					let labelTextId = genId(each+"_"+ext_id)+crypto.randomUUID();
					let labelForInp = generateLabel(each, labelTextId, {fancy:true});
						
					let inputTypeGen = 	genInputType(readonly,types,atr_item,ext_id,each);
					

						inputTypeGen.id = labelTextId;
						
					formContainer.appendChild(labelForInp);
					formContainer.appendChild(inputTypeGen);
					tdItemInput.appendChild(formContainer);
				}else{
					tdItemInput.appendChild(genInputType(readonly,types,atr_item,ext_id,each));
				}
				
			
				trItemsInput.appendChild(tdItemInput);
			ext_id++;
		}
		tableForm.appendChild(trItemsHeader);
	
	//Generating input fields
		let rowCount = attributes.config.config.row_count;
		for(df = 0; df < rowCount; df++){
			let cloned = trItemsInput.cloneNode(5);
			if(attributes.config.config.custom_row && readonly == false){
				cloned.appendChild(remove_helper.cloneNode(5)); //adds remove col helper for this tab
			}
			
			tableForm.appendChild(cloned);
		}


	//helper for input gen
	function genInputType(readonly,type='text', input_attributes={},ex_id,each){
		if(type == "select"){
			input_attributes = input_attributes.attributes;
		}	
		let inputs = formMaker.makeForm(type,input_attributes,false,false,false,true);
			// inputs.classList.add("fancy_form_df", "form_display");
			inputs.setAttribute("tableInput","");
			inputs.setAttribute('onchange',"tableGroupsUpdate("+"table_"+attributes.id+'_'+","+attributes.id+"),"+input_attributes.onchange||undefined);
			inputs.setAttribute("column_name",each)
			
			
			if(readonly){
				inputs.setAttribute("readonly", "");
				if(type == "select"){
					inputs.setAttribute("disabled", "true");
				};
				
			}
		return inputs;
	}
	
	
	function generateLabel(text, id ,attributes){
		
		let formElementLabel;
			formElementLabel = make("label");
			formElementLabel.classList.add("df_label_con");
			formElementLabel.setAttribute("for",id);
			formElementLabel.innerText = text;
			if(attributes.fancy){
				formElementLabel.classList.add("placeholder_label");
			}
			
		return formElementLabel;
	}
		
		return tableForm;
}


//table helper for removing table colmns on input.
function removeTableCol(elm, formId){
	let confirms = window.confirm("Remove Column Entry?");
	if(!confirms){
		return;
	}
	let sourceData = formDatas.forms[formId];
	if(sourceData.type != "table"){
		console.warn("Target form was not a table type");
		return;
	}
	let countTab = elm.parentNode.parentNode.getElementsByClassName("tabs_input_table").length;
	
	if(sourceData.config.config.custom_row != true){
		return;
	}
	
	if(countTab > sourceData.config.config.min && sourceData.config.config.min >= 0 && countTab > 1){
		elm.parentNode.remove();
		tableGroupsUpdate(_("table_"+sourceData.id+"_"),_(sourceData.id))
	}else{
		alert("Can't remove Column count of below: "+ sourceData.config.config.min);
	}
	
}

//table helper for adding table colmns on input.
function addColsTable(elm, formId,silent=false){
	let sourceData = formDatas.forms[formId];
	if(sourceData.type != "table"){
		console.warn("Target form was not a table type");
		return;
	}
	let countTab = elm.parentNode.getElementsByClassName("table_form_input")[0].getElementsByClassName("tabs_input_table").length;
	let tabSource = elm.parentNode.getElementsByClassName("table_form_input")[0].getElementsByClassName("tabs_input_table");
	
	
	
	if(countTab >= sourceData.config.config.max && sourceData.config.config.max > 0){
		if(!silent){
			alert("Table column is limited to: "+ sourceData.config.config.max);
		}
		return ;
	}
	
	let tabClones = tabSource[0].cloneNode(2);
	let unclear = tabClones.getElementsByClassName("form_display");
	//clears all input from source 
	for(each of unclear){
		each.value = "";
	}
	
	
	let formLabeling = tabClones.getElementsByClassName("cols_con_");
	let tabCounts = tabSource.length;
	
	for(each of formLabeling){
		let localId = each.getElementsByClassName("fancy_form_df")[0].id;
		localId = localId+ "_"+tabCounts;
		each.getElementsByClassName("fancy_form_df")[0].id = localId;
		each.getElementsByClassName("df_label_con")[0].setAttribute("for", localId);

	}
	
	elm.parentNode.getElementsByClassName("table_form_input")[0].appendChild(tabClones);
	addFancyPlaceholder();
}


//File input generator
function generateFilePickers(attributes, readonly=false){
		
	let fileBox = make("div");
		fileBox.classList.add("filebox_main_con");
	let prebox = make("div");	
		prebox.setAttribute("id", "prevbox_"+attributes.id);
		prebox.classList.add("fileprev_container_forms");
	
	let customFileElement = make("div");
		customFileElement.classList.add('customPrevElm','faded', 'medium');
		customFileElement.innerHTML = "Drop Files or Click Here";
	
	let acceptedFilesDisplay = make("div");
		acceptedFilesDisplay.classList.add("file_picker_accept_display_con","small","primary_color_faded");
		
		
		if(attributes.config.accept == "signature"){
			
			customFileElement.innerHTML = "Click to Open Signature Pad";
			attributes.config.signatureType = true;
			
			
		}else if(attributes.config.accept != "" && attributes.config.accept != undefined){
			acceptedFilesDisplay.innerHTML = checkFileTypes(attributes.config.accept);
			acceptedFilesDisplay.title = attributes.config.accept;
			customFileElement.appendChild(acceptedFilesDisplay);
			attributes.config.signatureType = false;
		}
		
		

		
	
		
	let filePickerElement = make("input");
		filePickerElement.type = "file";
		filePickerElement.setAttribute("id", "filepicker_"+attributes.id);
		filePickerElement.classList.add("hidden_file");
		
		if(attributes.config.multiple){
			filePickerElement.setAttribute("multiple", "true");
		}		
		
		if(attributes.config.accept == "signature"){
			filePickerElement.setAttribute('accept',".jpg, .png");
			filePickerElement.setAttribute("multiple", "false");
			filePickerElement.setAttribute("sigantureType", "true");
			
		}else{
			filePickerElement.setAttribute('accept',attributes.config.accept);
		}
		
		

		filePickerElement.setAttribute("max", attributes.config.max);
		filePickerElement.setAttribute("min", attributes.config.min);

		
		
		filePickerElement.setAttribute("onchange", "fileUploaders.handleChange(this)");
		filePickerElement.classList.add("df_outline","small", "df_small");
				
	let FileUploadElement = make("button");
		FileUploadElement.type = "button";
		FileUploadElement.innerText = ("Upload");
		FileUploadElement.classList.add("df_button","small", "df_small", 'secondary_background','primary_color_invert','uploader_hidden', 'upload_button');
		FileUploadElement.setAttribute("onclick","fileUploaders.uploadFiles('"+"filepicker_"+attributes.id+"','"+attributes.id+"')");
		FileUploadElement.setAttribute("id","upload_button_"+attributes.id);
		
						
	let FileClearElement = make("button");
		FileClearElement.type = "button";
		FileClearElement.innerText = ("Clear");
		FileClearElement.classList.add("df_button_flat","small", "df_small", 'primary_background','primary_color','uploader_hidden', 'clear_button');
		
		FileClearElement.setAttribute("onclick","fileUploaders.clearFiles('"+"filepicker_"+attributes.id+"')");
		
		
		fileBox.appendChild(prebox);
		

	let progBar = make("div");
		progBar.classList.add('progress_bar_filePicker','hide_progress');
		progBar.setAttribute('id','progress_mon_'+attributes.id);

	let progBarLine = make("div");
		progBarLine.classList.add('progress_bar');
		progBar.appendChild(progBarLine);

	
		if(!readonly){
			fileBox.appendChild(customFileElement);
			fileBox.appendChild(filePickerElement);
			fileBox.appendChild(FileUploadElement);
			fileBox.appendChild(FileClearElement);
			fileBox.appendChild(progBar);
			
			if(attributes.config.accept != "signature"){
				fileUploaders.setupDragAndDrop(customFileElement,filePickerElement);								
			}else{
				fileUploaders.setupSignature(customFileElement,filePickerElement);
			}
			
			
			
		}
	
	return fileBox;
	
}


function checkFileTypes(input) {
    const images = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tif', '.tiff', '.webp'];
    const videos = ['.mp4', '.mov', '.wmv', '.avi', '.mkv'];
    const documents = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'];

    let isImage = false;
    let isVideo = false;
    let isDocument = false;
    
    const parts = input.split('|')[0].split(',').map(part => part.trim().toLowerCase());

    parts.forEach(part => {
        if (images.includes(part) || part === 'image/*') isImage = true;
        if (videos.includes(part) || part === 'video/*') isVideo = true;
        if (documents.includes(part) || part === 'application/*') isDocument = true;
    });

    if (isImage && isVideo && isDocument) return 'Accepts images, documents, and videos';
    if (isImage && isVideo) return 'Accepts images and videos';
    if (isImage && isDocument) return 'Accepts images and documents';
    if (isVideo && isDocument) return 'Accepts videos and documents';
    if (isImage) return 'Accepts images';
    if (isVideo) return 'Accepts videos';
    if (isDocument) return 'Accepts documents';
    return 'Accepts other file types';
}



//File previews Generator helper function
function filePreviewGenerator(data, placeholder=false){
	//Soon to be implemented if needed
	return;
	
}


// logic for the form editor goes here

let formEditor = {
	mode: "add",
	savedData: {},
	
	changeType: function(elm){
		
		let visibleForms = ['value'];
		let availableTypes = ['value', 'min', 'max','required','item_editor']; //list of attributes allowed for editor
		
		switch(elm.value){
			case "text":
				visibleForms = ['value','required'];
			break;	
			case "textarea":
				visibleForms = ['value','required'];	
			break;	
			case "number":				
				visibleForms = ['value', 'min', 'max','required'];
			break;	
			case "range":				
				visibleForms = ['value', 'min', 'max', 'steps','required'];					
			break;	
			case "date":				
				visibleForms = ['value','required'];					
			break;
			case "header":
				visibleForms = ['value'];	
			break;	
			
			// Special Forms =====
			
			case "select":
				visibleForms = ['value','item_editor', 'required'];	
			break;	
			
			case "checkboxes":
				visibleForms = ['value','item_editor', 'required'];	
			break;	
			case "table":
				visibleForms = ['value','item_editor', 'required'];	
			break;
			case "file":
				visibleForms = ['value','item_editor', 'required'];	
			break;	
			
		}
		
		//Show or hide attributes option based on the selected type
		for(each of availableTypes){
			if(visibleForms.indexOf(each) >= 0){				
				let attrib = document.querySelector("[group="+each+"]");				
				attrib.classList.remove("hidden");
			}else{
				document.querySelector("[group="+each+"]").classList.add("hidden");
			}		
		}		
		
	},
	
	
	saveFormInput: function(){
		
		let formType = document.getElementById("form_type_").value;
		
		//Exit logic if type is none
		if(formType == ""){
			return false;
		}
		
		let formConfig = {'type': formType.toString(),'events':{}};
		
		
	//Only get and set the needed values and attributes per form type	
		switch(formType){
			case "text":
				
				formConfig.value = _('form_value_').value;
				
		
			break;	
			case "textarea":
				formConfig.value = _('form_value_').value;
				
			
			break;	
			case "number":
				formConfig.value = _('form_value_').value;
				formConfig.min = _('form_min_').value;
				formConfig.max = _('form_max_').value;
				
				
			break;	
			case "range":
				formConfig.value = _('form_value_').value;
				formConfig.min = _('form_min_').value;
				formConfig.max = _('form_max_').value;
			
			break;	
			case "date":
				formConfig.value = _('form_value_').value;
			
			break;	
			case "select":
				formConfig.value = _('form_value_').value;
				let savedSelect = selectionEditor.getItems();
				if(savedSelect != false){//only apply if save is found
					formConfig.items = savedSelect;
				}else{
					formConfig.items = formDatas.forms[selectedInputIndex].items;
				}
				
				
			
			break;	
			case "checkboxes":
				formConfig.value = _('form_value_').value;
				let checkOptions = checkoptionEditor.getItems();
				if(checkOptions != false){//only apply if save is found
					formConfig.config = checkOptions;
				}else{
					formConfig.config = formDatas.forms[selectedInputIndex].config;
				}
				
			
			break;	
			case "table":
				formConfig.value = _('form_value_').value;
				let tableOptions = tableEditor.getItems();
				if(tableOptions != false){//only apply if save is found
					formConfig.config = tableOptions;
					formConfig.rowed = tableOptions.rowed;
					formConfig.fullspan = tableOptions.fullspan;
					formConfig.responsivespan = tableOptions.responsivespan;
				}else{
					formConfig.config = formDatas.forms[selectedInputIndex].config;
					formConfig.rowed = formDatas.forms[selectedInputIndex].rowed;
					formConfig.fullspan = formDatas.forms[selectedInputIndex].fullspan;
					formConfig.responsivespan = formDatas.forms[selectedInputIndex].responsivespan;
				}
				
			break;
			case "file":
				formConfig.value = _('form_value_').value;
				let fileOptions = filePickerEditor.getItems();
				
				if(fileOptions != false){//only apply if save is found
					formConfig.config = fileOptions;
				}else{
					formConfig.config = formDatas.forms[selectedInputIndex].config;
				}
				
			break;
			case "header":
				formConfig.value = _('form_value_').value;
				
			
			break;	
			
		}
		formConfig.label = _('form_label_').value;
		formConfig.fancy = _('form_fancy_').checked;
		formConfig.required = _('form_required_').checked;
		formConfig.description = _('df_desc_editor').value;
		formConfig.group = _('group_selector_').value;
		
		
		formConfig.hidden = _('form_hidden_').checked ? _('form_hidden_').checked: undefined;
		
		formDatas.forms[selectedInputIndex] ? formConfig.eventlist = formDatas.forms[selectedInputIndex].eventlist : false;
		
		formConfig.row_span  = parseInt(_("row_spanning_").value);
		formConfig.col_span  = parseInt(_("column_spanning_").value);
		formConfig.span_column  = _("span_all_column").checked;
		
		let eventOptions = eventEditor.getItems();
		// Adds event trigers to the targeted input from evenOptions
		addToEventList(formConfig.eventlist, eventOptions);
			
			if(eventOptions != false){//only apply if save is found
				formConfig.events = eventOptions;
			}else{
				formDatas.forms[selectedInputIndex] ? formConfig.events = formDatas.forms[selectedInputIndex].events : false;
				
			}
		
		//Future custom attributes goes below here
		
		this.savedData.onchange ? formConfig.onchange = this.savedData.onchange : false;
		this.savedData.list ? formConfig.list = this.savedData.list: false;
		
		
		return formConfig;
		
		
	},
	
	loadFormInput: function(data){
		this.savedData = cloneSafe(data);
		this.mode = "edit"; // specify the mode for saving later
		
		_("form_type_").value = "";
		_("form_label_").value = "";
		_("form_value_").value = "";
		_("form_fancy_").checked = false;
		_("form_required_").checked = false;
		_("form_hidden_").checked = false;
		_('df_desc_editor').value = "";
		loadGroupList(data.group);
		

		if(data.type){
			_("form_type_").value = data.type;
			this.changeType(_("form_type_"));
		}	

		if(data.label){
			_("form_label_").value = data.label;
			
		};
		
		if(data.value){
			
			if(data.type == "text"){
				_("form_value_").value = data.value;
			}else{
				//perform other logic here if neccesary
				_("form_value_").value = data.value;
				
			}
			
		};
		
		if(data.min){
			_("form_min_").value = data.min;
		};
		if(data.max){
			_("form_max_").value = data.max;
		};
		
		if(data.fancy == true){
			_("form_fancy_").checked = data.fancy;
			
		};
		if(data.required == true){
			_("form_required_").checked = data.required;
			
		};
		
		if(data.hidden == true){
			_("form_hidden_").checked = data.hidden;
			
		};
		
		if(data.items){
			selectionEditor.setItems(data.items);
			selectionEditor.selectedIndex = undefined;
		};
		if(data.config){
			try{
				checkoptionEditor.setItems(data.config);
				checkoptionEditor.selectedIndex = undefined;
			}catch(e){
				// console.log(e);
			}			
			try{
				tableEditor.setItems(data.config);
				tableEditor.selectedIndex = undefined;
			}catch(e){
				// console.log(e);
			}
						
			try{
				filePickerEditor.setItems(data.config);
				
			}catch(e){
				// console.log(e);
			}
			
		}
		
		if(data.events){
			eventEditor.setItems(data.events);
			addFancyPlaceholder();
		}else{
			eventEditor.setItems();
		}
		
		if(data.description){
			_("df_desc_editor").value = data.description;
		}
		
		if(data.group){
			updateGroupSectionOptions(data.group.toString(), data.row_span);
		}
		
		_("row_spanning_").value = data.row_span;
		_("column_spanning_").value = data.col_span;
		_("span_all_column").checked = data.span_column;

		addFancyPlaceholder(); //reload fancy forms labels
		
	},
	
};



// ===============
// Exposing the function interfaces to window
// ===============


//Saving input changes or adding
function saveInputForm(){
	let mode = formEditor.mode;
	if(mode == 'edit'){
		formDatas.forms[selectedInputIndex] = formEditor.saveFormInput();
		formEditor.mode = 'add';
	}else{
		
		let formDataConf = formEditor.saveFormInput();
		
		if(formDataConf == false){
			showToast("Input type was Empty, please select type!");
			return;
		}else{
			formDatas.forms.push(formDataConf);
		}
		
		formEditor.mode = 'add';
	}


	// Do Other Sub Routinhere
	selectionEditor.setItems(); //clear item list of this editor
	checkoptionEditor.setItems();//clear item list of this editor
	tableEditor.setItems(); //clear item list of this editor
	filePickerEditor.setItems(); //clear item list of this editor
	eventEditor.setItems(); //clear item list of this editor

	//Close Form Modal
	closeEditor();
	loadForms();
}

function saveGroupChanges(){
	
	
	
	
}

//Helper function to add an event to its target input 
function addToEventList(inputEvents, savedInput){
	let currentInput = inputEvents;
	let targetInput = formDatas.forms[savedInput.targetIndex];
	if(savedInput){
		console.log(savedInput, targetInput);
	}
	if(!targetInput){
		return false;
	}
	if(targetInput.eventlist == undefined){
		targetInput.eventlist = [];
		targetInput.eventlist.push(savedInput.eventname);
		return;
	}
	if(targetInput.eventlist.indexOf(savedInput.eventname) <= -1){
		targetInput.eventlist.push(savedInput.eventname);
	}
}

function loadListedEvents(target = undefined, hidden){
	//Loop through all form inputs if target index is not passed
	if(target == undefined){
		
		for(z=0;z < formDatas.forms.length;z++){
			let inps = formDatas.forms[z];
			if(inps.type == "header"){
				continue;
			}
			if(inps.eventlist != undefined){
				//loop trough all events
				for(x=0;x < inps.eventlist.length;x++){
					let eventName = inps.eventlist[x];
					let val = _(inps.id).value;
					processEventAssigned(eventName,val);
				}
			}
		}

	}else{
		let inps = formDatas.forms[target];
			if(inps.eventlist != undefined){
				//loop trough all events
				for(x=0;x < inps.eventlist.length;x++){
					let eventName = inps.eventlist[x];
					let val = _(inps.id).value;
					processEventAssigned(eventName,val);
				}
			}
	}
}

//find and Proccess Event for this event name
function processEventAssigned(name,values){
	for(zx=0;zx < formDatas.forms.length;zx++){
		let inps = formDatas.forms[zx];
		if(inps.type == "header"){
			continue;
		}
		
		
		if(inps.events == undefined){
			continue;
		}
		
		
		if(inps.events.eventname == name){
			
			let inputElement = _(inps.id).parentNode.parentNode;
			let conditionFullfiled = false;
			
			if(inps.events.condition == undefined || inps.events.condition == "="){
				if(inps.events.value == values){
					conditionFullfiled = true;
				}
			}else if(inps.events.condition == ">="){
				if(values >= inps.events.value){
					conditionFullfiled = true;
				}
			}else if(inps.events.condition == ">"){
				if(values > inps.events.value){
					conditionFullfiled = true;
				}
			}else if(inps.events.condition == "<="){
				if(values <= inps.events.value){
					conditionFullfiled = true;
				}
			}else if(inps.events.condition == "<"){
				if(values < inps.events.value){
					conditionFullfiled = true;
				}
			}else{
				if(inps.events.value == values){
					conditionFullfiled = true;
				}
			}
			
			
			
			if(showHiddenForms){
				inputElement.style.removeProperty("display");
				inputElement.classList.add("hidden_shown");
				inputElement.title = "This input is hidden.";
				return;
			}
			
			inputElement.classList.remove("hidden_shown");
			
			//Hiding
			if (inps.events.type == "showon") {
				if (conditionFullfiled) {
					inputElement.style.removeProperty("display");
					_(inps.id).setAttribute('event_hidden','false');
					
				} else {
					inputElement.style.display = "none";
					_(inps.id).setAttribute('event_hidden','true');
				}
			} else if (inps.events.type == "hideon") {
				if (conditionFullfiled) {
					inputElement.style.display = "none";
					_(inps.id).setAttribute('event_hidden','true');
				} else {
					inputElement.style.removeProperty("display");
					_(inps.id).setAttribute('event_hidden','false');
				}
			
			//Disabling
			}else if(inps.events.type == "enableon"){
				if (conditionFullfiled) {
					inputElement.classList.add("disabled_form_input");
					_(inps.id).setAttribute('event_hidden','true');
				} else {
					inputElement.classList.remove("disabled_form_input");
					_(inps.id).setAttribute('event_hidden','false');
				}
			}else if(inps.events.type == "disableon"){
				if (conditionFullfiled) {
					inputElement.classList.add("disabled_form_input");
					_(inps.id).setAttribute('event_hidden','true');
				} else {
					inputElement.classList.remove("disabled_form_input");
					_(inps.id).setAttribute('event_hidden','false');
				}
			}
						
		}
	
	}
	
	
}


function hiddenConfigForms(s){
	let all_hidden = _("main_form_container").getElementsByClassName("hidden_form");
	
	if(all_hidden.length <= 0){
		return false;
	}
	
	for(each of all_hidden){
		if(s){
			each.classList.add("hidden_shown");
		}else{
			each.classList.remove("hidden_shown");
		}
	}
	
	return true;
}


function hiddenForms(show=false){
	showHiddenForms = show;
	loadListedEvents();
	hiddenConfigForms(show);
}




//load a selected input to editor
function loadFormInput(index){
	formEditor.mode = 'edit';
	selectedInputIndex = parseInt(index);
	formEditor.loadFormInput(formDatas.forms[selectedInputIndex]);	
	showEditor();
}


//Show the Editor view, editMode (optional) : should it load the form from index
function showEditor(editMode = false, index = null){
	if(editMode == 1 && index >= 0){
		loadFormInput(index);
		formEditor.mode = 'edit';
	}else{
		formEditor.mode = 'add';		
	};
	_("form_editor_modal").classList.remove("hidden");
	

}

function loadGroupList(selected=undefined){
	let group_selector = _("group_selector_");
		group_selector.innerHTML = "";
		
		let opts = make("option");
			opts.innerText = "-- Select Group --";
			opts.setAttribute("disabled","");		
			group_selector.appendChild(opts);
			
		let optsNo = make("option");
			optsNo.innerText = "No Group";
			optsNo.value = "none";
			// optsNo.setAttribute("selected","");
			group_selector.appendChild(optsNo);
				
		
	for(each of formDatas.groups){
		let opt = make("option");
		opt.value = each.id;
		opt.innerText = each.name;
		
		if(selected == each.name){
			opt.setAttribute("selected","");
		}
		group_selector.appendChild(opt);
	}
	
	
}


function updateGroupSectionOptions(val,data = undefined){
	if(event.target.id != "group_selector_"){
		_("group_selector_").value = val;
	}
	

	if(val == "none" || val == "" || val == undefined){
		_("row_span_configurator").style.display="none";
		_("column_span_configurator").style.display="none";
	}else{
		_("row_span_configurator").style.display="flex";
		_("column_span_configurator").style.display="flex";
	}
	
	if(data != undefined){
		_("row_spanning_").value = data;
	}
	
	
	
}

//Show the group Editor view
function showGroupEditor(){
	groupEditor.setItems(cloneSafe(formDatas));
	groupEditor.loadList();
	_("group_editor_modal").classList.remove("hidden");
	groupEditor.showSelection();
}


function closeEditor(target=undefined){
	
	if(target != undefined){
		_(target).classList.add("hidden");
		return;
	}

	
	_("form_editor_modal").classList.add("hidden");
	formEditor.loadFormInput({}); //clear inputs
}


function selectFormIndex(id){
	selectedInputIndex = parseInt(id);
}


// Quick Toolbar Helper
function addQuickInput(type = undefined){
	formEditor.mode = 'add';
	if(!type){
		type="text";
	}
	_("form_type_").value = type;
	saveInputForm();
	
}

// Group Adding Logic
function addNewGroup(type = undefined){

	
}

//Interface for the edit button
function openForEdit(){
	showEditor(true, selectedInputIndex);
	hideOptions();
}

//removing an input form
function removeFormInput(){
	let userRresponse = window.confirm("Are you sure to remove this input form? \nThis can't be undone.");
	
	if(userRresponse){
		formDatas.forms.splice(selectedInputIndex,1);
	}
	hideOptions();
	loadForms();
	
}


//Move form item up or down
function moveFormItem(index,dir=undefined){
	
	if(index == null || dir == undefined){
		console.warn("Index and dir cannot be null values!");
		return false;
	}
	
	let currentIndex = index;
	let arrs = formDatas.forms;
	if((currentIndex <= 0 && dir == 'up')|| (currentIndex+1 >= arrs.length && dir == 'down')){
		return;
	}
	
	
	if(dir == 'down'){
		arraymove(arrs, currentIndex, currentIndex+1);
		selectedInputIndex = currentIndex + 1;
	}else{
		arraymove(arrs, currentIndex, currentIndex-1);
		selectedInputIndex = currentIndex - 1;
	}
	loadForms(undefined,undefined,undefined,undefined,true)
	
	
	let selectedElm = _("main_form_container").getElementsByClassName("df_form_con")[selectedInputIndex];
	
	let target = _(arrs[selectedInputIndex].id);
		target.parentNode.parentNode.classList.add('movedForm');
	
	try{
		utility.smoothScroll(target,'center');	
	}catch(e){
		
		//-- Scroll???
	}	
	

}


//Moving forms helper
function moveUp(){
	moveFormItem(selectedInputIndex, 'up');
}
function moveDown(){
	moveFormItem(selectedInputIndex, 'down');
}


//Moving Array element at specific index
function arraymove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}




function showOptions(elm, id){
	let yref = this.event.y;
	let xref = this.event.x;
	
	_("optionsBox").style.top = yref+'px';
	
	_("optionsBox").classList.remove("hide_options");
	
	let optionboxWidth = _("optionsBox").getBoundingClientRect().width
	_("optionsBox").style.left = (xref-optionboxWidth)+'px';
	
	
	_("main_form_container").addEventListener("click",autoHideOptions);
	
} 

function autoHideOptions(e){
	if(!e.target.classList.contains("optionFormButton")){
		hideOptions();
	};
	
	
}


function hideOptions(){	
	_("optionsBox").classList.add("hide_options");
	
	let mv = document.getElementsByClassName("movedForm");
	for(each of mv){
		each.classList.remove('movedForm');
	}
	isFormArrangeMove = false;

} 


async function copyThisData(elm, index){
	try{
		if(utility.spammingJam()){
		showToast("Don't click too fast! spamming detected!");
		
		return;
		};	
		
	}catch(e){
		console.warn("Utility functions not found!");
	}

	
	let inout_value = (_(formDatas.forms[index].id).value);	
	// Automatically Copy the contents to the clipboard	
	let text = inout_value;
	
	// handle select elm typess
	if(_(formDatas.forms[index].id).tagName.toLowerCase() == 'select'){
		text = _(formDatas.forms[index].id).options[_(formDatas.forms[index].id).selectedIndex].text;
	}
	// handle checkboxes group elm types
	if(formDatas.forms[index].type.toLowerCase() == 'checkboxes'){
		text = _(formDatas.forms[index].id).value;
		try{
			let objectData = JSON.parse(text).join(", ");
			text = objectData;
		}catch(e){
			console.log(e);
		}
	}
 
    try {
      await navigator.clipboard.writeText(text);
		showToast("Content Copied to Clipboard");
    } catch (err) {
		showToast('Failed to copy: '+ err);
    }
  
	
	
}


//Helper Function for updating values on check groups to hidden form
function checkGroupsUpdate(checkElms, inputid){
	
	// console.log(inputid, checkElm);
	let allChecks = checkElms.getElementsByClassName("check_options_input");
	
	let targetForm = formDatas.forms.filter(obj => obj.id === inputid.id)[0];
	let targetMax = parseInt(targetForm.config.config.max);

	
	let GetValues = [];
	let exID = 0;
	
	//toggle selections if max is only 1 or less
	if(targetMax <= 1 && targetMax > 0){
		for(item of allChecks){
			if(item.value == event.target.value){
				continue;
			}
			item.checked = false;
		}
	}
	
	for(item of allChecks){
		if(item.checked){
			if(item.type == "text"){
				GetValues.push(item.value);
			}else{
				GetValues.push(item.labels[0].innerText);
			};
		}
		exID++;
	}
	
	if(GetValues.filter(Boolean).length > targetMax && targetMax > 0){
		let intype = event.target.type;
		
		if(intype == "checkbox"){
			event.target.checked = false;
		}else{
			event.target.value = "";
		}
		
		if(typeof(MAX_EVENTTRIGGER) == "function" && targetMax > 1){
			MAX_EVENTTRIGGER();
		}
		return;
	}
	
	inputid.value = (JSON.stringify(GetValues));

}

//Function Helper for setting values for check groups visually
function showGroupChecksValue(gid, values){
	let groupId = "group_" + gid + "_";
	if(_(groupId) == undefined){
		return;
	}
	_(gid).value = values;
	values = JSON.parse(values);
	let inputsCh = _(groupId).getElementsByClassName("check_options_input");
	
	
	for(ck of inputsCh){
		if(values.indexOf(ck.value) >= 0){
			values[values.indexOf(ck.value)] = null;
			ck.checked = true;
		};
	}
	
	try{
		let inputOth = _(groupId).getElementsByClassName("other_check_input");				
		for(each of inputOth){
			each.value = values.filter(Boolean).join (", ");
		}	
		
	}catch(e){
		//--
		console.log(e);
	}
	
}



//Table Editor Value Helpers ===
//Helper Function for updating values on check groups to hidden form
function tableGroupsUpdate(tableElms, inputid){
	
	// console.log(inputid, checkElm);
	let allColms = tableElms.getElementsByClassName("tabs_input_table");
	let GetValues = [];
	let exID = 0;
	for(item of allColms){
			let inputValues = [];
			let inputTabs = item.getElementsByClassName("form_display");
			for(each of inputTabs){
				 inputValues.push(each.value);
			}
			GetValues.push(inputValues);
		exID++;
	}
	
	inputid.value = (JSON.stringify(GetValues));
	console.log(inputid.value);
}

//Function Helper for setting values for check groups visually
function showTableGroupValue(gid, values){
	let groupId = "table_" + gid + "_";
	if(_(groupId) == undefined){
		return;
	}
	_(gid).value = values;
	values = JSON.parse(values);

	//get the target table form
	let tableElms = _(groupId).getElementsByClassName("table_form_input")[0];
	
	let allRows = tableElms.getElementsByClassName("tabs_input_table");
	
	
	
	//add rows if not enough for the data value
	if(values.length > allRows.length){
		let missingCount = values.length - allRows.length;
		let triggerAdd = _(groupId).getElementsByClassName("buttom_add_tab_col")[0];
		let indexId = triggerAdd.getAttribute("form_index");
		
		for(df = 0; df < missingCount;df++){
			addColsTable(triggerAdd, indexId, true);
		};
		
	}
	let exID = 0;
	for(item of allRows){
			let inputValues = values[exID];
			if(inputValues == undefined){
				continue;
			}
			
			let inputTabs = item.getElementsByClassName("form_display");
			let extID = 0;
			for(each of inputTabs){
				 each.value = inputValues[extID];
				 
				 extID++;
			}
		exID++;
	}

	
	
}


//Table Editor Value Helpers End



//Files Picker Values helper
function showFilesValue(gid, values, fromPicker = true, readonly=false){
	// Generate file preview to appropriate file boxes according to the value
	let filegroupId = "prevbox_" + gid;
		if(_(filegroupId) == undefined){
		return;
	}
	
	let filePreviews = _(filegroupId);
		filePreviews.innerHTML = "";
	
	_(gid).value = values;
	values = JSON.parse(values);
	
	
	for(zx = 0; zx < values.length; zx++){
		let previewCon = make("div");
		previewCon.classList.add("file_preview_container");
		let prvElm = getFilePrevElement(values[zx]);
		previewCon.appendChild(prvElm);
		
				
		let remove_helper = make("div");
			remove_helper.classList.add("removehelper_float", 'fa' , 'fa-remove', 'primary_color_faded');
			remove_helper.title = "Remove File";
			remove_helper.setAttribute("onclick", "fileUploaders.removeUploaded(this, '"+gid+"', "+zx+")");
			
		
			
		if(!readonly){
			previewCon.appendChild(remove_helper);
		}
		
		filePreviews.appendChild(previewCon);
	}

	
	
}


//generate correct preview according file extension
function getFilePrevElement(filepath) {
    // Extract the extension from the filepath
    let extension = filepath.slice(filepath.lastIndexOf('.') + 1).toLowerCase();

    // Define arrays for image and document file extensions
    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'webp'];
    const documentExtensions = ['txt', 'pdf', 'doc', 'docx', 'odt', 'xls', 'xlsx', 'ppt', 'pptx'];

    // Determine the file type based on the extension
    if (imageExtensions.includes(extension)) {
		
		let imageElm = make('img');
			imageElm.src = FILEGET_SERVER+"/"+filepath;
			imageElm.classList.add("prevImageContainer");
			
			imageElm.setAttribute("onclick",'prevImageOnClick(this)');
			
			return imageElm;
			

    } else if (documentExtensions.includes(extension)) {		
		let prevElm = make('div');
			prevElm.src = filepath;
			prevElm.setAttribute("href", FILEGET_SERVER+"/"+filepath);
			prevElm.setAttribute("onclick", 'go_to("'+FILEGET_SERVER+"/"+filepath+'","_blank")');
			prevElm.classList.add("prevDocImage", extension);
			
			prevElm.innerText = extension.toUpperCase();
			
			return prevElm;

    } else {
			let prevElm = make('div');
			prevElm.setAttribute("href", FILEGET_SERVER+"/"+filepath);
			prevElm.classList.add("prevFile");
			prevElm.setAttribute("onclick", 'go_to("'+FILEGET_SERVER+"/"+filepath+'","_blank")');
			prevElm.innerText = extension.toUpperCase();
			prevElm.classList.add("prevOtherImage", extension);
			return prevElm;
			
    }
}

const imagePreviewNode = "<div class='modal_con_imageprev_' id='modal_view_previmage' onclick='toggle_prevwindow(\"close\",this)' style='display:none;'>"+
	"<div class='option_corner'>"+
		"<span class='fa fa-close opt_b' onclick='toggle_prevwindow(\"close\")'></span>"+
		"<span class='fa fa-search-plus opt_b' onclick='zoom_in(this);' ></span>"+
	"</div>"+
	"<div class='image_con_m' id='pic_container_prev' onmousemove='move_imgprv(event)' onmouseup='no_move(event)' onmousedown='scroll_zoom(event)'>"+ 
		"<img id='previewer' src='' class='full_view_em_previmagecon' draggable='false'/>"+
	"</div>"+
"</div>";



//init image preview pad modal if none
function initImagePreviewNode(){
	if(_('modal_view_previmage') == null || _('modal_view_previmage') == undefined){
		
		let node = 	stringToHTMLNode(imagePreviewNode);
		document.body.appendChild(node);
	
		function stringToHTMLNode(htmlString) {
			const template = document.createElement('template');
			template.innerHTML = htmlString.trim(); // trim() to remove any extra spaces
			return template.content.firstChild;
		}
	}
}

initImagePreviewNode();


var zoomed = false;
var prevsx;
var prevsy;

let prev_con_image = _('pic_container_prev');
let previ = _('previewer');

function scroll_prev(){prev_con_image.scroll(prevsx,prevsy)};

var canmove = false;
var lastx;
var lasty;

var scrollX = 0;
var scrollY = 0;

 function gal_get_size(elm){ //getting the size of the raw image	
	var refh = elm;
	var size = ['',''];

	try{
		if(refh.offsetHeight){
			
			size[1] = refh.offsetHeight;
			size[0] = refh.offsetWidth;
			
		}else if(refh.style.pixelHeight){
			size[1] = refh.style.pixelHeight
			size[0] = refh.style.pixelWidth
			
		}
		
		}catch(e){
			console.log("Preview: Either an image has no set data params");
		}
		return size;
}

function prevImageOnClick(elm){
	let link_ = elm;
		previ.src = link_.src;
	// console.log(link_);
	toggle_prevwindow('open');
	var thesize = gal_get_size(previ);
		if(thesize[0] > thesize[1]){
			previ.classList.remove("portraits");
			previ.classList.remove("square");
		}else if(thesize[0] == thesize[1]){
			previ.classList.add("square");
		}else{
			previ.classList.remove("square");
			previ.classList.add("portraits");
		}
	
	
}


function toggle_prevwindow(d,ev=undefined){
	var gal_mod = document.getElementById('modal_view_previmage');
	
	if(ev != undefined){
		if(event.target.id != "modal_view_previmage"){
			return;
		}
	}
	
	
	if(d == 'close'){
		gal_mod.style.display = 'none'
		previ.style.width='';
		previ.style.height='';
		prev_con_image.classList.remove('zoomed_');	
		prevsx = 0;
		prevsy = 0;
		zoomed = false;
	}else{
		gal_mod.style.display = 'flex'
	}
}


function zoom_in(elm){
	var the_size = gal_get_size(previ);
	
	var thesize = gal_get_size(previ);
	
	if(zoomed == false){
	previ.classList.add('zoomed');
	prev_con_image.classList.add('zoomed_');
	elm.classList.add('fa-search-minus');	
	
	
	var h = setTimeout(scroll_prev,200);

	var the_csize = gal_get_size(prev_con_image);
		previ.style.width = (the_size[0]*2)+"px";
		
		previ.style.height = (the_size[1]*2)+"px";
		previ.style.transition = '0.3s';
	
	zoomed = true;
	}else{
	prevsx = scrollX;
	prevsy = scrollY;
		
	previ.classList.remove('zoomed');
	prev_con_image.classList.remove('zoomed_');	
	elm.classList.remove('fa-search-minus');

		previ.style.width = (the_size[0]/2)+"px";
		previ.style.height = (the_size[1]/2)+"px";
	
	zoomed = false;
	}
}


function move_imgprv(ev){ //scroll the view on mouse drag
	if(canmove == false && zoomed == false){
		return false;		
	}else if(canmove == true && zoomed == true){
	var movex = lastx - ev.screenX;
	var movey = lasty - ev.screenY;

	prev_con_image.scroll(scrollX + movex, scrollY + movey);

	}
		
}


function scroll_zoom(ev){//mouseclick - activate panning
	
	lastx = ev.screenX;
	lasty = ev.screenY;	
	scrollX = prev_con_image.scrollLeft;
	scrollY = prev_con_image.scrollTop;	
	canmove = true;
	
}

function no_move(ev){//mouseout - no panning
	canmove = false;
	scrollX = prev_con_image.scrollLeft;
	scrollY = prev_con_image.scrollTop;	
}


//Files Picker Values helper end



// =====================
// FormLoader logic
// =====================


try{
	formEditor.changeType(_("form_type_")); //init form type
}catch(e){
	//--
}

let isFormArrangeMove = false;


let showHiddenForms = false;
function loadForms(readonly=false,editor=true,showAc=false,renewId = false,isMoving = false){	
eventsPreLoader.length = 0;
isFormArrangeMove = isMoving;
	try{
		_("main_form_container").replaceChildren();	
	}catch(e){
		_("main_form_container").innerHTML = "";
	}
	let extCount = 0;
	formIdCollections.length = 0;

	if(editor){
		formMode = "edit";
	}else{
		formMode = "view";
	}
	
	
	loadAllGroups(editor);
	for(each of formDatas.forms){
		
		if(each.id != undefined && renewId == true){
			// console.log(each.id);
			each.id = each.id;
		}else{
			each.id = genId(each.label+" "+extCount);
		}
		
		
		
		formIdCollections.push(each.id);
		each.index = extCount;
		let thisType = each.type;
		let thisValue = each.value;
		let thisID = each.id;
		
		//Add to the group it belongs, otherwise, add to main
		let myForm;
		if(isGroupFound(each.group) && each.group != "none"){
			myForm = formMaker.makeForm(each.type, each, readonly, editor,showAc);
			try{
				_(each.group).appendChild(myForm);
				_(each.group).classList.add('occupied');
				_(each.group).classList.remove('group_hidden_');
			}catch(e){
				_(formDatas.forms[extCount].group).appendChild(myForm);
			}
		
			
			
		}else{
			myForm = formMaker.makeForm(each.type, each, readonly, editor,showAc);
			_("main_form_container").appendChild(myForm);
		}
		
				
		if(thisType == "header" && thisValue){
			myForm.classList.add("header_container_");
		}
		
	
		
		//checkGroups
		if(thisType == "checkboxes" && thisValue){
			try{
				showGroupChecksValue(thisID, thisValue);
			}catch(e){
				console.log(e);
			}
		}
				
		//tableGroups
		if(thisType == "table" && thisValue){
			try{
				showTableGroupValue(thisID, thisValue);
			}catch(e){
				console.log(e);
			}
		}		
		
		//fileGroups
		if(thisType == "file" && thisValue){
			try{
				showFilesValue(thisID, thisValue, false,readonly);
			}catch(e){
				console.log(e);
			}
		}
		
		if(each.hidden){
			_(each.id).setAttribute('event_hidden','true');
			myForm.classList.add("hidden_form");
			if(showHiddenForms){ //show hidden fields for none event reload
				myForm.classList.add("hidden_shown");
			}
		}
		
		
		extCount++;
	}	
	
	if(_("quick_forms") != undefined){
		if(editor){
			_("quick_forms").classList.remove("hidden");
		}else{
			_("quick_forms").classList.add("hidden");
		}
	}
	
	if(_("side_options") != undefined){
		if(editor){
			_("side_options").classList.remove("hidden");
		}else{
			_("side_options").classList.add("hidden");
		}
	}
	
	if(!isMoving){
		loadListedEvents(undefined, showHiddenForms);
	}
	addFancyPlaceholder();
	
	try{
		nextGroup_(activeCurrentPage, activeCurrentPage);
	}catch(e){
		//--
	}

}

let groupPagesId = [];
let activeCurrentPage = undefined;

function loadAllGroups(edit){
	let defPageShown = false;
	if(formDatas.groups == undefined){
		return;
	}
	
	groupPagesId.length = 0;
	
	let extPageIndexCount = 0;
	let countPaginated = formDatas.groups.filter(obj => obj.type === "paginated").length;	
	let countPaginatedDefault = formDatas.groups.filter(obj => obj.defaultpage == true).length;
	
	if(countPaginatedDefault){
		extPageIndexCount++;
	}
	
	for(each of formDatas.groups){
		let newgcon = make('div');
			newgcon.classList.add("fgroup");
			newgcon.id = each.id;
			newgcon.classList.add("col_"+each.column_count);
			// newgcon.title = "Group: "+each.name;
				
			if(each.defaultpage == true && each.type == "paginated"){
				newgcon.classList.add("show_group");
				defPageShown = true;
				groupPagesId[0] = each.id;
			}
				
			if(!edit){
				newgcon.classList.add("group_hidden_");
			}
			
			if(each.type == "paginated"){
				newgcon.classList.add("_paginated_group_page");
				
				let pageControls = makeGroupNextPrevControls(each, extPageIndexCount, countPaginated);
				
				groupPagesId[extPageIndexCount] = each.id;
				
				if(!each.defaultpage == true){
					extPageIndexCount++;
			
				}
				
				newgcon.appendChild(pageControls);
			}
		_("main_form_container").appendChild(newgcon);
	}
	
	
	
	for(each of formDatas.groups){
		if(defPageShown){
			break;
		}
		if(each.type == "paginated"){
			_(each.id).classList.add("show_group");
			break; 
		}
	}
	
}


function isGroupFound(id){
	let grp = _(id);
	if(grp == undefined){
		return false;
	}
	
	if(!grp.classList.contains("fgroup")){
		return false;
	}
	
	return true; //Return true only if group element is found
	
}



function makeGroupNextPrevControls(data,index, total = 0){
	let totalPagination = total;
	let mainControlCons = make("div");
		mainControlCons.classList.add("group_page_controls_main");

	
	let prevPage;
		if(data.defaultpage == true){
			prevPage = 0;
		}else{
			prevPage = parseInt(index-1);			
		}
	let prevButton = make("div");
		prevButton.classList.add("df_button_flat","primary_background_darker","primary_color","small","control_buttons","_prev_button_");
		prevButton.innerHTML = "<span class='fa fa-arrow-left'> </span>&nbsp; Prev ";
		prevButton.setAttribute("onclick","prevGroup_("+prevPage+")");
		

	let nextPage;
		if(data.defaultpage == true){
			nextPage = 1;
		}else{
			nextPage = parseInt(index+1);	
		}			

	let nextButton = make("div");
		nextButton.classList.add("df_button","secondary_background","primary_color_invert","small","control_buttons","_next_button_");
		nextButton.innerHTML = "Next &nbsp; <span class='fa fa-arrow-right'></span> ";
		nextButton.setAttribute("onclick","nextGroup_("+nextPage+","+(nextPage-1)+")");
	
		
		//Page Counter
	let pageDisplay = make("div");
		pageDisplay.classList.add("df_button_flat","primary_background","primary_color","small","control_buttons","_page_counter_");
		
		if(data.defaultpage == true || totalPagination <= 1){
			pageDisplay.innerText = "Page 1 of "+totalPagination;
		}else{
			pageDisplay.innerText = "Page "+parseInt(1+index)+" of "+totalPagination;			
		}
		
	if(SHOW_PAGE_COUNTER == true){
		mainControlCons.appendChild(pageDisplay);
	}
	
	if(index > 0 && data.defaultpage != true && (totalPagination > 1)){
		mainControlCons.appendChild(prevButton);
	}
	if(index+1 < totalPagination || data.defaultpage == true){
		mainControlCons.appendChild(nextButton);
	}
	
	
	return mainControlCons;
}

function nextGroup_(nextIndex, currentPage = undefined){
	
	let main_con = _("main_form_container");
	let current_paginated = main_con.getElementsByClassName("show_group");
	let nxPage = formDatas.groups[nextIndex]; 
	
	
	let currentGroupSelected = formDatas.groups.filter(obj => obj.id === groupPagesId[currentPage]);
	
	
	let req_check = currentGroupSelected[0].required_check;
	
	
	//External req_check true interrupt to Allow req disabling
	
	if(IGNORE_REQ_CHECKING){
		req_check = false;
	}
	
	
	if(req_check == true && isFormArrangeMove == false){
		console.log("Checking required...");
		
		let gpId = currentGroupSelected[0].id;
		let allIds = [];
		
		
		for(each of formDatas.forms){
			if(each.group == gpId && each.type != "header"){
				allIds.push(each.id);
				let validation = formMaker.validateForm(each.index);
				
				if(validation == false){
					//Do something here...
					//Should return and don't procced if validation gets false
					
					if(formMode != "edit"){
						
						if(typeof(INPUT_VALIDATION_FALSE_EVENT) == "function"){
							try{
								INPUT_VALIDATION_FALSE_EVENT();
								_(each.id).classList.add("form_required");
							}catch(e){
								console.warn("INPUT_VALIDATION_FALSE_EVENT event function failed.");
							}
						}else{
							alert("Please Fill up all required fields!");
							_(each.id).classList.add("form_required");
						}
						return false;
					}else{
						console.log("Form validation value: false for ", each.id);
					}
				}else{
					_(each.id).classList.remove("form_required");
				}
				
			}
		}
		
	}
	
	activeCurrentPage = nextIndex;
	
	if(isFormArrangeMove == true){ //dont animate if forms are in move state
		current_paginated[0].classList.remove("_paginated_animin_right");	
		current_paginated[0].classList.remove('show_group');
		// current_paginated[0].classList.remove('_paginated_animout_left');
		_(groupPagesId[nextIndex]).classList.add("show_group");
		
		return;
	}

	
	window.setTimeout(timedRemove, 300);
	current_paginated[0].classList.add('_paginated_animout_left');
	current_paginated[0].classList.remove("_paginated_animin_right");		


	
	function timedRemove(){
		current_paginated[0].classList.remove('_paginated_animout_left');
		current_paginated[0].classList.remove('show_group');
		
		loadNextPage();
	}
	
	function loadNextPage(){
		_(groupPagesId[nextIndex]).classList.add("show_group");
		_(groupPagesId[nextIndex]).classList.add("_paginated_animin_right");
		
	}
	

}

function prevGroup_(prevIndex){
	
	let main_con = _("main_form_container");
	let current_paginated = main_con.getElementsByClassName("show_group");
	let nxPage = formDatas.groups[prevIndex]; 
	
		
	window.setTimeout(timedRemove, 300);
	current_paginated[0].classList.add('_paginated_animout_right');
	current_paginated[0].classList.remove("_paginated_animin_left");
	
	function timedRemove(){
		current_paginated[0].classList.remove('_paginated_animout_right');
		current_paginated[0].classList.remove('show_group');
		
		loadNextPage();
	}
	
	function loadNextPage(){
		_(groupPagesId[prevIndex]).classList.add("show_group");
		_(groupPagesId[prevIndex]).classList.add("_paginated_animin_left");
		window.setTimeout(timedRemoveClass2, 300);
	}
	
	function timedRemoveClass2(){
		_(groupPagesId[prevIndex]).classList.remove("_paginated_animin_left");
		_(groupPagesId[prevIndex]).classList.remove("_paginated_animin_right");
	}
	
	activeCurrentPage = prevIndex;
	
	// current_paginated[0].classList.remove('show_group');
	// _(groupPagesId[prevIndex]).classList.add("show_group");

}


//Pre load events loader, toggle click event to forms specified with onchange event to reflect Automatically
function loadEvents(){
	for(each of eventsPreLoader){
		try{
			_(each).click()
		}catch(e){
			// do nothing --
		}
	}
}


function openEditWindow(){
	let formEditType = _("form_type_").value;
	
		//Open the appropriate window editor for form
		switch(formEditType){
		case "select":
			let items = formDatas.forms[selectedInputIndex].items;
			if(items == undefined){
				items = [];
			}
			
			
			selectionEditor.showEditor();
	
		break;	
		case "checkboxes":
			let config_check = formDatas.forms[selectedInputIndex].config;
			if(config_check == undefined){
				config_check = [];
			}
			
			checkoptionEditor.showEditor();
	
		break;		
		case "table":
			let config_table = formDatas.forms[selectedInputIndex].config;
			if(config_table == undefined){
				config_table = [];
			}
			
			tableEditor.showEditor();
	
		break;	
		case "file":
			let config_file = formDatas.forms[selectedInputIndex].config;
			if(config_file == undefined){
				config_file = undefined;
			}
			
			filePickerEditor.showEditor();
	
		break;	
		
		}
	
}


// Special Form Editors


// Selection Items Editor
const selectionEditor = {
	items : ["Item 1"], //populated with Sample Items
	selectedIndex: 0,
	saved: [],
	listenerFunction: undefined,
	moveUpItem: function(){
		
		if(this.selectedIndex == undefined){return false }
		moveItemOrder(this.items, 'up', this);
		// console.log(this.items);
		this.loadList()
	},	
	moveDownItem: function(){
		
		if(this.selectedIndex == undefined){return false }
		moveItemOrder(this.items, 'down', this);
		// console.log(this.items);
		this.loadList()
	},
	
	loadList: function(){
		let listCon = _("select_list_");
		listCon.innerHTML = "";
		//payload for the generator
		let data = {
			'context': 'selectionEditor', //set to name of this root object
			'index': '',
			'text': '',
		};
		
		if(typeof(selectionEditor.items) != "object"){
			return false;
		}
		
		for(z = 0; z < this.items.length; z++){
			data.index = z;
			data.text = this.items[z];
			let gen = genItemElm(data);
			if(z == this.selectedIndex){
				gen.classList.add("selected");
			}
			listCon.appendChild(gen);
		}

	},
	
	
	removeItem: function(){
		let selected = this.selectedIndex;
		this.items.splice(selected,1);
		this.selectedIndex = undefined;
		this.loadList();
		
	},
	updateSelected: function(){
		let elm = (event.target);
		let ivalue = elm.value;
		this.items[this.selectedIndex] = ivalue;
	},
	
	addItemMenu: function(){
		let numcount = this.items.length;
		
		if(this.items == undefined){
			this.items = [];
		}
		
		this.items.push("Item "+ (numcount+1));
		this.loadList();
		_("select_list_").scrollTop = _("select_list_").scrollHeight;
	},
	
	
	saveItems: function(){
		
		this.saved =  cloneSafe(this.items);
		try{
			if(this.listenerFunction){
				this.listenerFunction();
			}
		}catch(e){
			//-
		}


	},
	getItems: function(){
		if(this.saved == undefined){
			return false;
		}
		return cloneSafe(this.saved);
	},
	
	setItems: function(list=undefined,listener=undefined){
		
		if(list != undefined){
			this.items = cloneSafe(list);
		}else{
			try{				
				this.saved = undefined;
				this.items.length = 0;
			}catch(e){
				//--
			}
		}
		
		if(listener){
			this.listenerFunction = listener;
		}else{
			this.listenerFunction = undefined;
		}
		
	},
	
	showEditor: function(){
		this.loadList();
		_("form_select_editor_modal").classList.remove('hidden');
		
	}
	
	
	
}
// File Picker Editor
const filePickerEditor = {
	selectedIndex: 0,
	config: {
		'multiple': false,
		'accept': '',
		'min': 0,
		'max': 0,
		
	},
	saved: {},
	listenerFunction: undefined,

	
	loadConfig: function(){
		// let listCon = _("select_list_");
		// listCon.innerHTML = "";
		//payload for the generator

		_('file_type_').value = this.config.accept;
		_('file_min_').value = this.config.min;
		_('file_max_').value = this.config.max;
		
		_('multiple_file_').checked = this.config.multiple;
		
	},
	

	
	saveItems: function(){
		try{
			if(this.listenerFunction){
				this.listenerFunction();
			}
		}catch(e){
			//-
		}

		this.config.accept = _('file_type_').value;
		this.config.min = _('file_min_').value;
		this.config.max = _('file_max_').value;
		this.config.multiple = _('multiple_file_').checked;
		
		this.saved =  cloneSafe(this.config);
		
	},
	
	getItems: function(){
		if(this.saved == undefined){
			return false;
		}
		return cloneSafe(this.saved);
	},
	
	setItems: function(configs=undefined,listener=undefined){
		if(configs != undefined){
			this.config = cloneSafe(configs);
		}else{
			try{				
				this.saved = undefined;				
				this.config = {
					'multiple': false,
					'accept': '',
					'min': 0,
					'max': -1,
				};
			}catch(e){
				//--
			}
		}
		
		if(listener){
			this.listenerFunction = listener;
		}else{
			this.listenerFunction = undefined;
		}
		
	},
	
	showEditor: function(){
		this.loadConfig();
		_("form_file_editor_modal").classList.remove('hidden');
		
	}
	
	
};


// Check Items Editor
const checkoptionEditor = {
	items : ["Check Item 1"], //populated with Sample Items
	config: {min:0, max:0, column_view:false,allow_others:false},
	selectedIndex: 0,
	saved: [],
	moveUpItem: function(){
		
		if(this.selectedIndex == undefined){return false }
		moveItemOrder(this.items, 'up', this);
		// console.log(this.items);
		this.loadList()
	},	
	moveDownItem: function(){
		
		if(this.selectedIndex == undefined){return false }
		moveItemOrder(this.items, 'down', this);
		// console.log(this.items);
		this.loadList()
	},
	
	loadList: function(){
		let listCon = _("check_list_");
		listCon.innerHTML = "";
		//payload for the generator
		let data = {
			'context': 'checkoptionEditor', //set to name of this root object
			'index': '',
			'text': '',
		};
		
		if(typeof(this.items) != "object"){
			return false;
		}
		
		for(z = 0; z < this.items.length; z++){
			data.index = z;
			data.text = this.items[z];
			let gen = genItemElm(data);
			if(z == this.selectedIndex){
				gen.classList.add("selected");
			}
			listCon.appendChild(gen);
		}
	},
	
	
	removeItem: function(){
		if(this.selectedIndex == undefined){return false }
		let selected = this.selectedIndex;
		this.items.splice(selected,1);
		this.selectedIndex = undefined;
		this.loadList();
		
	},
	updateSelected: function(){
		let elm = (event.target);
		let ivalue = elm.value;
		this.items[this.selectedIndex] = ivalue;
	},
	
	addItemMenu: function(){
		let numcount = this.items ? this.items.length : 0;
		if(this.items == undefined){
			this.items = [];
		}
		this.items.push("Check Item "+ (numcount+1));
		this.loadList();
		_("check_list_").scrollTop = _("check_list_").scrollHeight;
	},
	
	
	saveItems: function(){
		this.saved =  cloneSafe(this.items);
			try{				
				this.config.min = _("min_check").value;
				this.config.max = _("max_check").value; 
				this.config.column_view = _("column_check").checked; 
				this.config.allow_others = _("allow_others").checked; 
			}catch(e){
				this.saved = undefined;
				this.items.length = 0;
				this.config['min'] = 0;
				this.config['max'] = 1;
			}
		
		
	},
	
	getItems: function(){
		//Returns both items and the onfig
		let returnData = {}
		if(this.saved == undefined){
			return false;
		}		
		if(this.saved.length <= 0){
			return false;
		}
		returnData.config = this.config;
		returnData.items = this.saved;
		return cloneSafe(returnData);
	},
	
	setItems: function(data=undefined){
		// Accept data as object from form factory config
		if(data != undefined){
			this.items = cloneSafe(data.items);
			let configData = data.config;
			configData ? this.config = cloneSafe(configData) : this.config;
			
		}else{
			try{				
				this.saved = undefined;
				this.items.length = 0;
				this.config.min = 0;
				this.config.max = 1;
			}catch(e){
				//--
			}

		}
	
		
	},
	
	showEditor: function(){
		this.loadList();
		_("check_options_editor_modal").classList.remove('hidden');
		_("min_check").value = this.config.min;
		_("max_check").value = this.config.max;
		_("column_check").checked = this.config.column_view; 
		_("allow_others").checked = this.config.allow_others; 
	}
	
	
	
}

// Table Items Editor
const tableEditor = {
	items : ["Column 1"], //populated with Sample Column Items
	itemsConfig: [{type:"text", attributes:{}}], //This is stores config data

	
	config: {min:0, max:0,custom_row:false,row_count: 1},
	rowed: false,
	selectedIndex: 0,
	saved: [],
	moveUpItem: function(){
		
		if(this.selectedIndex == undefined){return false }
		moveItemOrder(this.items, 'up', this);
		try{
			moveItemOrder(this.itemsConfig, 'up', this, true);
			
		}catch(e){
			//-
		}
		
		// console.log(this.items);
		this.loadList()
	},	
	moveDownItem: function(){
		
		if(this.selectedIndex == undefined){return false }
		moveItemOrder(this.items, 'down', this);
		try{
			moveItemOrder(this.itemsConfig, 'down', this,true);
		}catch(e){
			//-
		}
		// console.log(this.items);
		this.loadList()
	},
	
	loadList: function(){
		let listCon = _("table_list_");
		listCon.innerHTML = "";
		//payload for the generator
		let data = {
			'context': 'tableEditor', //set to name of this root object
			'index': '',
			'text': '',
		};
		
		if(typeof(this.items) != "object"){
			return false;
		}
		
		for(z = 0; z < this.items.length; z++){
			data.index = z;
			data.text = this.items[z];
			let gen = genItemElm(data);
			if(z == this.selectedIndex){
				gen.classList.add("selected");
			}
			
			gen.addEventListener("click", tableEditor.itemSelected);
			listCon.appendChild(gen);
		}

	},
	
	
	removeItem: function(){
		if(this.selectedIndex == undefined){return false }
		let selected = this.selectedIndex;
		this.items.splice(selected,1);
		this.itemsConfig.splice(selected,1);
		this.selectedIndex = undefined;
		this.loadList();
		
	},
	updateSelected: function(){
		let elm = (event.target);
		let ivalue = elm.value;
		this.items[this.selectedIndex] = ivalue;
	},
	
	addItemMenu: function(){
		if(this.items == undefined){
			this.items = [];
		}
		let numcount = this.items.length;
		
		this.items.push("Column "+ (numcount+1));
		
		let itemConfig = {
			"type":"text",
			"attributes": {},
		}
		
		if(this.itemsConfig == undefined){
			this.itemsConfig = [];
		}
		
		this.itemsConfig.push(itemConfig);
		this.loadList();
		_("table_list_").scrollTop = _("table_list_").scrollHeight;
	},
	
	
	saveItems: function(){
		this.saved =  cloneSafe(this.items);
		this.itemsConfig =  cloneSafe(this.itemsConfig);
		this.config.row_count = _("row_tab").value;
		this.config.min = _("min_tab").value;
		this.config.max = _("max_tab").value; 
		this.config.custom_row = _("custom_tab_check").checked; 
		this.rowed = _("rowed_check").checked;
		this.fullspan = _("fullspan_check").checked;
		this.responsivespan = _("responsivespan_check").checked;
	},
	
	//Config Editor for input element type
	configItem: function(){
		let inputType = this.itemsConfig[this.selectedIndex].type;
		let inputRequired = this.itemsConfig[this.selectedIndex].required;
		
		if(inputType == "select"){
			
			if(this.itemsConfig[this.selectedIndex].attributes.items){
				selectionEditor.setItems(this.itemsConfig[this.selectedIndex].attributes.items, this.savingEditFromSelect);
			}else{
				selectionEditor.setItems(undefined, this.savingEditFromSelect);
			}			
			selectionEditor.showEditor();			
		}
		
		
		
		
		// console.log(inputType);		
	},
	
	savingEditFromSelect: function(){
		tableEditor.itemsConfig[tableEditor.selectedIndex].attributes.items = selectionEditor.getItems();
	
	},
	
	
	//Set Input type to the Input Table Input selected
	setInputType: function(v){
		try{
			tableEditor.itemsConfig[tableEditor.selectedIndex].type = v;
		}catch(e){
			let confT = {
				type:v,
				attributes: {},
			}
			tableEditor.itemsConfig[tableEditor.selectedIndex] = confT;
			//
		}
		
	},
	
	//Set Required attrib to the Input Table Input selected
	setRequired: function(v){
		try{
			tableEditor.itemsConfig[tableEditor.selectedIndex].required = v;
		}catch(e){
			let confT = {
				type:'text',
				attributes: {'required': v},
			}
			tableEditor.itemsConfig[tableEditor.selectedIndex] = confT;
			//
		}
	},
	
	//listens if table item was selected on editor
	itemSelected: function(){
		// console.log( tableEditor.itemsConfig);
		_("type_tab").value = tableEditor.itemsConfig[tableEditor.selectedIndex].type;
		_("tab_input_required").checked = tableEditor.itemsConfig[tableEditor.selectedIndex].attributes.required;
		_("tab_input_required").checked = tableEditor.itemsConfig[tableEditor.selectedIndex].required;
	},
	
	getItems: function(){
		//Returns both items and the config
		let returnData = {}
		if(this.saved == undefined){
			return false;
		}		
		if(this.saved.length <= 0){
			return false;
		}
		returnData.config = this.config;
		returnData.items = this.saved;
		returnData.itemsConfig = this.itemsConfig;
		returnData.rowed = this.rowed;
		returnData.fullspan = this.fullspan;
		returnData.responsivespan = this.responsivespan;
		return cloneSafe(returnData);
	},
	
	setItems: function(data=undefined){
		// Accept data as object from form factory config
		if(data != undefined){
			this.items = cloneSafe(data.items);
			this.itemsConfig = cloneSafe(data.itemsConfig);
			let configData = data.config;
			this.config = cloneSafe(configData);
			try{
				this.rowed = cloneSafe(data.rowed);
				this.fullspan = cloneSafe(data.fullspan);
				this.responsivespan = cloneSafe(data.responsivespan);
				_("rowed_check").checked = data.rowed;
				_("fullspan_check").checked = data.fullspan;
				_("responsivespan_check").checked = data.responsivespan;
			}catch(e){
				_("rowed_check").checked = false;
				_("fullspan_check").checked = false;
				_("responsivespan_check").checked = false;
				//--
			}
		}else{
			try{				
				this.saved = undefined;
				this.items.length = 0;
				this.config.custom_row = false;
				this.config.min = 0;
				this.config.max = 0;
				this.config.row_count = 1;
				this.itemsConfig.length = 0;
				this.rowed = false;
				this.fullspan = false;
				this.responsivespan = false;
				_("rowed_check").checked = false;
				_("fullspan_check").checked = false;
				_("responsivespan_check").checked = false;
			}catch(e){
				//--
			}

		}
	
		
	},
	
	showEditor: function(){
		this.loadList();
		_("table_editor_modal").classList.remove('hidden');
		_("min_tab").value = this.config.min;
		_("max_tab").value = this.config.max;
		_("row_tab").value = this.config.row_count;
		_("custom_tab_check").checked = this.config.custom_row;
		
	}
	
	
	
}

function genItemElm(data={},editable=true){
	let itemList = make("div");
		itemList.classList.add('item_list_container');
		
	if(data.index != undefined){
		itemList.setAttribute("onclick","setIndex("+data.context+","+data.index+",this)");		

	}
	
	let itemtext;
	
	if(editable == false){
		itemtext = make("span");
		itemtext.classList.add("item_text");
		itemtext.innerHTML = data.text;
		itemList.appendChild(itemtext);
	}else{
		itemtext = make("input");
		itemtext.classList.add("item_text_input","small");
		itemtext.value = data.text;
		itemtext.setAttribute('oninput', data.context + ".updateSelected()");
		itemtext.setAttribute('onchange', data.context + ".updateSelected()");
		itemtext.setAttribute("onfocus","setIndex("+data.context+","+data.index+",this)");
		itemList.appendChild(itemtext);
	}
	

	return itemList;
}

function genItemElmG(data={},editable=true){
	let itemList = make("div");
		itemList.classList.add('item_list_container');
		
	if(data.index != undefined){
		itemList.setAttribute("onclick","setIndex("+data.context+","+data.index+",this);"+data.context+".showSelection();");
	}
	
	let itemtext;
	
	if(editable == false){
		itemtext = make("span");
		itemtext.classList.add("item_text");
		itemtext.innerHTML = data.name;
		console.log(data);
		itemList.appendChild(itemtext);
	}else{
		itemtext = make("input");
		itemtext.classList.add("item_text_input","small");
		itemtext.value = data.name;
		itemtext.setAttribute('oninput', data.context + ".updateSelected()");
		itemList.appendChild(itemtext);
	}
	

	return itemList;
}


function setIndex(context, index, elm=undefined){
	context.selectedIndex = index;
	
	if(elm != undefined){
		let parent = elm.parentElement;
		let selectables = parent.getElementsByClassName("item_list_container selected");
		
		for(each of selectables){
			each.classList.remove("selected");
		}
		elm.classList.add("selected");
		
	}
	
}


const groupEditor =  {
	itemTemplate: {
		
		'name': 'Group #',
		'type': 'default',
		'column_count': 1,
		'row_view': false,
		'id': "xx-xxx-xxx",
		
	},
	
	selectedIndex: 0,
	items : [{
		
		'name': 'Group 1',
		'type': 'default',
		'column_count': 1,
		'row_view': false,
		'id': "g_ff8f2edb-4d8c-4a99-b477-29e4fe512fbb" //sample
	},
	{
		
		'name': 'Group 2',
		'type': 'sliding',
		'column_count': 1,
		'row_view': false,
		'id': "g_ff8f2edb-4d8c-4a99-b407-29e45e512fbb" //sample
		
	}
	
	], //populated with Sample Items
	
	saveItems: function(){
		formDatas.groups =  cloneSafe(this.items);
		loadGroupList();
		try{
			loadForms();
		}catch(e){
			//--
		}
	},
	
	loadList: function(){
		let listCon = _("group_list_");
		listCon.innerHTML = "";
		//payload for the generator
		let data = {
			'context': 'groupEditor', //set to name of this root object
			'index': '',
			'text': '',
		};
		
		if(typeof(this.items) != "object"){
			return false;
		}
		
		for(z = 0; z < this.items.length; z++){
			data.index = z;
			data.name = this.items[z].name;
			let gen = genItemElmG(data);
			if(z == this.selectedIndex){
				gen.classList.add("selected");
			}
			listCon.appendChild(gen);
		}
		
		

	},
	
	//Updates the Fields when selecting an item from group list
	showSelection: function(){
		let selectedItem = this.items[this.selectedIndex];
		// console.log(selectedItem);
		_("type_tab_g").value = selectedItem.type;
		_("gcol_tab").value = selectedItem.column_count;
		_("rowed_check_group").checked = selectedItem.row_view;
		_("required_check_group").checked = selectedItem.required_check;
		_("defaultpage_check_group").checked = selectedItem.defaultpage;
		this.togglePageOptions(_("type_tab_g"));
	},
	
	togglePageOptions: function(elm){
		if(elm.value == "paginated"){
			_("group_paginated_options_").style.removeProperty('display');
		}else{
			_("group_paginated_options_").style.display = "none";
		}
	},
	
	moveUpItem: function(){
		
		if(this.selectedIndex == undefined){return false }
		moveItemOrder(this.items, 'up', this);
		this.loadList()
	},	
	moveDownItem: function(){
		
		if(this.selectedIndex == undefined){return false }
		moveItemOrder(this.items, 'down', this);
		this.loadList()
	},
	
		
	addItemMenu: function(){
		let numcount = this.items.length;
		let newItem = cloneSafe(this.itemTemplate);
			newItem.name = "Group "+ (numcount+1);
			newItem.id = "g_"+ crypto.randomUUID();
		
		if(this.items == undefined){
			this.items = [];
		}
		
		this.items.push(newItem);
		this.loadList();
		_("group_list_").scrollTop = _("group_list_").scrollHeight;
	},
	removeItem: function(){
		let selected = this.selectedIndex;
		this.items.splice(selected,1);
		this.selectedIndex = undefined;
		this.loadList();
		
	},
	
	updateSelected: function(){
		let elm = (event.target);
		let ivalue = elm.value;
		this.items[this.selectedIndex].name = ivalue;
	},
	
	setInputType: function(){
		let elm = (event.target);
		let ivalue = elm.value;
		this.items[this.selectedIndex].type = ivalue;
		this.togglePageOptions(elm);
		
	},
	//Remove all defualtpage of groups property
	removeAllDefaultPage: function(ignore_current_id=undefined, target=undefined){
		let totalLen = formDatas.groups.length;
		let dataRef = formDatas.groups;
		
		
		if(target){
			totalLen = target.length;
			dataRef = target;
		}

		for(fg = 0; fg < totalLen;fg++){
			if(ignore_current_id == dataRef[fg].id){
				continue;
			}
			dataRef[fg].defaultpage = false;
		}
	},
	
	setInputValue: function(type=null){
		let elm = (event.target);
		let ivalue = elm.value;
		if(type == "col"){
			this.items[this.selectedIndex].column_count = ivalue;
		}else if(type == "row"){
			this.items[this.selectedIndex].row_view = elm.checked;
		}else if(type == "required_check"){
			this.items[this.selectedIndex].required_check = elm.checked;
		}else if(type == "defaultpage"){
			this.removeAllDefaultPage(undefined, this.items);
			this.items[this.selectedIndex].defaultpage = elm.checked;
			
			//assign first group as def page if no def page is removed
			if(!elm.checked){
				let firstGroupSelected = this.items.filter(obj => obj.type === "paginated");
				firstGroupSelected[0].defaultpage = true;
				console.log(firstGroupSelected);
			}
			
		}else{
			return false;
		}
		
	},
	
	setItems: function(list=undefined,listener=undefined){
		try{
			this.items = cloneSafe(formDatas.groups);
			
		}catch(e){
			//--
		}
	},
	
}


//removing an input form
function removeItemOption(context){
	let userRresponse = window.confirm("Are you sure to remove this input item? \nThis can't be undone.");
	
	if(userRresponse){
		context.removeItem();
	}

	
}





//Move form item up or down
function moveItemOrder(array,dir=undefined,context,retainIndex=false){
	if(array == null || dir == undefined){
		console.warn("Array and dir cannot be null values!");
		return false;
	}
	
	let currentIndex = context.selectedIndex;
	let arrs = array;
	if((currentIndex <= 0 && dir == 'up')|| (currentIndex+1 >= arrs.length && dir == 'down')){
		return;
	}
	
	if(dir == 'down'){
		arraymove(arrs, currentIndex, currentIndex+1);
		if(!retainIndex){context.selectedIndex = currentIndex + 1};
	}else{
		arraymove(arrs, currentIndex, currentIndex-1);
		if(!retainIndex){context.selectedIndex = currentIndex - 1};
	}
	


}


//Setting Values Helper

function setValues(id,values,attributes, readonly){
	//Dynamically put/update value to appro. types
	
	_(id).value = values;
	
	if(attributes.type == "checkboxes"){
		showGroupChecksValue(id,values);
	}else if(attributes.type == "table"){
		showTableGroupValue(id,values);
	}else if(attributes.type == "file"){
		showFilesValue(id,values,undefined, readonly);
	}else{
		_(id).value = values;
	}
	
	

}

// File Uploads Functions
let fileUploaders = {
	uploadListener: undefined, //Set to a function, which will get envoked everytime the upload is called from file pickers
	allowUpload: true,
	fileRemoveListener: undefined, //Set to a function, which will get envoked everytime the an uploaded file is removed successfully
	
	//uploader function
	uploadFiles: function(fileInputId, gid) {
		if(FILEUPLOAD_SERVER == undefined || FILEUPLOAD_SERVER == null){
			return console.error("FILEUPLOAD_SERVER is: ", FILEUPLOAD_SERVER, "it should be set first to your server link!");
		}
		
		if(!this.allowUpload){
			console.warn("Uploading is not allowed!");
					
			try{
				let uploadEvent = {
					formId: gid,
					inputId: fileInputId,
					type: "halt",
					
				};
					
				this.uploadListener(uploadEvent);
			}catch(e){
				//--
			}
		
			
			return false;
			
		}
		
		
		let uploadEvent = {
			formId: gid,
			inputId: fileInputId,
			type: "start",
			
		};
		
		
		var fileInput = document.getElementById(fileInputId);
		var files = fileInput.files;
		var formData = new FormData();
		
		let old_files = (_(gid).value);
			formData.append('old_files', old_files);
		for (var i = 0; i < files.length; i++) {
			formData.append('files[]', files[i]);
		}
		var xhr = new XMLHttpRequest();
		xhr.open('POST', FILEUPLOAD_SERVER, true);
		
		try{
			this.uploadListener(uploadEvent);
		}catch(e){
			//--
		}
		
		
		// Event listener for the upload progress
		xhr.upload.onprogress = function(e) {
			if (e.lengthComputable) {
				
				try{
					var percentComplete = (e.loaded / e.total) * 100;
					var progressBar = document.getElementById("progress_mon_"+gid);
					progressBar.classList.remove("hide_progress");
					
					let progsLine = progressBar.getElementsByClassName('progress_bar')[0];
					
					progsLine.style.width = percentComplete + '%';
					// progsLine.textContent = Math.round(percentComplete) + '%';
					
					
				}catch(e){
					//---
				}
				
			}
		};
		// Event listener for the response from the server
		xhr.onload = function() {
			if (xhr.status == 200) {
				console.log('Upload complete:', JSON.parse(xhr.responseText));
				
				
				_(gid).value = xhr.responseText;
				showFilesValue(gid, _(gid).value);
				try{
					let uploadFin = {
						filesname: JSON.parse(xhr.responseText), 
						type: "finished",
					};
		
					fileUploaders.uploadListener(uploadFin);
				}catch(e){
					console.log(e);
					//--
				}
				
				// Handle the server response here
			} else {
				
				try{
					let uploadFin = {
						'message': JSON.parse(xhr.responseText), 
						'type': "error",
					};
		
					fileUploaders.uploadListener(uploadFin);
				}catch(e){
					console.log(e);
					//--
				}
				
				console.error('Error uploading files:', xhr.statusText);
				// Handle errors here
			}
		};
		xhr.onerror = function() {
			console.error('Error during the upload process.');
		};
		// Send the form data with the files
		xhr.send(formData);
	},
	
	
	//Uploaded File remove
	removeUploaded: function (srcEl, id,index){
	
		let selectedFilename = JSON.parse(_(id).value)[index];
		
		let confirmDelete = window.confirm("Are you sure to remove the uploaded content?");
		if(!confirmDelete){
			return;
		}
		
		deleteFile(selectedFilename, index);
		
		function deleteFile(filename, index) {
			// Create a new XMLHttpRequest object
			var xhr = new XMLHttpRequest();
			// Define the endpoint URL to send the request to
			var url = FILEREMOVE_SERVER;
			// Create a FormData object to append the filename
			var formData = new FormData();
			formData.append('filename', filename);
			// Configure the request
			xhr.open('POST', url, true);
			// Set the event handler to handle the response
			xhr.onreadystatechange = function () {
				if (xhr.readyState === XMLHttpRequest.DONE) {
					if (xhr.status === 200) {
						// Request was successful, do something if needed
						console.log('File deleted successfully!');
						
						removeValueOnPicker(index);
						
						let datas = {
							'name': filename,
							'type': "delete",
						}
						
						try{
							fileUploaders.fileRemoveListener(datas);
						}catch(e){
							//---
						}
						
					} else {
						// Request failed, handle error
						console.error('Error deleting file:', xhr.responseText);
					}
				}
			};
			// Send the request with the FormData object as payload
			xhr.send(formData);
		}
			
		function removeValueOnPicker(index){
			let fileNames = JSON.parse(_(id).value);
				fileNames.splice(index,1);
			_(id).value = JSON.stringify(fileNames);
			formMaker.retriveFormInput();
			showFilesValue(id, _(id).value)
			
		}
		
		
	},
	
	
	//Changes to specific file Picker handler
	handleChange: function(elm,data=undefined){
		
		let parentElement = elm.parentNode;
		let upButton = parentElement.getElementsByClassName('upload_button')[0];
			upButton.classList.remove('uploader_hidden');		
			
		let clButton = parentElement.getElementsByClassName('clear_button')[0];
			clButton.classList.remove('uploader_hidden');
			
			
		let maxOf = parseInt(elm.max);
		
		if (isNaN(maxOf)) {
			// If max isn't a number, do nothing more
			return;
		}

		// Check if the number of selected files exceeds max allowed files
		if (elm.files.length > maxOf && maxOf > 0) {
			// If more files are selected than allowed, handle accordingly
			const dt = new DataTransfer();
			for (let i = 0; i < maxOf; i++) {
				dt.items.add(elm.files[i]);
			}
			elm.files = dt.files; // Set the input's files to the first `maxOf` files

			// Optionally, alert the user
			alert('You can only select up to ' + maxOf + ' files.');
		}
		
		if(elm.getAttribute("siganturetype") == "true"){
			let parentElement = elm.parentNode;
			let dropZone = parentElement.getElementsByClassName('customPrevElm ')[0];
			
			if(data != undefined){
				let imageCon = make("div");
				let sigImage = make("img");
					sigImage.src = data.image;
					
					imageCon.classList.add("preview_signature_container");
					imageCon.appendChild(sigImage);
					
					dropZone.innerHTML = "";
					dropZone.appendChild(imageCon);

				
			}else{
				dropZone.innerHTML = 'Added ' +  elm.files.length + " Signature";
			}
			
			
		}
		
			
	},
	
	
	clearFiles: function(elm){
		_(elm).value = null;
		
		let parentElement = _(elm).parentNode;
		let dropZone = parentElement.getElementsByClassName('customPrevElm ')[0];
			dropZone.innerHTML = 'Drop Files or Click Here';	
		
		if(_(elm).getAttribute("siganturetype") == "true"){
			dropZone.innerHTML = 'Click to Open Signature Pad';	
			_(elm).removeAttribute("rawdata");
		}
			
			
	},
	
	setupDragAndDrop: function(fileViewId, hiddenInputId) {
		var fileInput = hiddenInputId;
		var dropZone = fileViewId;

		dropZone.addEventListener('click', function () {
			fileInput.click();
		});

		dropZone.addEventListener('dragover', function (e) {
			e.preventDefault();  // Prevent default behavior (Prevent file from being opened)
			dropZone.classList.add('active');
		});

		dropZone.addEventListener('dragleave', function (e) {
			e.preventDefault();
			dropZone.classList.remove('active');
		});

		dropZone.addEventListener('drop', function (e) {
			e.preventDefault();
			dropZone.classList.remove('active');
			
			if (e.dataTransfer.files.length) {
				
			if (fileInput.multiple) {
				let dt = new DataTransfer();  
				let files = e.dataTransfer.files;  // Get files from the drag event
				let maxFiles = parseInt(fileInput.max) || files.length;  // Max files allowed or all files if no max
				let accept = fileInput.accept.split(',').map(type => type.trim());  // Split and trim the accept types

				for (let i = 0, added = 0; i < files.length && added < maxFiles; i++) {
					let file = files[i];
					if (accept.some(type => file.type === type || file.name.endsWith(type))) {
						dt.items.add(file);
						added++;
					}
				}
				
				fileInput.files = dt.files;  // Set the files to the input
			} else {
				let dt = new DataTransfer();  
				let files = e.dataTransfer.files;  // Get files from the drag event
				let accept = fileInput.accept.split(',').map(type => type.trim());  // Split and trim the accept types

				if (files.length > 0 && (accept.some(type => files[0].type === type || files[0].name.endsWith(type)))) {
					dt.items.add(files[0]);  // Add only the first file if it matches the accept criteria
					fileInput.files = dt.files;
				}
			}

						
				// Update the display with the number of files
				dropZone.innerHTML = `${fileInput.files.length} file(s) selected`;

				// Handle file processing or other operations
				fileUploaders.handleChange(hiddenInputId);
				console.log(fileInput.files);
			} else {
				dropZone.innerHTML = "Click or Drag Files here";
			}
		});

		fileInput.addEventListener('change', function () {
			// update the display with the file name if needed
			if (fileInput.files.length) {
				console.log("Files selected: ", fileInput.files);
				fileUploaders.handleChange(hiddenInputId);
				dropZone.innerHTML = `${fileInput.files.length} file(s) selected`;

			}
		});
	},
	
	setupSignature: function(fileViewId, hiddenInputId){
		
		fileViewId.addEventListener('click', function () {
			
			signatureHandles.targetFileElement = hiddenInputId;
			let data = hiddenInputId.getAttribute("rawdata");
			
			showSignaturePad(data);
		});
		
		
	},
	
}


let eventEditor = {
	events: {},
	saved: undefined,
	listenerFunction: undefined,
	condition: "=",
	
	eventTemplate: {
		'eventname': '',//uuid
		'type': '',
		'targetIndex': 0, //index of the target input
		'value': undefined,
	},
		
		
	loadList: function(){
		let inputlistCon = _("event_input_");
			inputlistCon.innerHTML = "";
			loadFormListtoSelector();
		let inputActions = _("event_input_type_");
		let valueSelector = _("event_value_select_");
			valueSelector.innerHTML = "";
		let valueRaw = _("event_value_raw_");
		let condition = _("event_condition_select_") ? _("event_condition_select_"): undefined;
		
		inputlistCon.value = this.events.targetIndex;
		inputActions.value = this.events.type;
		let targetInput = formDatas.forms[this.events.targetIndex];
		try{
			if(targetInput.type == "select"){
				this.loadValuesofSelected();
			}			
		}catch(e){
			//--
		}

		if(condition != undefined){
			condition.value = this.events.condition;
			
		}

		valueRaw.value = this.events.value||"";
		valueSelector.value = this.events.value;
		
		//payload for the generator
		let data = {
			'context': 'eventEditor', //set to name of this root object
			'index': '',
			'text': '',
		};
		
	},
	
	showEditor: function(){
		this.loadList();
		_("form_event_editor_modal").classList.remove('hidden');
		addFancyPlaceholder(); //should have optional array of elements soon for performance improvemnt.
		
	},
	
	
	setItems: function(events=undefined,listener=undefined){
		if(events != undefined){
			this.events = cloneSafe(events);
		}else{
			try{				
				this.saved = undefined;
				this.events = cloneSafe(this.eventTemplate);
				
				this.events.eventname = "ev_"+crypto.randomUUID();
				
			}catch(e){
				//--
			}
		}
		
		if(listener){
			this.listenerFunction = listener;
		}else{
			this.listenerFunction = undefined;
		}
		
	},
	
		
	
	saveItems: function(){
		let inputlistCon = _("event_input_");
		let inputActions = _("event_input_type_");
		let valueSelector = _("event_value_select_");
		let valueRaw = _("event_value_raw_");
		let condition = _("event_condition_select_") ? _("event_condition_select_") : undefined;
		
		this.events.targetIndex = inputlistCon.value;
		this.events.type = inputActions.value;
		
		if(valueSelector.value != ''){
			this.events.value = valueSelector.value;
		}else{
			this.events.value = valueRaw.value;
		}
		
		if(condition != undefined && condition.value != " "){
			this.events.condition = condition.value;
		}else{
			this.events.condition = "=";
		}
		
		this.saved = cloneSafe(this.events);
		try{
			if(this.listenerFunction){
				this.listenerFunction();
			}
		}catch(e){
			//-
		}
	},
	
	getItems: function(){
		if(this.saved == undefined){
			return false;
		}
		return cloneSafe(this.saved);
	},
	
	loadValuesofSelected: function(){
		let index = parseInt(_("event_input_").value);
		
		
		if(formDatas.forms[index].type == "select"){
			loadValueListtoSelector(undefined, index);
		}else{
			 _("event_value_select_").innerHTML = "<option disabled>-- Select a value to Monitor --</option>";
		}
			
			
	},
	
}

function loadFormListtoSelector(selected=undefined){
	let input_selector = _("event_input_");
		input_selector.innerHTML = "";
		
		
		let opts = make("option");
			opts.innerText = "-- Select Input --";
			opts.setAttribute("disabled","");		
			input_selector.appendChild(opts);
			
		let optsNo = make("option");
			optsNo.innerText = "-- None --";
			optsNo.value = "none";
			// optsNo.setAttribute("selected","");
			input_selector.appendChild(optsNo);
				
	let extID = 0;
	for(each of formDatas.forms){
		
		let opt = make("option");
		opt.value = extID;
		opt.innerText = each.label + " ("+each.type+")";
		extID++;
		
		if(each.type == "header"){
			continue; //Escape header types
		}
		
		if(selected == extID){
			opt.setAttribute("selected","");
		}
		input_selector.appendChild(opt);
		
	}
}

function loadValueListtoSelector(selected=undefined,index){
	let input_selector = _("event_value_select_");
		input_selector.innerHTML = "";
	let selectedEl = _(formDatas.forms[index].id);
	input_selector.innerHTML = "<option disabled>-- Select a value to Monitor --</option>"+selectedEl.cloneNode(3).innerHTML;
}


// ======================
// AdvancedEditor Section
// ======================
let configForCodeMirror = {
            lineNumbers: true, // Show line numbers
            mode: "javascript", // Specify syntax highlighting
            theme: "dracula" // Set the Dracula theme
	}

try{
	var areaEditorAdvanced = CodeMirror.fromTextArea(_('area_editor'), configForCodeMirror);
	
}catch(e){
	// console.error("codeMirror is not available yet...");
}


let advancedEditor = {
	
	showEditor: function(){
		_('advanced_editor_modal').classList.remove("hidden");
		let editor = _('area_editor');
		let dataFromEditor = formEditor.saveFormInput(); //lets us load whatever changes was made also from the editor
		
		
		editor.value = JSON.stringify(dataFromEditor, undefined,4);
		areaEditorAdvanced.setValue(JSON.stringify(dataFromEditor, undefined,4));
		
		
	},	
	
	closeEditor: function(){
		_('advanced_editor_modal').classList.add("hidden");
		_('area_editor').innerHTML = "";
		
		
	},
	
	saveForm: function(){
		let editor = _('area_editor');
		let data;
		try {
			data = JSON.parse(areaEditorAdvanced.getValue()); // Parse the content of the textarea
			// console.log("Parsed JSON:", data); // Log the parsed object for verification
		} catch (e) {
			alert("Invalid JSON: " + e.message); // Alert with an error message
			return; // Exit the function in case of an error
		}
		
		formDatas.forms[selectedInputIndex] = data;
		formEditor.loadFormInput(data);
		this.closeEditor();
		
		
	}
	
	
	
	
	
	
}

function toggleView(id){
	let elmCheck = (event.target.checked);
	elmCheck ? _(id).classList.remove("hidden") : _(id).classList.add("hidden");
	
	
}





// ======================
// AdvancedEditor Section End
// ======================




// ==========================
// Signature Pad Extra Section
// ==========================



const signatureFormModal = 
"<div class=\"df_formeditor_con_main hidden\" id=\"signature_form_modal\" style=\"z-index:25;\">" +
    "<div class=\"df_formeditor_con primary_background primary_color signature_editor_body\">" +
        "<div class=\"row_dev_con\">" +
            "<div class=\"normal primary_color header_title center_text\">Signature Pad </div>" +
        "</div>" +
        "<div class=\"row_dev_con\">" +
            "<div class=\"list_container_pane signature_body_con\" id=\"sigpadcons\">" +
                "<!-- Signature Canvas Goes Here -->" +
                "<canvas id=\"signature_pad_df_\" class=\"sig_file_canvas\"></canvas>" +
            "</div>" +
        "</div>" +
        "<div class=\"row_dev_con flexed center_text faded primary_color_faded small\"> Sign Above </div>" +
        "<div class=\"row_dev_con\">" +
            "<div class=\"formOptionsList\">" +
                "<button class=\"df_button_flat fa fa-eraser primary_color primary_background\" " +
                    "onclick=\"signaturePad.clear()\" " +
                    "title=\"Clear Entire Pad (Undo is also cleared).\"> " +
                "</button>" +
                "<button onclick=\"signatureHandles.undo()\" " +
                    "class=\"df_button_flat primary_color fa fa-undo primary_background\" " +
                    "title=\"Undo Stroke\"> " +
                "</button>" +
                "<button onclick=\"signatureHandles.redo()\" " +
                    "class=\"df_button_flat primary_color fa fa-undo fa-flip-horizontal primary_background\" " +
                    "title=\"Redo Stroke\"> " +
                "</button>" +
            "</div>" +
        "</div>" +
        "<div class=\"row_dev_con\">" +
            "<button class=\"df_button secondary_background primary_color_invert small\" " +
                "onclick=\"signatureHandles.saveItem();closeEditor('signature_form_modal');\">" +
                "<span class=\"fa fa-check\"> </span> Okay" +
            "</button> " +
            "<button class=\"df_button_flat primary_background_darker primary_color small\" " +
                "onclick=\"closeEditor('signature_form_modal');\">" +
                "<span class=\"fa fa-close\"> </span> Cancel" +
            "</button>" +
        "</div>" +
    "</div>" +
"</div>";

//init signature pad modal if none
function initSignaturePad(){
	if(_('signature_form_modal') == null || _('signature_form_modal') == undefined){
		
		let node = 	stringToHTMLNode(signatureFormModal);
		document.body.appendChild(node);
	
		function stringToHTMLNode(htmlString) {
			const template = document.createElement('template');
			template.innerHTML = htmlString.trim(); // trim() to remove any extra spaces
			return template.content.firstChild;
		}
	}
}

initSignaturePad();

const sigCanvas = _("signature_pad_df_");
const signaturePad = new SignaturePad(sigCanvas);


function resizeSigCanvas_() {
  // When zoomed out to less than 100%, for some very strange reason,
  // some browsers report devicePixelRatio as less than 1
  // and only part of the canvas is cleared then.
  var ratio =  Math.max(window.devicePixelRatio || 1, 1);

  // This part causes the canvas to be cleared
  sigCanvas.width = sigCanvas.offsetWidth * ratio;
  sigCanvas.height = sigCanvas.offsetHeight * ratio;
  sigCanvas.getContext("2d").scale(ratio, ratio);


  signaturePad.fromData(signaturePad.toData());
}

// On mobile devices it might make more sense to listen to orientation change,
// rather than window resize events.
window.onresize = resizeSigCanvas_;
resizeSigCanvas_();
let undoData = [];

signaturePad.addEventListener("endStroke", () => {
  // clear undoData when new data is added
  undoData = [];
});


let signatureHandles = {
	
	targetFileElement: undefined,
	
	saveItem: function(){
		if(this.targetFileElement == undefined){
			return false;
		}	
		
		let sourceFile = signaturePad.toDataURL(); // This is the DataURL from the signaturePad
		let blob = dataURLtoBlob(sourceFile);
		let file = new File([blob], "signature.png", { type: "image/png" });
		
		let dt = new DataTransfer();  

		dt.items.add(file);  // Add only the first file
		this.targetFileElement.files = dt.files;
		this.targetFileElement.setAttribute('rawdata',JSON.stringify(signaturePad.toData()));
		
		let data = {
			"image": sourceFile,
			"type": "signature",
		}

		fileUploaders.handleChange(this.targetFileElement, data);
		
		
		function dataURLtoBlob(dataURL) {
			const byteString = atob(dataURL.split(',')[1]);
			const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
			const ab = new ArrayBuffer(byteString.length);
			const ia = new Uint8Array(ab);
			for (let i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}

			return new Blob([ab], { type: mimeString });
		}
		
	},
	
	redo: function(){
		if (undoData.length > 0) {
		const data = signaturePad.toData();
		data.push(undoData.pop());
		signaturePad.fromData(data);
	  }
	},
	
	undo: function(){
		const data = signaturePad.toData();
		
		if (data && data.length > 0) {
		// remove the last dot or line
		const removed = data.pop();
		undoData.push(removed);
		signaturePad.fromData(data);
	  }
			
	}
	
	
};

function showSignaturePad(data=undefined){
		if(data == undefined){
			signaturePad.clear();
		}
		
		try{
			signaturePad.clear();
			let ragSigData = JSON.parse(data);
			signaturePad.fromData(ragSigData);
			
		}catch(e){
			//---
		}
		
		_("signature_form_modal").classList.remove("hidden");
		resizeSigCanvas_();
}





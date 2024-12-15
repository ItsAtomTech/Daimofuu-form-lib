// Others

function addFancyPlaceholder(){
	let allLabels = document.getElementsByClassName('placeholder_label');	
	for(each of allLabels){	
		let targetInput = each.getAttribute('for');			
		try{
			let thisinput = document.getElementById(targetInput);
			// console.log(thisinput);
			thisinput.addEventListener('focus',focusPlaceholder);
			thisinput.addEventListener('focusout',focusPlaceholder);
			if(thisinput.value.length > 0){	//Auto focus class on filled forms already
				each.classList.add('infocus');
			}else{
				each.classList.remove('infocus');
			}			
		}catch(e){
			//-
			console.error(e, "Make sure that label placeholder has 'for' attribute assigned to the target input id: ", targetInput);
		}	
	}	
};
addFancyPlaceholder();

function focusPlaceholder(){
	let formtarget  = event.target;
	let idTag = (formtarget.getAttribute('id'));
	let labelPlaceholder = document.querySelector("[for="+idTag+"]");
	//Apply style to the label accordingly
	if(event.type == "focus"){
		labelPlaceholder.classList.add('infocus');
	}else if(event.type != "focus" && formtarget.value.length <= 0){
		labelPlaceholder.classList.remove('infocus');	
	};
	
}


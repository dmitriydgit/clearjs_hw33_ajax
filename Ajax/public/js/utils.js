"use strict";

class Utils{
	
	setInfo(obj){
		localStorage.setItem("userInfo" , JSON.stringify(obj))
	};
	getInfo(){
		return JSON.parse(localStorage.getItem("userInfo"));
	};
	setButtonDisabled(element){
		element.setAttribute( "disabled", "true");
		element.classList.remove("button-blue");
		element.classList.add("button-grey");
		element.setAttribute("data-toggle", "modal");
	};
	removeButtonDisabled(element){
		element.removeAttribute( "disabled");
		element.classList.remove("button-grey");
		element.classList.add("button-blue");
		element.removeAttribute("data-toggle");
	};
	hideAlertMsgs(obj){
		this.showHide1(obj);
	};
	showHide1(object){    
		for(var key in object) { 
				var key = key;
				var value = object[key]; 
				value.forEach(DOMElem => {
								DOMElem.classList.remove("show" , "hide");
								DOMElem.classList.add(key);
				})
		}
	};
	showHidePass(elem, type){                                          
		elem.setAttribute('type', type);
	};
}













/*
working archieve

"use strict";

class Utils{
	
	setUserDataAndState (obj) {
		localStorage.setItem ("userDataAndState" , JSON.stringify(obj));
		//localStorage.setItem ("email" , obj.email);
		//localStorage.setItem ("password" , obj.password);
		//localStorage.isGalleryInited = "0";
};
// refreshUserDataAndState(){
// 	localStorage.setItem ("userDataAndState" , JSON.stringify(this.userDataAndState));
// };
getUserDataAndState(){
	return JSON.parse(localStorage.getItem("userDataAndState"));
};

	showHide1(array){    
		array.forEach(object => { 
		for(var key in object) { 
				var key = key;
				var value = object[key]; 
				value.forEach(DOMElem => {
								DOMElem.classList.remove("show" , "hide");
								DOMElem.classList.add(key);
						})
				}
		})
	};
}
*/
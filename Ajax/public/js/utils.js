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
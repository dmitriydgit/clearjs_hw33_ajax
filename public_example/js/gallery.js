/* 
*  Схематическое изображение класса Галереи
*/

let BaseGallery = function () {	
	this.initComponent();
	this.list = null;
}

BaseGallery.prototype = {
	initComponent : function (){
		fetch("http://localhost:3000/cars").then(responce => responce.json())
            .then(data => {
				console.log(data);
				this.saveData(data);
                //return data;
            })   
	},
	saveData : function (data) {
		this.list = data;
	},

	updateItem : function () {
		fetch("http://localhost:3000/cars/5", options).then(responce => responce.json())
            .then(data => {
				this.initComponent();
            })

	}
}


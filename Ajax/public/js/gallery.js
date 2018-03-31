"use strict";
class BaseGallery {
	constructor(obj, validatorModule){	
		this.DOMElements = obj;
		this.validator = validatorModule;
		this.utils = utils;
    this.cardsLimit = 20;
    this.imageCounter = 0;
    this.readyDataForGallery = []; //массив подготовленных эл-в
    this.visibleData = []; //массив эл-в, которые есть на экране
		this.cardsIdAtBase = []; // для add
		this.objectFromresponse; // для edit
	}

	init(){ 
		this.refreshGallery();
		this.initListeners(); 
		};

	refreshGallery(){
		return fetch("http://localhost:3000/cars").then(response => response.json())
			.then(data => {
				console.log("response" , data);
				this.prepareData(data);
				this.biuldWholeGallery(data);
				this.refreshCardsIdAtBase();
				this.checkLimit(); 
				this.refreshCardsIdAtBase();

				console.log("readyDataForGallery" , this.readyDataForGallery)
				console.log("visibleData", this.visibleData)
				console.log("cardsIdAtBase" , this.cardsIdAtBase)
				console.log("objectFromresponse" , this.objectFromresponse)
				}) 
	}

	editGallery(url , params){
		 return fetch(url , params).then(response => console.log(response))
		.then(
			this.refreshGallery()
		) 
	};

	initListeners (){
			
			if(localStorage.isGalleryInited == "1"){
				return false;
			}
			this.DOMElements.addImgBtn.addEventListener("click", this.showFormForAdding.bind(this));
			this.DOMElements.addNewImgBtn.addEventListener("click", this.addImage.bind(this));
			this.DOMElements.resultBlock.addEventListener("click", this.showFormForEditing.bind(this));
			this.DOMElements.editBtn.addEventListener("click", this.editCard.bind(this));
			this.DOMElements.resultBlock.addEventListener("click", this.deleteImage.bind(this)); 
			this.DOMElements.sortBlock.addEventListener("change", this.sortGallery.bind(this));
	};
	
	showFormForAdding(event){
		if(event.target.classList.contains("edit") || event.target.id == "add-img"){
			this.clearFormForAdd();
			this.utils.showHide1([{"show" : [this.DOMElements.formForAdding]}]);
			this.utils.showHide1([{"hide" : [this.DOMElements.editBtn]}]);
		}
	};

	addImage (){
		let url = "http://localhost:3000/cars";
		let newName = 	this.nameFormat(this.DOMElements.newName.value);
		let newUrlForItem = this.urlFomat(this.DOMElements.newUrl.value);
		let newDescr = this.descriptionFormat(this.DOMElements.newDescription.value);
		let newDate = moment();
		let newId;
		
		// this.cardsIdAtBase.forEach(item => {
		// 	if(this.cardsIdAtBase.indexOf(item)  == -1){
		// 		newId = item;
		// 		return;
		// 	}
		// })
		for(let i = 0; i < 	this.cardsIdAtBase.length; i++){
			if(this.cardsIdAtBase.indexOf(i)  == -1){
				newId = i;
				break;
			}
		}			
		let params = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						"url": newUrlForItem,
						"name": newName,
						"id": newId,
						"params": {
								"status": true,
								"progress": 1
						},
						"description": newDescr,
						"date": newDate
					})
		};
		this.editGallery(url , params);
		this.utils.showHide1([{"hide" : [this.DOMElements.formForAdding]}]);
	};

	showFormForEditing(event){  //
		if(event.target.classList.contains("edit")){
				this.utils.showHide1([{"show" : [this.DOMElements.formForAdding]}]);
				this.utils.showHide1([{"hide" : [this.DOMElements.addNewImgBtn]}]);
				let url = `http://localhost:3000/cars/${event.target.closest(".gallery-card").id}`;
				fetch(url).then(response => response.json())
				.then(data => {
					this.fillFormForEdit(data);
					this.objectFromresponse = data;
				})
				.catch(function(error) {
					console.log(error);
				});
			};
	};

	fillFormForEdit(data){
		let response = data;
		this.DOMElements.newName.value = response.name;
		this.DOMElements.newUrl.value = response.url;
		this.DOMElements.newDescription.value = response.description;
	};

	editCard(event){
		event.preventDefault();
		let url = `http://localhost:3000/cars/${this.objectFromresponse.id}`;
		let newName = 	this.nameFormat(this.DOMElements.newName.value);
		let newUrlForItem = this.urlFomat(this.DOMElements.newUrl.value);
		let newDescr = this.descriptionFormat(this.DOMElements.newDescription.value);
		let id =	this.objectFromresponse.id;						

		let params = {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						"url": newUrlForItem,
						"name": newName,
						"id": id,
						"params": {
								"status": true,
								"progress": 1
						},
						"description": newDescr,
						"date": moment()
					})
		};
		this.editGallery(url , params);
		this.utils.showHide1([{"hide" : [this.DOMElements.formForAdding]}]);
	};

	deleteImage(event){
		if(event.target.classList.contains("btn-danger")){
			let url = `http://localhost:3000/cars/${event.target.closest(".gallery-card").id}`;
			let params = {
				method: 'DELETE',
				headers: {
							'Content-Type': 'application/json'
						},
				};
				this.editGallery(url , params);
		}
	};
	
	prepareData (data) {
			
			this.DOMElements.sortBlock.value = localStorage.sortMethod ? localStorage.sortMethod : "0";
			this.readyDataForGallery = data.map((item, index) => {                 
				return {
									url: item.url,
									name: item.name,
									description: item.description,
									date: item.date,
									//id: "card_" + index,
									itemID: item.id
									}
			});
			this.visibleData.push.apply(this.visibleData,	this.readyDataForGallery);
	};
	
	biuldWholeGallery(){
				this.sortGallery ();
	};

	sortGallery (){
		switch (this.DOMElements.sortBlock.value) {
				case "0":
						this.visibleData.sort((a, b) => {
							if(a.name < b.name) return -1;
							if(a.name > b.name) return 1;
							return 0;
					});
						localStorage.setItem('sortMethod', '0');
						break;
				case "1":
						this.visibleData.sort((a, b) => {
							if(a.name < b.name) return -1;
							if(a.name > b.name) return 1;
							return 0;
					});
						localStorage.setItem('sortMethod', '1');
						break;
				case "2":
						this.visibleData.sort((a, b) => {
							if(a.name < b.name) return 1;
							if(a.name > b.name) return -1;
							return 0;
					});
						localStorage.setItem('sortMethod', '2');
						break;
				case "3":
						this.visibleData.sort((a, b) => {
							if(a.date < b.date) return 1;
							if(a.date > b.date) return -1;
							return 0;
					});
						localStorage.setItem('sortMethod', '3');
						break;
				case "4":
						this.visibleData.sort((a, b) => {
							if(a.date < b.date) return -1;
							if(a.date > b.date) return 1;
							return 0;
					});
						localStorage.setItem('sortMethod', '4');
						break;
		}
		this.reBuildGalleryAfterSort(this.visibleData);
	};

	reBuildGalleryAfterSort (visibleData){  // можно добавить в кач аргуменка readydataforgallery
		this.DOMElements.resultBlock.innerHTML = "";
		for (let i = 0; i < visibleData.length; i++) {    
				this.DOMElements.resultBlock.innerHTML += this.createGalleryItem(visibleData[i], i+1); //i +1 для номера изображения добавляет динамически						
		}
		this.imageCounter = visibleData.length;
		this.DOMElements.counter.innerHTML = this.imageCounter;
		this.DOMElements.backCounter.innerHTML = this.readyDataForGallery.length - this.imageCounter;
		
	};

	refreshCardsIdAtBase(){
		this.clearCardsIdAtBase();
		let cardsId = [];
		for(let j = 0; j < this.readyDataForGallery.length; j++){
			this.cardsIdAtBase.push(this.readyDataForGallery[j].itemID);
		}
		this.cardsIdAtBase.sort((a, b) => {
			if(a < b) return -1;
			if(a > b) return 1;
			return 0;
		})
	};
	
	createGalleryItem (item, index) {
			return `<div class="col-md-4 gallery-card" id = ${item.itemID}>
									<div class="card mb-4 box-shadow gallery-item" id = "${item.id}">
											<img src="${this.urlFomat(item.url)}" alt="${this.nameFormat(item.name)}" class="card-img-top" data-src="holder.js/100px225?theme=thumb&amp;bg=55595c&amp;fg=eceeef&amp;text=Thumbnail" data-holder-rendered="true" style="height: 225px; width: 100%; display: block;">
											<div class="card-body">
													<div class="card-text">${index}: ${this.nameFormat(item.name)}</div>
													<div class="text-muted top-padding">${this.descriptionFormat(item.description)}</div>
													<div class="text-muted">${this.dateFormat(item.date)}</div>
													<div class="btn-group">
														<button type="button" class="btn btn-outline-secondary">View</button>
														<button type="button" class="btn btn-outline-secondary edit">Edit</button>
													</div>
													<div  name = "delete-img" class = "btn btn-danger"  title = "Удалить данное изображение"> Удалить </div>
											</div>
											
									</div>
							</div>`;
	};
	nameFormat (name){
			return  name ? name[0].toUpperCase() + name.substring(1).toLowerCase() : "Lohn Doh";
	};
	urlFomat  (url){
			return  url.indexOf("http://") === -1 ? `http://${url}` :  url; 
	};
	descriptionFormat(descr){
			return (descr.length > 15 ) ? descr.substring(0 , 15) + "..." : descr;
	};
	dateFormat (date){
			let format = "YYYY/MM/DD HH:mm";
			return  (!date.isNaN) ? moment(date).format(format) : console.log("Error, data is incorrect") ;
	};
	
	checkLimit (){
			if (this.imageCounter < this.cardsLimit) {
					this.DOMElements.addImgBtn.removeAttribute( "disabled");
					this.DOMElements.addImgBtn.style.backgroundColor = "#337ab7";
					this.DOMElements.addImgBtn.removeAttribute("data-toggle");
			}
			if (this.imageCounter === this.cardsLimit) {
					this.DOMElements.addImgBtn.setAttribute( "disabled", "true");
					this.DOMElements.addImgBtn.style.backgroundColor = "grey";
					this.DOMElements.addImgBtn.setAttribute("data-toggle", "modal");
				}
	};
	clearFormForAdd(){
		this.DOMElements.newName.value = "";
		this.DOMElements.newUrl.value = "";
		this.DOMElements.newDescription.value = "";
	};
	clearGallery (){
			this.visibleData = [];
			this.deletedData = [];
			this.imageCounter  = 0;
			this.reBuildGalleryAfterSort(this.visibleData);
	};
	clearCardsIdAtBase(){
		this.cardsIdAtBase = [];
	};
}


const domsForGallery = {
	resultBlock:document.querySelector('#result'),
	sortBlock:document.querySelector("#type-selector"),
	counter:document.querySelector('#counter'),
	backCounter:document.querySelector('#back-counter'),
	modal:document.querySelector("#myModal"),
	addImgBtn: document.querySelector("#add-img"),
	formForAdding: document.querySelector("#form-add-new"),
	newName: document.querySelector("#new-name"),
	newUrl: document.querySelector("#new-url"),
	newDescription: document.querySelector("#new-descr"),
	newDate: document.querySelector("#new-date"),
	newStatus: document.querySelector("#new-params-status"),
	newProgress: document.querySelector("#new-params-progress"),
	addNewImgBtn: document.querySelector("#add-new-img"),
	editBtn: document.querySelector("#edit-img"),
	galleryCards : document.querySelectorAll(".gallery-card"),

};

const domsForValidator = {
	alertMsg : document.querySelector("#alert-massage1"), 
	notFilledEmailMsg : document.querySelector("#notFilledEmailMsg"),
	notFilledPassMsg : document.querySelector("#notFilledPassMsg"),
	wrongEmailMsg : document.querySelector("#wrongEmailMsg"),
	wrongPassMsg : document.querySelector("#wrongPassMsg")
};

let utils = new Utils();
let validatorModule = new Validator(domsForValidator);
let galleryModule = new BaseGallery(domsForGallery , validatorModule, utils);

// не реализовал подстановку пропущенного id при добавлении в базу
// добавлять и убирать кнопки по нажатии на  добавить и редактировать 

// полетела сортировка - доработать
//refreshCardsIdAtBase - теряет контекст. - упростить и избавится от list



// доработать showFormForEditing чтоб заполнялись поля++++++






//  let baseGallery = new BaseGallery();
//  baseGallery.init();   
/*
let ExtendedGallery = function() {
    BaseGallery.apply(this);
	this.DOMElements.addImgBtn = document.querySelector("#add-img");
}
ExtendedGallery.prototype = {
    initListeners : function (){
        if(localStorage.isGalleryInited == "1"){
            return false;
        }
        BaseGallery.prototype.initListeners.apply(this);
        this.DOMElements.addImgBtn.addEventListener("click", this.addImage.bind(this)); 
        this.DOMElements.resultBlock.addEventListener("click", this.deleteImage.bind(this));   
    },
    addImage : function(){
        this.prepearDataToAdd();
        this.sortGallery();
        
    },
    prepearDataToAdd : function(){
        if (this.deletedData.length == 0) {
            for (let item of this.readyDataForGallery) {
                if(this.visibleData.indexOf(item) === -1 ) {
                    this.visibleData.push(item);
                    break;
                }
            }
        }
        if (this.deletedData.length !== 0) {
            let temp;
            temp = this.deletedData.pop();
            this.visibleData.push(temp);
        }
    },
    findIndexWithId : function (id, array){
        let temp;
        array.forEach( elem => {
            if(elem.id === id) {
                temp = array.indexOf(elem);
            }
        })
        return temp;
    },
    deleteImage : function (event){
        let tempId,
          deletedItem,
          target = event.target;
        
          if (target.classList.contains("btn-danger")){
            tempId = target.closest(".gallery-item").id;
            deletedItem = this.visibleData[this.findIndexWithId(tempId, this.visibleData)];
            this.deletedData.push(deletedItem);
            this.visibleData.splice(this.visibleData.indexOf(deletedItem), 1);
            this.DOMElements.addImgBtn.disabled = false;
            this.reBuildGallery(this.visibleData);
            this.checkLimit();
        }
		},
		
	/*	deleteImage (event){
			let tempId,
				deletedItem,
				target = event.target;
			
				if (target.classList.contains("btn-danger")){
					tempId = target.closest(".gallery-item").id;
					deletedItem = this.visibleData[this.findIndexWithId(tempId, this.visibleData)];

					//удаление из базы

					this.deletedData.push(deletedItem);
					this.visibleData.splice(this.visibleData.indexOf(deletedItem), 1);
					this.DOMElements.addImgBtn.disabled = false;
					this.reBuildGallery(this.visibleData);
					this.checkLimit();
			}
		};
		prepearDataToAdd (){
			if (this.deletedData.length == 0) {
					for (let item of this.readyDataForGallery) {
							if(this.visibleData.indexOf(item) === -1 ) {
									this.visibleData.push(item);
									break;
							}
					}
			}
			if (this.deletedData.length !== 0) {
					let temp;
					temp = this.deletedData.pop();
					this.visibleData.push(temp);
			}
		};




*/







/*
working gallerymodule



// "use strict";
// class BaseGallery {
// 	constructor(obj, validatorModule){	
// 		this.DOMElements = obj;
// 		this.validator = validatorModule;
//     this.cardsLimit = 20;
//     this.imageCounter = 0;
//     this.readyDataForGallery = []; //массив подготовленных эл-в
//     this.visibleData = []; //массив эл-в, которые есть на экране
// 		this.deletedData = []; //массив удаленных эл-в
// 		this.cardsIdAtBase = [];
// 		this.list = null;
// 		this.objectFromresponse;
// }

		

//     init(){ 
// 			fetch("http://localhost:3000/cars").then(response => response.json())
// 			.then(data => {
// 				console.log(data);
// 				this.saveData(data); //не востребованы
// 				this.prepareData(data);
// 				this.biuldWholeGallery(data);
// 				this.refreshCardsIdAtBase();
// 				}) 
// 			this.initListeners(); 
			 
// 		/*
// 			updateItem () {
// 			fetch("http://localhost:3000/cars/5", options).then(response => response.json())
// 						.then(data => {
// 				this.initComponent();
// 						})
// 			};
// 		*/
// 	};     
// 	saveData (data) {
// 		this.list = data;
// 		};

// 	initListeners (){
// 		if(localStorage.isGalleryInited == "1"){
// 			return false;
// 	}
// 			this.DOMElements.sortBlock.addEventListener("change", this.sortGallery.bind(this));
// 			this.DOMElements.addImgBtn.addEventListener("click", this.showFormForAdding.bind(this)); 
// 			this.DOMElements.resultBlock.addEventListener("click", this.deleteImage.bind(this)); 
// 			this.DOMElements.addNewImgBtn.addEventListener("click", this.addImage.bind(this));
// 			this.DOMElements.editBtn.addEventListener("click", this.editCard.bind(this));
// 			this.DOMElements.resultBlock.addEventListener("click", this.showFormForEditing.bind(this));
// 			//this.DOMElements.addNewImgBtn.addEventListener("click", this.addImage.bind(this));
			
// 	};
	
// 	showFormForEditing(event){  //
// 		let array = [{"show" : [this.DOMElements.formForAdding]}];
// 		this.validator.showHide1(array);

// 		let url = `http://localhost:3000/cars/${event.target.closest(".gallery-card").id}`;
// 		fetch(url).then(response => response.json())
// 		.then(data => {
// 			console.log(data)
// 			this.fillInfoForEdit(data);
// 			this.objectFromresponse = data;
// 		})
// 		.catch(function(error) {
// 			console.log(error);
// 		});
// 	};

// 	fillInfoForEdit(data){
// 		let response = data;

// 		this.DOMElements.newName.value = response.name;
// 		this.DOMElements.newUrl.value = response.url;
// 		this.DOMElements.newDescription.value = response.description;
// 		this.DOMElements.newDate.value = response.date;
// 		this.DOMElements.newStatus.value = response.status;
// 		this.DOMElements.newProgress.value = response.progress;	



// 		/*
// 		date:""
// 		description:""
// 		id:2
// 		name:"lllll"
// 		params:{status: "", progress: ""}
// 		url:"desktopwallpapers.org.ua/mini/201507/40069.jpg" 
// 		*/




// 	}


// 	editCard(event){
// 		//this.showFormForAdding();
// 		event.preventDefault();
// 		let url = `http://localhost:3000/cars/${this.objectFromresponse.id}`;

// 		let newName = 	this.DOMElements.newName.value;
// 		let newUrlForItem = this.DOMElements.newUrl.value;
// 		let newDescr = this.DOMElements.newDescription.value;
// 		let newDate = this.DOMElements.newDate.value;
// 		let newStatus =	this.DOMElements.newStatus.value;
// 		let newProgress = this.DOMElements.newProgress.value;
// 		let id =	this.objectFromresponse.id;						

// 		let params = {
// 					method: 'PUT',
// 					headers: {
// 						'Content-Type': 'application/json'
// 					},
// 					body: JSON.stringify({
// 						"url": newUrlForItem,
// 						"name": newName,
// 						"id": id,
// 						"params": {
// 								"status": newStatus,
// 								"progress": newProgress
// 						},
// 						"description": newDescr,
// 						"date": moment()
// 					})
// 	};
// 	fetch(url , params).then(response => console.log(response))
// 	.then(
// 		fetch("http://localhost:3000/cars").then(response => response.json())
// 		.then(data => {
// 			console.log(data);
// 			this.saveData(data); 
// 			this.clearGallery();
// 			this.prepareData(data);
// 			this.biuldWholeGallery(data);
// 			this.refreshCardsIdAtBase();

			
// 			})

// 		) 
// 		let array = [{"hide" : [this.DOMElements.formForAdding]}];
// 		this.validator.showHide1(array);
		
// 		/*
// 		date:""
// 		description:""
// 		id:2
// 		name:"lllll"
// 		params:{status: "", progress: ""}
// 		url:"desktopwallpapers.org.ua/mini/201507/40069.jpg" 
// 		*/

// 	//	this.prepearDataToAdd();
// 	//	this.buildGallery();
// 	}




// 	prepareData (data) {// передать data
// 			this.DOMElements.sortBlock.value = localStorage.sortMethod ? localStorage.sortMethod : "0";
// 			this.readyDataForGallery = data.map((item, index) => {                 
// 				return {
// 									url: item.url,
// 									name: item.name,
// 									description: item.description,
// 									date: item.date,
// 									id: "card_" + index,
// 									itemID: item.id
// 									}
// 			});
			
// 	};
// 	biuldWholeGallery(){
// 	this.visibleData.push.apply(this.visibleData,	this.readyDataForGallery);
// 	//destinationArray.push.apply(destinationArray, sourceArray);
// 	this.sortGallery ();
// 	};

// 	refreshCardsIdAtBase(){
// 		let cardsIdAtBase = [];
// 		console.log(this.list);
// 		this.list.forEach(function(item){
// 			cardsIdAtBase.push(item.id);
// 		})
// 		this.cardsIdAtBase.push.apply(this.cardsIdAtBase,	cardsIdAtBase);
// 		this.cardsIdAtBase.sort((a , z) => {return a - z} )
// 		console.log(this.cardsIdAtBase);
// 	}

// 	showFormForAdding(event){
// 		if(event.target.classList.contains("edit") || event.target.id == "add-img"){

// 		this.clearFormForAdd();
			
// 		let array = [{"show" : [this.DOMElements.formForAdding]}];
// 		this.validator.showHide1(array);
// 		}
// 	}

// 	addImage (){
// 		let url = "http://localhost:3000/cars";

// 		let newName = 	this.DOMElements.newName.value;
// 		let newUrlForItem = this.DOMElements.newUrl.value;
// 		let newDescr = this.DOMElements.newDescription.value;
// 		let newDate = moment();
// 		let newStatus =	this.DOMElements.newStatus.value;
// 		let newProgress = this.DOMElements.newProgress.value;							
// 		let newId;
// 		for(let i = 1; i < 	this.cardsIdAtBase.length; i++){
// 			if(this.cardsIdAtBase.indexOf(i)  == -1){
// 				newId = i;
// 				break;
// 			}
// 		}			

// 		let params = {
// 					method: 'POST',
// 					headers: {
// 						'Content-Type': 'application/json'
// 					},
// 					body: JSON.stringify({
// 						"url": newUrlForItem,
// 						"name": newName,
// 						"id": newId,
// 						"params": {
// 								"status": newStatus,
// 								"progress": newProgress
// 						},
// 						"description": newDescr,
// 						"date": newDate
// 					})
// 	};
// 	fetch(url , params).then(response => response.json())
// 	.then(
// 		fetch("http://localhost:3000/cars").then(response => response.json())
// 		.then(data => {
// 			console.log(data);
// 			this.saveData(data); 
// 			this.clearGallery();
// 			this.prepareData(data);
// 			this.biuldWholeGallery(data);
// 			this.refreshCardsIdAtBase();
// 			})
// 		) 

// 		// this.prepearDataToAdd();
// 		// this.buildGallery();

// 		let array = [{"hide" : [this.DOMElements.formForAdding]}];
// 		this.validator.showHide1(array);

		
// 	};
	
// 	prepearDataToAdd (){
// 		if (this.deletedData.length == 0) {
// 				for (let item of this.readyDataForGallery) {
// 						if(this.visibleData.indexOf(item) === -1 ) {
// 								this.visibleData.push(item);
// 								break;
// 						}
// 				}
// 		}
// 		if (this.deletedData.length !== 0) {
// 				let temp;
// 				temp = this.deletedData.pop();
// 				this.visibleData.push(temp);
// 		}
// 	};
	
// 	buildGallery(){
// 		this.sortGallery ();
// 	}

// 	sortGallery (){
// 			switch (this.DOMElements.sortBlock.value) {
// 					case "0":
// 							this.visibleData.sort((a , b) => (a.name > b.name));
// 							localStorage.setItem('sortMethod', '0');
// 							break;
// 					case "1":
// 							this.visibleData.sort((a , b) => (a.name > b.name));
// 							localStorage.setItem('sortMethod', '1');
// 							break;
// 					case "2":
// 							this.visibleData.sort((a , b) => (a.name < b.name));
// 							localStorage.setItem('sortMethod', '2');
// 							break;
// 					case "3":
// 							this.visibleData.sort((a , b) => (a.date < b.date));
// 							localStorage.setItem('sortMethod', '3');
// 							break;
// 					case "4":
// 							this.visibleData.sort((a , b) => (a.date > b.date));
// 							localStorage.setItem('sortMethod', '4');
// 							break;
// 			}
// 			this.reBuildGallery(this.visibleData);
// 	};
// 	reBuildGallery (array){
// 			this.DOMElements.resultBlock.innerHTML = "";
// 			for (let i = 0; i < array.length; i++) {    
// 					this.DOMElements.resultBlock.innerHTML += this.galleryItem(array[i], i+1); //i +1 для номера изображения добавляет динамически						
// 			}
// 			this.imageCounter = array.length;
// 			this.DOMElements.counter.innerHTML = this.imageCounter;
// 			this.DOMElements.backCounter.innerHTML = this.readyDataForGallery.length - this.imageCounter;
// 			this.checkLimit(); 
// 	};
// 	galleryItem (item, index) {
// 			return `<div class="col-md-4 gallery-card" id = ${item.itemID}>
// 									<div class="card mb-4 box-shadow gallery-item" id = "${item.id}">
// 											<img src="${this.urlFomat(item.url)}" alt="${this.nameFormat(item.name)}" class="card-img-top" data-src="holder.js/100px225?theme=thumb&amp;bg=55595c&amp;fg=eceeef&amp;text=Thumbnail" data-holder-rendered="true" style="height: 225px; width: 100%; display: block;">
// 											<div class="card-body">
// 													<div class="card-text">${index}: ${this.nameFormat(item.name)}</div>
// 													<div class="text-muted top-padding">${this.descriptionFormat(item.description)}</div>
// 													<div class="text-muted">${this.dateFormat(item.date)}</div>
// 													<div class="btn-group">
// 														<button type="button" class="btn btn-outline-secondary">View</button>
// 														<button type="button" class="btn btn-outline-secondary edit">Edit</button>
// 													</div>
// 													<div  name = "delete-img" class = "btn btn-danger"  title = "Удалить данное изображение"> Удалить </div>
// 											</div>
											
// 									</div>
// 							</div>`;
// 	};
// 	nameFormat (name){
// 			return  name ? name[0].toUpperCase() + name.substring(1).toLowerCase() : "Lohn Doh";
// 	};
// 	urlFomat  (url){
// 			return  url.indexOf("http://") === -1 ? `http://${url}` :  url; 
// 	};
// 	descriptionFormat(descr){
// 			return (descr.length > 15 ) ? descr.substring(0 , 15) + "..." : descr;
// 	};
// 	dateFormat (date){
// 			let format = "YYYY/MM/DD HH:mm";
// 			return  (!date.isNaN) ? moment(date).format(format) : console.log("Error, data is incorrect") ;
// 	};
// 	print (data){
// 			console.log(data);
// 	};
	
// 	checkLimit (){
// 			if (this.imageCounter < this.cardsLimit) {
// 					this.DOMElements.addImgBtn.removeAttribute( "disabled");
// 					this.DOMElements.addImgBtn.style.backgroundColor = "#337ab7";
// 					this.DOMElements.addImgBtn.removeAttribute("data-toggle");
// 			}
// 			if (this.imageCounter === this.cardsLimit) {
// 					this.DOMElements.addImgBtn.setAttribute( "disabled", "true");
// 					this.DOMElements.addImgBtn.style.backgroundColor = "grey";
// 					this.DOMElements.addImgBtn.setAttribute("data-toggle", "modal");
// 			 }
// 	};
	
// 	clearFormForAdd(){
// 		this.DOMElements.newName.value = "";
// 		this.DOMElements.newUrl.value = "";
// 		this.DOMElements.newDescription.value = "";
// 		this.DOMElements.newDate.value = "";
// 		this.DOMElements.newStatus.value = "";
// 		this.DOMElements.newProgress.value = "";
// 	}

// 	clearGallery (){
// 			this.visibleData = [];
// 			this.deletedData = [];
// 			this.imageCounter  = 0;
// 			this.reBuildGallery(this.visibleData);
// 	};
// 	findIndexWithId (id, array){
// 		let temp;
// 		array.forEach( elem => {
// 				if(elem.id === id) {
// 						temp = array.indexOf(elem);
// 				}
// 		})
// 		return temp;
// 	};
	



// 	deleteImage(event){
// 	//	this.refreshCardsIdAtBase();
// 	if(event.target.classList.contains("btn-danger")){

// 		let url = `http://localhost:3000/cars/${event.target.closest(".gallery-card").id}`;
// 		let params = {
// 			method: 'DELETE',
// 			headers: {
// 						'Content-Type': 'application/json'
// 					},
// 			};

// 		fetch(url , params).then(response => response.json())
// 		.then(data => {
// 			console.log(data);
// 			this.saveData(data); 
// 			this.prepareData(data);
// 			this.biuldWholeGallery(data);
// 			}) 


// 		this.prepearDataToAdd();
// 		this.buildGallery();
// 		console.log(this.cardsIdAtBase);
// 	}
// }



// }



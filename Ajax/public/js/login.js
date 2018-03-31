"use strict";


// localStorage.userLoggedIn -- для перезагрузки страницы
// localStorage.isGalleryInited --   флаг для предотвращения дублирования листенеров в галерее


class LoginForm {
	constructor (validatorModule , galleryModule , obj , userInfo, utils ) {	
		this.validator = validatorModule;
		this.gallery = galleryModule;
		this.utils = utils;
		this.DOMElements = obj; 	
		this.showPassStatus = 0;
		this.userInfo = userInfo;
		this.user1;
	};

	initComponent () { 
			this.utils.setInfo(this.userInfo); // новый
			localStorage.isGalleryInited = "false";
			this.checkIfUserLoggedIn();    
			this.initListeners();
			this.initTooltips();
	};
	checkIfUserLoggedIn (){
			this.user1 = this.utils.getInfo();
			if(localStorage.isUserLoggedIn == "true"){
					this.showPersonPage();
					this.fillInputsOnUserPage(this.user1.email , this.user1.password);
					this.gallery.clearGallery(); 
					this.gallery.init();
			}
	};
	showPersonPage () {
			this.utils.showHide1({"show" : [this.DOMElements.gallery , this.DOMElements.personNavbar,
				this.DOMElements.backBtn]});
			this.utils.showHide1({"hide" :  [this.DOMElements.form]});	
			this.DOMElements.showGalleryBtn.classList.add("btn", "btn-outline-secondary");
			this.DOMElements.showUserDataBtn.classList.remove("btn", "btn-outline-secondary");
	};
	hidePersonPage (){
			this.utils.showHide1({"hide" : [this.DOMElements.personPage,
				this.DOMElements.gallery, 
				this.DOMElements.personNavbar,
				this.DOMElements.backBtn] 
			});
			this.utils.showHide1({"show" :  [this.DOMElements.form]});
	};
	initListeners () {
			this.DOMElements.form.addEventListener("keypress", this.initValidation.bind(this));
			this.DOMElements.submitBtn.addEventListener("click", this.validate.bind(this));	
			this.DOMElements.backBtn.addEventListener("click", this.goBack.bind(this));	
			this.DOMElements.togglePasswordBtn.addEventListener("click", this.togglePasswordOutput.bind(this));
			this.DOMElements.showGalleryBtn.addEventListener("click", this.showGalleryBlock.bind(this));	
			this.DOMElements.showUserDataBtn.addEventListener("click", this.showUserDataBlock.bind(this));	
	};
	fillInputsOnUserPage (inp , pass){
			this.DOMElements.personNameField.value = inp;    
			this.DOMElements.personPasswordField.value = pass;
	};
	initValidation (event){
			if(event.keyCode == 13) {
					this.validate();
			}
	};

	validate () {
		this.utils.hideAlertMsgs({"hide" : [this.DOMElements.alertMsg,
			this.DOMElements.notFilledEmailMsg, 
			this.DOMElements.notFilledPassMsg,
			this.DOMElements.wrongEmailMsg,
			this.DOMElements.wrongPassMsg]});
		let url = 'http://localhost:3000/login';
		let userData = {
			"login":`${this.DOMElements.email.value}`,
			"password":`${this.DOMElements.password.value}`
		}
		let params = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(userData)
		};

		let email = this.DOMElements.email.value;
		let password = this.DOMElements.password.value;
		let isFieldsChecked = this.validator.checkFields(email , password);

		fetch(url , params).then(response => response.json())
			.then(response => {
				console.log("response" , response);
				if(isFieldsChecked && response.status){   
					this.showPersonPage();
					this.fillInputsOnUserPage (email , password);
					this.gallery.init();
					localStorage.isUserLoggedIn = "true";
					this.utils.setInfo(this.user1);
				}  
		}) 
	};
	goBack () {
		this.hidePersonPage();
		this.gallery.clearGallery(); 
		this.fillStartPageUserData(); 
		localStorage.isUserLoggedIn = "false";
		localStorage.isGalleryInited = "true";
		this.user1.sortMethod = "0";
		this.utils.setInfo(this.user1);
	};
	fillStartPageUserData (){
		this.user1 = this.utils.getInfo();
		if (this.DOMElements.checkBoxRemememberMe.checked == true){
				this.DOMElements.email.value = this.user1.email;    
				this.DOMElements.password.value = this.user1.password;
		} else {
				this.DOMElements.email.value = "";
				this.DOMElements.password.value = "";
		}
  };
	togglePasswordOutput (event){
		if(this.showPassStatus === 0){
			this.showPassStatus = 1;
			this.utils.showHidePass(this.DOMElements.personPasswordField , "text");
			this.DOMElements.togglePasswordBtn.innerText = "Скрыть пароль";
		} else {
			this.showPassStatus = 0;
			this.utils.showHidePass(this.DOMElements.personPasswordField , "password");
			this.DOMElements.togglePasswordBtn.innerText = "Показать пароль";
		}
	};
  showGalleryBlock (){
				this.utils.showHide1({"hide" : [this.DOMElements.personPage]});
				this.utils.showHide1({"show" :  [this.DOMElements.gallery]});
        this.DOMElements.showGalleryBtn.classList.add("btn", "btn-outline-secondary");
        this.DOMElements.showUserDataBtn.classList.remove("btn", "btn-outline-secondary");
  };
	showUserDataBlock() {
			this.utils.showHide1({"show" : [this.DOMElements.personPage]});
			this.utils.showHide1({"hide" :  [this.DOMElements.gallery]});
			this.DOMElements.showUserDataBtn.classList.add("btn", "btn-outline-secondary");
			this.DOMElements.showGalleryBtn.classList.remove("btn", "btn-outline-secondary");
	};
	initTooltips (){
			$('[data-toggle="tooltip"]').tooltip(); 
	};
};



//1. пробовал запихнуть в обьект userInfo(в локалсторедж), не пошло. работает только когда можно обращатся на прямую и сохранять на прямую. с sortMethod тоже самое, но уже не трогал его. 








//2.  не реализовал подстановку пропущенного id при добавлении в базу в файле gallery стр 77   +++
//  от преподавателя на разборе получил выговор за то, что проверял пропущенный айди, но вот постман не согласен. пишет :
// Error: Insert failed, duplicate id  at Function.insert  (/home/dima/Документы/Clear_javascript_2018/hw33_Dubchenko_ajax/Ajax/node_modules/lodash-id/src/index.js:49:18)
//     ну и так далее....  ++






//  !!!! стр 123   залогинивает при неправильном логине!!!! проверить, реализовать что эта страка дождалась ответа от сервера   +++




 //domeelement не получается убрать из публичных свойств обьекта. --- надо переписывать все приложение

 





 
 // получилось научить showHide работать с массивом обьектов.  +++




//+++

// Один баг, с которым так и не справился. после нажатия на "выход" и после повторного входа
 //кнопка "Добавить изображение" добавляет сразу 2 картинки. Если выйти и войти еще
 // раз - 3 картинки одновременно. и тд.  это из-за того что при перезаходе листенер сработывает повторно... 
 // как этого избежать?+
/* 

*/





/*

Working archieve

"use strict";


// localStorage.userLoggedIn -- для перезагрузки страницы
// localStorage.isGalleryInited --   флаг для предотвращения дублирования листенеров в галерее


class LoginForm {
	constructor (validatorModule , galleryModule , obj) {	
		this.validator = validatorModule;
		this.gallery = galleryModule;
		this.DOMElements = obj; 	
		this.showPassStatus = 0;
		this.user = {email:"ddd@gmail.com", password:"12345678"};
	};

	initComponent () { 
			this.setLogAndPass(this.user);
			this.checkIfUserLoggedIn();    
			this.initListeners();
			this.initTooltips();
	};
	setLogAndPass (obj) {
			localStorage.setItem ("email" , obj.email);
			localStorage.setItem ("password" , obj.password);
			localStorage.isGalleryInited = "0";
	};
	checkIfUserLoggedIn (){
			if(localStorage.userLoggedIn == 1){
					this.showPersonPage();
					this.fillInputsOnUserPage(localStorage.email , localStorage.password);
					this.gallery.clearGallery(); 
					this.gallery.init();
			}
	};
	showPersonPage () {
			let array = [
					{"show" : [this.DOMElements.gallery , this.DOMElements.personNavbar,
					this.DOMElements.backBtn]},
					{"hide" :  [this.DOMElements.form]}
			]
			this.validator.showHide1(array);
			this.DOMElements.showGalleryBtn.classList.add("btn", "btn-outline-secondary");
			this.DOMElements.showUserDataBtn.classList.remove("btn", "btn-outline-secondary");
	};
	hidePersonPage (){
			let array = [
					{"hide" : [this.DOMElements.personPage,
											this.DOMElements.gallery, 
											this.DOMElements.personNavbar,
											this.DOMElements.backBtn] 
					},
					{"show" :  [this.DOMElements.form]}
			]
			this.validator.showHide1(array);
	};
	initListeners () {
			this.DOMElements.form.addEventListener("keypress", this.initValidation.bind(this));
			this.DOMElements.submitBtn.addEventListener("click", this.validate.bind(this));	
			this.DOMElements.backBtn.addEventListener("click", this.goBack.bind(this));	
			this.DOMElements.togglePasswordBtn.addEventListener("click", this.togglePasswordOutput.bind(this));
			this.DOMElements.showGalleryBtn.addEventListener("click", this.showGalleryBlock.bind(this));	
			this.DOMElements.showUserDataBtn.addEventListener("click", this.showUserDataBlock.bind(this));	
	};
	fillInputsOnUserPage (inp , pass){
			this.DOMElements.personNameField.value = inp;    
			this.DOMElements.personPasswordField.value = pass;
	};
	initValidation (event){
			if(event.keyCode == 13) {
					this.validate();
			}
	};

	validate () {
			this.validator.hideAlertMsgs();
			let url = 'http://localhost:3000/login';
			let userData = {
				"login":`${this.DOMElements.email.value}`,
				"password":`${this.DOMElements.password.value}`
			}
			let params = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(userData)
			};

			let email = this.DOMElements.email.value;
			let password = this.DOMElements.password.value;
			let isFieldsChecked = this.validator.checkFields(email , password);

			fetch(url , params).then(response => response.json())
				.then(response => {
					console.log("response" , response);
					if(isFieldsChecked && response.status){   
						this.showPersonPage();
						this.fillInputsOnUserPage (email , password);
						this.gallery.init();
						localStorage.userLoggedIn = "1";
					}  
				}) 

	};
	goBack () {
			this.hidePersonPage();
			this.gallery.clearGallery(); 
			this.fillStartPageUserData();   
			localStorage.setItem("userLoggedIn","0");
			localStorage.setItem("isGalleryInited" , "1");
			localStorage.setItem("sortMethod" , "0");
	};
	fillStartPageUserData (){
        if (this.DOMElements.checkBoxRemememberMe.checked == true){
            this.DOMElements.email.value = localStorage.email;    
            this.DOMElements.password.value = localStorage.password;
        } else {
            this.DOMElements.email.value = "";
            this.DOMElements.password.value = "";
        }
    };
	togglePasswordOutput (event){
		if(this.showPassStatus === 0){
			this.showPassStatus = 1;
			this.validator.showHidePass(this.DOMElements.personPasswordField , "text");
			this.DOMElements.togglePasswordBtn.innerText = "Скрыть пароль";
		} else {
			this.showPassStatus = 0;
			this.validator.showHidePass(this.DOMElements.personPasswordField , "password");
			this.DOMElements.togglePasswordBtn.innerText = "Показать пароль";
		}
	};
  showGalleryBlock (){
        let array = [
            {"hide" : [this.DOMElements.personPage]},
            {"show" :  [this.DOMElements.gallery]}
        ]
        this.validator.showHide1(array);
        this.DOMElements.showGalleryBtn.classList.add("btn", "btn-outline-secondary");
        this.DOMElements.showUserDataBtn.classList.remove("btn", "btn-outline-secondary");
    };
	showUserDataBlock() {
			let array = [
					{"show" : [this.DOMElements.personPage]},
					{"hide" :  [this.DOMElements.gallery]}
			]
			this.validator.showHide1(array);
			this.DOMElements.showUserDataBtn.classList.add("btn", "btn-outline-secondary");
			this.DOMElements.showGalleryBtn.classList.remove("btn", "btn-outline-secondary");
	};
	initTooltips (){
			$('[data-toggle="tooltip"]').tooltip(); 
	};
};









*/
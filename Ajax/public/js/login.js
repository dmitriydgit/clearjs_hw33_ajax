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





//  !!!! стр 123   залогинивает при неправильном логине!!!! проверить, реализовать что эта страка дождалась ответа от сервера   +++




 //domeelement не получается убрать из публичных свойств обьекта. --- надо переписывать все приложение

 





 
 // получилось научить showHide работать с массивом обьектов.  +++




//+++

// Один баг, с которым так и не справился. после нажатия на "выход" и после повторного входа
 //кнопка "Добавить изображение" добавляет сразу 2 картинки. Если выйти и войти еще
 // раз - 3 картинки одновременно. и тд.  это из-за того что при перезаходе листенер сработывает повторно... 
 // как этого избежать?+
/* 
*  Схематическое изображение класса Логин формы
*/
/*
let LoginForm = function (validatorModule, galleryModule) {	
	this.validator = validatorModule;
	this.gallery = galleryModule;
}

LoginForm.prototype = {

	initComponent : function (){
		// code
	},
	validateUserData : function (){
		this.validator.isValid();
	},

	showGallery: function(){
		this.gallery.init();
	}
}

*/




/*

/*
LoginForm.prototype = {

let LoginForm = function (validatorModule , galleryModule , obj) {	
	this.validator = validatorModule;
    this.gallery = galleryModule;
	const DOMElements = obj; 
    const showPassStatus = 0;
    const user = {email:"ddd@gmail.com", password:"12345678"};

    var setLogAndPass = function(obj) {
        localStorage.email = obj.email;
        localStorage.password = obj.password;
        localStorage.isGalleryInited = "0";
    };
    function checkIfUserLoggedIn(){
        if(localStorage.userLoggedIn == 1){
            showPersonPage();
            fillUserData(localStorage.email , localStorage.password);
            //this.gallery.clearGallery();  // to check
            this.gallery.init();
        }
    };
    function showPersonPage () {
        this.validator.showHide(DOMElements.gallery,"show");
        this.validator.showHide(DOMElements.personNavbar,"show");
        this.validator.showHide(DOMElements.backBtn,"show");
        this.validator.showHide(DOMElements.form, "hide");
        DOMElements.showGalleryBtn.classList.add("btn", "btn-outline-secondary");
        DOMElements.showUserDataBtn.classList.remove("btn", "btn-outline-secondary");
    };
    function hidePersonPage(){
        this.validator.showHide(DOMElements.personPage,"hide");
        this.validator.showHide(DOMElements.gallery,"hide");
        this.validator.showHide(DOMElements.personNavbar,"hide");
        this.validator.showHide(DOMElements.backBtn,"hide");
        this.validator.showHide(DOMElements.form,"show");
    };
    function initListeners() {
        DOMElements.form.addEventListener("keypress", initValidation.bind(this));
        DOMElements.submitBtn.addEventListener("click", validate.bind(this));	
        DOMElements.backBtn.addEventListener("click", goBack.bind(this));	
        DOMElements.togglePasswordBtn.addEventListener("click", togglePasswordOutput.bind(this));
        DOMElements.showGalleryBtn.addEventListener("click", showGalleryBlock.bind(this));	
        DOMElements.showUserDataBtn.addEventListener("click", showUserDataBlock.bind(this));	
    };
    function fillUserData(inp , pass){
        DOMElements.personNameField.value = inp;    
        DOMElements.personPasswordField.value = pass;
    };
    function fillInputsOnUserPage(inp , pass){
        DOMElements.personNameField.value = inp;    
        DOMElements.personPasswordField.value = pass;
    };
    function initValidation(event){
        if(event.keyCode == 13) {
            validate();
        }
    };
    function validate() {
        //this.validator.hideAlertMsgs();

        let email = DOMElements.email.value, 
            password = DOMElements.password.value,
            checkFields = this.validator.checkFields(email , password) &&
                this.validator.checkUser(email, password);

        if(checkFields){ 
            showPersonPage();
            fillInputsOnUserPage (email , password);
            this.gallery.init();
            localStorage.userLoggedIn = "1";
		}  
    };
    function goBack() {
        hidePersonPage();
        //gallery.clearGallery(); // можно включитьчтобы обновлять галерею при входе
        fillStartPageUserData();   
        localStorage.userLoggedIn = 0;
        localStorage.isGalleryInited = "1";
        localStorage.sortMethod = "0";
    };
	function fillStartPageUserData() {
        if (DOMElements.checkBoxRemememberMe.checked == true){
            DOMElements.email.value = localStorage.email;     //  спрятать из глобальной области видимости
            DOMElements.password.value = localStorage.password;
        } else {
            DOMElements.email.value = "";
            DOMElements.password.value = "";
        }
    };
	function togglePasswordOutput(event){
		if(showPassStatus === 0){
			showPassStatus = 1;
			this.validator.showHidePass(DOMElements.personPasswordField , "text");
			DOMElements.togglePasswordBtn.innerText = "Скрыть пароль";
		} else {
			showPassStatus = 0;
			this.validator.showHidePass(DOMElements.personPasswordField , "password");
			DOMElements.togglePasswordBtn.innerText = "Показать пароль";
		}
	};
    function showGalleryBlock() {
        this.validator.showHide(DOMElements.gallery,"show");
        this.validator.showHide(DOMElements.personPage,"hide");
        DOMElements.showGalleryBtn.classList.add("btn", "btn-outline-secondary");
        DOMElements.showUserDataBtn.classList.remove("btn", "btn-outline-secondary");
    };
    function showUserDataBlock () {
        this.validator.showHide(DOMElements.personPage,"show");
        this.validator.showHide(DOMElements.gallery,"hide");
        DOMElements.showUserDataBtn.classList.add("btn", "btn-outline-secondary");
        DOMElements.showGalleryBtn.classList.remove("btn", "btn-outline-secondary");
    };
    function initTooltips (){
        $('[data-toggle="tooltip"]').tooltip(); 
    };

    this.initComponent = function() { 
        setLogAndPass(user);
        checkIfUserLoggedIn();    
        initListeners();
        initTooltips();
    };
}

LoginForm.prototype = {
    
    
    
};

*/
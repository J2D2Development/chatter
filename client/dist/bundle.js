/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sign_up__ = __webpack_require__(2);




window.addEventListener('DOMContentLoaded', init);

function init() {
    const login = document.querySelector('#login')
    const signUp = document.querySelector('#sign-up');
    const loginFormShow = document.querySelector('#login-form');
    const signupFormShow = document.querySelector('#sign-up-form');

    loginFormShow.addEventListener('click', () => {
        if(login.classList.contains('hidden')) {
        login.classList.remove('hidden');
        loginFormShow.classList.add('active-button');
        signUp.classList.add('hidden');
        signupFormShow.classList.remove('active-button');
        }
    });

    signupFormShow.addEventListener('click', () => {
        if(signUp.classList.contains('hidden')) {
        signUp.classList.remove('hidden');
        signupFormShow.classList.add('active-button');
        login.classList.add('hidden');
        loginFormShow.classList.remove('active-button');
        
        }
    });

    const loginFields = [
        {type: 'text', id: 'username', placeholder: 'email'},
        {type: 'text', id: 'password', placeholder: 'password'}
    ];

    const signUpFields = [
        {type: 'text', placeholder: 'email'}
    ];

    const buttons = [
        {type: 'submit', title: 'Submit', class: 'submit'},
        {thype: 'cancel', title: 'Cancel', class: 'cancel'}
    ];

    const loginForm = new __WEBPACK_IMPORTED_MODULE_0__sign_up__["a" /* Form */]({
        url: './processors/submit-login.js', 
        inputs: loginFields,
        buttons: buttons, 
        title: {
        text: 'Log In',
        class: 'title-right'
        },
        instructions: 'Forgot your info?  Contact Us!'
    });
    const signUpForm = new __WEBPACK_IMPORTED_MODULE_0__sign_up__["a" /* Form */]({
        url: './processors/submit-signup.js', 
        inputs: signUpFields, 
        buttons: buttons,
        title: {
        text: 'Sign Up',
        class: 'title-left'
        },
        instructions: 'New to our service?  Just provide an email address and we will get in touch!'
    });

    login.innerHTML = loginForm.createFormHtml();
    signUp.innerHTML = signUpForm.createFormHtml();
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Form {
  //{url, inputs, buttons, instructions, title}
  constructor(config) {
    this.url = config.url;
    this.inputs = config.inputs;
    this.buttons = config.buttons;
    this.instructions = config.instructions;
    this.title = config.title;

    this.username = '';
    this.password = '';
  }
  
  createTitle() {
    return (
      `<div class="title ${this.title.class}">${this.title.text}</div>`
    )
  }
  
  createInputs() {
    return this.inputs.map(input => {
      return `
        <input type=${input.type} id=${input.id} placeholder=${input.placeholder} />
      `;
    }).join('<br />');
  }
  
  createButtons() {
    return this.buttons.map(button => {
      return `
        <button type=${button.type} class=${button.class}>${button.title}</button>
      `;
    }).join('');
  }
  
  createInstructions() {
    return (
      `<div class="instructions">${this.instructions}</div>`
    );
  }
  
  createFormHtml() {
    let inputHtml = '';
    
    if(this.title) {
      inputHtml += this.createTitle();
    }
    
    inputHtml += this.createInputs() + '<br />' + this.createButtons();
    
    if(this.instructions) {
      inputHtml += this.createInstructions();
    }

    function submit(evt) {
        evt.preventDefault();
        console.log('submitting form...');
    }
    
    return `
      <form onSubmit="${submit}">${inputHtml}</form>
    `;
  }

  login(evt) {
      evt.preventDefault();
      console.log('logging in:', this.username, this.password);

  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Form;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0);
module.exports = __webpack_require__(1);


/***/ })
/******/ ]);
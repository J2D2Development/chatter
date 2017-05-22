'use strict';
//add data validation: https://www.npmjs.com/package/joi

import { Form } from './sign-up';

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

    const loginForm = new Form({
        url: './processors/submit-login.js', 
        inputs: loginFields,
        buttons: buttons, 
        title: {
        text: 'Log In',
        class: 'title-right'
        },
        instructions: 'Forgot your info?  Contact Us!'
    });
    const signUpForm = new Form({
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
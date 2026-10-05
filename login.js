import {
    auth
} from "./firebase.js";

import {
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


// Get form elements
const form = document.getElementById("login-form");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("psw");
const rememberInput = document.getElementById("remember");

const errorText = document.getElementById("login-error");
const loginButton = document.getElementById("login-button");


form.addEventListener("submit", async (event) => {

    event.preventDefault();


    // Get values
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const remember = rememberInput.checked;


    // Clear old errors
    errorText.textContent = "";


    /*
    |--------------------------------------------------------------------------
    | BASIC VALIDATION
    |--------------------------------------------------------------------------
    */

    if (!email || !password) {

        showError("Please enter your email and password.");

        return;
    }


    /*
    |--------------------------------------------------------------------------
    | DISABLE LOGIN BUTTON
    |--------------------------------------------------------------------------
    */

    loginButton.disabled = true;
    loginButton.textContent = "Logging In...";


    try {

        /*
        |--------------------------------------------------------------------------
        | REMEMBER ME
        |--------------------------------------------------------------------------
        |
        | Checked:
        | Firebase keeps the user logged in after the browser closes.
        |
        | Unchecked:
        | Login lasts for the current browser session.
        */

        if (remember) {

            await setPersistence(
                auth,
                browserLocalPersistence
            );

        } else {

            await setPersistence(
                auth,
                browserSessionPersistence
            );

        }


        /*
        |--------------------------------------------------------------------------
        | FIREBASE LOGIN
        |--------------------------------------------------------------------------
        */

        const credential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user = credential.user;


        console.log(
            "Logged in:",
            user.uid
        );


        /*
        |--------------------------------------------------------------------------
        | REDIRECT
        |--------------------------------------------------------------------------
        |
        | Change dashboard.html if your main logged-in page
        | uses a different filename.
        */

        window.location.href = "dashboard.html";


    } catch (error) {

        console.error(
            "Firebase login error:",
            error
        );

        handleFirebaseError(error);

    } finally {

        loginButton.disabled = false;
        loginButton.textContent = "Log In";

    }

});


/*
|--------------------------------------------------------------------------
| SHOW ERROR
|--------------------------------------------------------------------------
*/

function showError(message) {

    errorText.textContent = message;

}


/*
|--------------------------------------------------------------------------
| FIREBASE LOGIN ERRORS
|--------------------------------------------------------------------------
*/

function handleFirebaseError(error) {

    switch (error.code) {

        case "auth/invalid-email":

            showError(
                "Please enter a valid email address."
            );

            break;


        case "auth/invalid-credential":

            showError(
                "Incorrect email or password."
            );

            break;


        case "auth/user-disabled":

            showError(
                "This account has been disabled."
            );

            break;


        case "auth/too-many-requests":

            showError(
                "Too many login attempts. Please wait and try again."
            );

            break;


        case "auth/network-request-failed":

            showError(
                "Network error. Check your internet connection."
            );

            break;


        default:

            showError(
                "Unable to log in. Please try again."
            );

    }

}
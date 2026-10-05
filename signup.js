import {
    auth,
    db
} from "./firebase.js";


import {
    createUserWithEmailAndPassword,
    updateProfile,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


// Form elements
const form = document.getElementById("signup-form");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("psw");
const repeatPasswordInput =
    document.getElementById("psw-repeat");

const nameInput = document.getElementById("name");
const rememberInput = document.getElementById("remember");

const errorText = document.getElementById("signup-error");
const signupButton =
    document.getElementById("signup-button");


// Submit signup form
form.addEventListener("submit", async (event) => {

    event.preventDefault();


    // Get values
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const repeatPassword =
        repeatPasswordInput.value;

    const swimmerName = nameInput.value.trim();

    const remember = rememberInput.checked;


    // Reset previous error
    errorText.textContent = "";


    /*
    |--------------------------------------------------------------------------
    | VALIDATION
    |--------------------------------------------------------------------------
    */

    if (
        !email ||
        !password ||
        !repeatPassword ||
        !swimmerName
    ) {

        showError("Please fill out every field.");

        return;
    }


    if (password !== repeatPassword) {

        showError("Passwords do not match.");

        return;
    }


    if (password.length < 6) {

        showError(
            "Password must be at least 6 characters."
        );

        return;
    }


    /*
    |--------------------------------------------------------------------------
    | DISABLE BUTTON
    |--------------------------------------------------------------------------
    */

    signupButton.disabled = true;
    signupButton.textContent = "Creating Account...";


    try {

        /*
        |--------------------------------------------------------------------------
        | REMEMBER ME
        |--------------------------------------------------------------------------
        |
        | Checked:
        | User stays logged in after closing browser.
        |
        | Unchecked:
        | Login lasts for the browser session.
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
        | CREATE FIREBASE AUTH USER
        |--------------------------------------------------------------------------
        |
        | Firebase stores the password securely.
        | We NEVER put the password in Firestore.
        */

        const credential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user = credential.user;


        /*
        |--------------------------------------------------------------------------
        | ADD NAME TO FIREBASE AUTH PROFILE
        |--------------------------------------------------------------------------
        */

        await updateProfile(user, {

            displayName: swimmerName

        });


        /*
        |--------------------------------------------------------------------------
        | CREATE FIRESTORE USER DOCUMENT
        |--------------------------------------------------------------------------
        |
        | Collection:
        |
        | users
        |    └── Firebase UID
        |          email
        |          name
        |          createdAt
        |
        */

        await setDoc(
            doc(
                db,
                "users",
                user.uid
            ),
            {

                uid: user.uid,

                email: user.email,

                name: swimmerName,

                createdAt: serverTimestamp()

            }
        );


        /*
        |--------------------------------------------------------------------------
        | SUCCESS
        |--------------------------------------------------------------------------
        */

        console.log(
            "Account created:",
            user.uid
        );


        // Change this to your actual dashboard
        window.location.href =
            "dashboard.html";


    } catch (error) {

        console.error(error);

        handleFirebaseError(error);

    } finally {

        signupButton.disabled = false;
        signupButton.textContent = "Sign Up";

    }

});


/*
|--------------------------------------------------------------------------
| DISPLAY ERROR
|--------------------------------------------------------------------------
*/

function showError(message) {

    errorText.textContent = message;

}


/*
|--------------------------------------------------------------------------
| FIREBASE ERROR MESSAGES
|--------------------------------------------------------------------------
*/

function handleFirebaseError(error) {

    switch (error.code) {

        case "auth/email-already-in-use":

            showError(
                "An account with this email already exists."
            );

            break;


        case "auth/invalid-email":

            showError(
                "Please enter a valid email address."
            );

            break;


        case "auth/weak-password":

            showError(
                "Your password is too weak."
            );

            break;


        case "auth/operation-not-allowed":

            showError(
                "Email/password signup has not been enabled."
            );

            break;


        case "auth/network-request-failed":

            showError(
                "Network error. Check your internet connection."
            );

            break;


        default:

            showError(
                "Unable to create your account. Please try again."
            );

    }

}
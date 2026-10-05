import {
    auth,
    db
} from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


document
    .getElementById("logout-button")
    .addEventListener("click", async () => {

        await signOut(auth);

        window.location.href = "login.html";

    });

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    try {

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {

            const userData = userSnap.data();

            // Name
            document.getElementById("swimmer-name").textContent =
                userData.name || "Swimmer";


            // Date created
            if (userData.createdAt) {

                const date = userData.createdAt.toDate();

                const formattedDate =
                    date.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                    });

                document.getElementById("date-created").textContent =
                    formattedDate;

            } else {

                document.getElementById("date-created").textContent =
                    "Unknown";

            }

        }

    } catch (error) {

        console.error("Could not load user data:", error);

    }

});
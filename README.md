# AquaTutor

AquaTutor is a web-based swimming performance platform designed to help swimmers better understand their results, track their progress, and identify areas where they can improve.

The platform combines swimmer data, performance history, rankings, and intelligent analysis in one dashboard.

## Features

- User registration and login with Firebase Authentication
- Secure password handling through Firebase
- Swimmer profile information stored in Cloud Firestore
- Personalized dashboard
- Swimmer name and account creation date
- Persistent login with "Remember Me"
- Logout functionality
- Performance and progression tracking
- Swim result history
- Specialty / stroke analysis
- Ranking and performance metrics
- Responsive dark UI
- Modern blue and purple gradient design

## Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- ES Modules

### Backend / Services

- Firebase Authentication
- Cloud Firestore
- Firebase Web SDK

## Project Structure

```text
AquaTutor/
│
├── index.html
├── signup.html
├── login.html
├── dashboard.html
│
├── firebase.js
├── signup.js
├── login.js
├── dashboard.js
│
├── Assets/
│   ├── Logo.png
│   └── ...
│
├── Demo/
│   ├── linegraph.js
│   └── radargraph.js
│
└── README.md

// auth.js
const loginForm = document.getElementById('login-form');
const loginSection = document.getElementById('login-section');
const contentSection = document.getElementById('app-content');
const logoutButtonContainer = document.getElementById('logout-button-container');
const logoutButton = document.getElementById('logout-button');
const loginErrorMessage = document.getElementById('login-error-message');
const mainNav = document.getElementById('main-nav');

// Handle login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email, password)
        .then((cred) => {
            // onAuthStateChanged will handle UI changes
            console.log('Usuario logueado:', cred.user);
            loginErrorMessage.textContent = '';
            loginErrorMessage.style.display = 'none';
        })
        .catch((error) => {
            console.error('Error al iniciar sesión:', error.message);
            loginErrorMessage.textContent = 'Error al iniciar sesión: ' + error.message;
            loginErrorMessage.style.display = 'block';
        });
});

// Handle logout
logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        // onAuthStateChanged will handle UI changes
        console.log('Usuario ha cerrado sesión');
    });
});

// Firebase auth state observer
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is logged in
        loginSection.style.display = 'none';
        contentSection.style.display = 'block';
        if (mainNav) {
            // Ensure nav is displayed appropriately. 'block' is common, but could be 'flex' if it's a flex container.
            // Check style.css for nav#main-nav if unsure. For now, 'block' is a safe default.
            mainNav.style.display = 'block';
        }
        logoutButtonContainer.style.display = 'block'; // Or other appropriate display style like 'list-item' or 'flex'

        console.log('Usuario actual:', user.email);
        // Responsibility for showing specific content like home-summary or calling loadSummaryData
        // should be in main.js or another script that loads after auth.js and can safely access those elements/functions.
    } else {
        // User is not logged in
        loginSection.style.display = 'block';
        contentSection.style.display = 'none';
        if (mainNav) {
            mainNav.style.display = 'none';
        }
        logoutButtonContainer.style.display = 'none';

        loginForm.reset(); // Reset login form fields
        loginErrorMessage.style.display = 'none'; // Clear any previous error messages

        console.log('No hay usuario logueado');
    }
});

// Safeguard: Ensure nav is hidden if no user is logged in on initial script parse.
// This is somewhat redundant due to onAuthStateChanged firing on load for the initial state,
// but acts as a fallback if onAuthStateChanged hasn't fired by the time this runs.
if (mainNav && !auth.currentUser) {
    mainNav.style.display = 'none';
}

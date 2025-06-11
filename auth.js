// auth.js
const loginForm = document.getElementById('login-form');
const loginSection = document.getElementById('login-section');
const contentSection = document.getElementById('app-content'); // Ahora apunta a app-content
const logoutButtonContainer = document.getElementById('logout-button-container');
const logoutButton = document.getElementById('logout-button');
const loginErrorMessage = document.getElementById('login-error-message');
const navElement = document.getElementById('main-nav'); // Updated selector
const navLinksElement = document.querySelector('#main-nav .nav-links'); // Updated selector
const homeSummarySection = document.getElementById('home-summary-section');

// Manejar el inicio de sesión
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email, password)
        .then((cred) => {
            console.log('Usuario logueado:', cred.user);
            loginErrorMessage.textContent = ''; // Limpia cualquier mensaje de error
        })
        .catch((error) => {
            console.error('Error al iniciar sesión:', error.message);
            loginErrorMessage.textContent = 'Error al iniciar sesión: ' + error.message;
            loginErrorMessage.style.display = 'block';
        });
});

// Manejar el cierre de sesión
logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log('Usuario ha cerrado sesión');
        contentSection.style.display = 'none';
        if (navElement) navElement.style.display = 'none'; // Confirmed
        if (navLinksElement) navLinksElement.style.display = 'none'; // Confirmed
        if (navLinksElement) navLinksElement.classList.remove('active'); // Confirmed
        loginSection.style.display = 'block';
        logoutButtonContainer.style.display = 'none';
        loginForm.reset();
        loginErrorMessage.style.display = 'none';
        hideAllContentSections();
    });
});

// Observador de estado de autenticación de Firebase, envuelto en DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged((user) => {
        if (user) {
            // Usuario logueado
            loginSection.style.display = 'none';
            contentSection.style.display = 'block';
            logoutButtonContainer.style.display = 'block';
            console.log('Usuario actual:', user.email);
            loginErrorMessage.style.display = 'none';

            if (navElement) navElement.style.display = 'block'; // Changed to 'block'
            if (navLinksElement) navLinksElement.style.display = ''; // Confirmed (let CSS make it flex)

            hideAllContentSections();
            if (homeSummarySection) homeSummarySection.style.display = 'block';
            if (typeof loadSummaryData === 'function') {
                loadSummaryData();
            }

        } else {
            // Usuario no logueado
            loginSection.style.display = 'block';
            contentSection.style.display = 'none';
            logoutButtonContainer.style.display = 'none';

            if (navElement) navElement.style.display = 'none'; // Confirmed
            if (navLinksElement) navLinksElement.style.display = 'none'; // Confirmed
            if (navLinksElement) navLinksElement.classList.remove('active'); // Confirmed

            console.log('No hay usuario logueado');
        }
    });
});

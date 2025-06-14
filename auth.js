// auth.js
const loginForm = document.getElementById('login-form');
const loginSection = document.getElementById('login-section');
const contentSection = document.getElementById('app-content'); // Ahora apunta a app-content
const logoutButtonContainer = document.getElementById('logout-button-container');
const logoutButton = document.getElementById('logout-button');
const loginErrorMessage = document.getElementById('login-error-message');
const mainNav = document.getElementById('main-nav'); // Added this line

// Manejar el inicio de sesión
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email, password)
        .then((cred) => {
            console.log('Usuario logueado:', cred.user);
            loginErrorMessage.textContent = ''; // Limpia cualquier mensaje de error
            // Redirige o muestra el contenido principal a través del observador de estado
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
        // Oculta el contenido principal y muestra la sección de login
        contentSection.style.display = 'none';
        loginSection.style.display = 'block';
        logoutButtonContainer.style.display = 'none';
        if (mainNav) { // Added this block
            mainNav.style.display = 'none';
        }
        loginForm.reset(); // Limpia el formulario de login
        loginErrorMessage.style.display = 'none'; // Oculta mensajes de error anteriores
        hideAllContentSections(); // Asegura que todas las secciones de contenido estén ocultas
    });
});

// Observador de estado de autenticación de Firebase
auth.onAuthStateChanged((user) => {
    if (user) {
        // Usuario logueado
        loginSection.style.display = 'none';
        contentSection.style.display = 'block';
        logoutButtonContainer.style.display = 'block';
        if (mainNav) { // Added this block
            mainNav.style.display = 'block';
        }
        console.log('Usuario actual:', user.email);
        loginErrorMessage.style.display = 'none'; // Oculta cualquier mensaje de error si el login es exitoso

        // Asegúrate de que todas las demás secciones estén ocultas
        hideAllContentSections();
        // Muestra la sección de resumen de inicio
        homeSummarySection.style.display = 'block';
        // Carga los datos de resumen
        if (typeof loadSummaryData === 'function') { // Asegúrate de que la función exista
            loadSummaryData();
        }

    } else {
        // Usuario no logueado
        loginSection.style.display = 'block';
        contentSection.style.display = 'none';
        logoutButtonContainer.style.display = 'none';
        if (mainNav) { // Added this block
            mainNav.style.display = 'none';
        }
        console.log('No hay usuario logueado');
    }
});


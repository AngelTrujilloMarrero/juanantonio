// main.js
const navHome = document.getElementById('nav-home');
const navData = document.getElementById('nav-data');
const navAnalysis = document.getElementById('nav-analysis');
const dataManagementSection = document.getElementById('data-management-section');
const analysisSection = document.getElementById('analysis-section');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const homeSummarySection = document.getElementById('home-summary-section');


// Función para ocultar todas las secciones de contenido
function hideAllContentSections() {
    dataManagementSection.style.display = 'none';
    analysisSection.style.display = 'none';
    homeSummarySection.style.display = 'none'; // Añadir esta línea
    // Llama a destroyChart() cada vez que se oculta la sección de análisis
    // para evitar problemas si se navega rápidamente
    if (typeof destroyChart === 'function') { // Asegura que la función exista antes de llamarla
        destroyChart();
    }
}

// Event listener para el botón de "Inicio"
navHome.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllContentSections();
    homeSummarySection.style.display = 'block'; // Mostrar la sección de resumen
    loadSummaryData(); // Cargar los datos del resumen
    navLinks.classList.remove('active'); // Ocultar menú en móvil
});

// Event listener para el botón de "Gestión de Datos"
navData.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllContentSections();
    dataManagementSection.style.display = 'block';
    // Asegurarse de que el formulario y la tabla se regeneren si se cambia de sección
    const currentSelectedTable = dataSelect.value;
    generateForm(currentSelectedTable);
    displayData(currentSelectedTable);
    navLinks.classList.remove('active'); // Ocultar menú en móvil
});

// Event listener para el botón de "Análisis"
navAnalysis.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllContentSections();
    analysisSection.style.display = 'block';
    navLinks.classList.remove('active'); // Ocultar menú en móvil
    // Asegurarse de que el gráfico esté vacío al iniciar la sección de análisis
    document.getElementById('analysis-message').textContent = 'Selecciona un tipo de análisis para visualizar los datos.';
    document.getElementById('analysis-message').style.display = 'block';
    if (typeof destroyChart === 'function') {
        destroyChart(); // Destruye cualquier gráfico anterior
    }
});

// Event listener para el botón de menú hamburguesa (responsive)
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});


// Inicialmente, oculta todas las secciones de contenido hasta que el usuario inicie sesión
hideAllContentSections();

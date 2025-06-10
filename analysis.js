// js/analysis.js
let myChartInstance = null; // Para almacenar la instancia del gráfico y destruirla si es necesario
const fieldMapContainer = document.getElementById('field-map-container');
const showFieldMapButton = document.getElementById('show-field-map');
const footballFieldCanvas = document.getElementById('football-field');
const ctx = footballFieldCanvas.getContext('2d'); // Contexto para el mapa de campo
const fieldXInput = document.getElementById('field-x');
const fieldYInput = document.getElementById('field-y');
const actionTypeSelect = document.getElementById('action-type');
const actionPlayerInput = document.getElementById('action-player');
const fieldDataForm = document.getElementById('field-data-form');
const fieldFormMessage = document.getElementById('field-form-message');
const analysisMessage = document.getElementById('analysis-message');
const chartArea = document.querySelector('.chart-area');
const myChartCanvas = document.getElementById('myChart'); // Canvas para los gráficos de Chart.js
const chartCtx = myChartCanvas.getContext('2d'); // Contexto para Chart.js

// Nuevos botones de análisis
const showGoalsByPlayerChartButton = document.getElementById('show-goals-by-player-chart');
const showActionsPerPlayerChartButton = document.getElementById('show-actions-per-player-chart');
const showActionTypesPerPlayerChartButton = document.getElementById('show-action-types-per-player-chart');
const showGoalsPerMatchChartButton = document.getElementById('show-goals-per-match-chart');
const playerSelectionArea = document.getElementById('player-selection-area');
const playerSelectDropdown = document.getElementById('analysis-player-select');

// Función para obtener datos de Firebase
async function fetchData(tableName) {
    try {
        const snapshot = await database.ref(tableName).once('value');
        return snapshot.val() || {}; // Return raw object
    } catch (error) {
        console.error(`Error al obtener datos de ${tableName}:`, error);
        analysisMessage.textContent = `Error al cargar datos de ${tableName}: ${error.message}`;
        analysisMessage.style.display = 'block';
        chartArea.style.display = 'none';
        return {};
    }
}

// Función para destruir el gráfico existente de Chart.js
function destroyChart() {
    if (myChartInstance) {
        myChartInstance.destroy();
        myChartInstance = null;
    }
    chartArea.style.display = 'none'; // Ocultar el área del gráfico
}

// Función para ocultar el mapa de campo
function hideFieldMap() {
    if (fieldMapContainer) { // Ensure it exists
        fieldMapContainer.style.display = 'none';
    }
}

// === Funciones para Dibujar el Mapa de Campo ===
function drawFootballField() {
    // Limpiar el canvas
    ctx.clearRect(0, 0, footballFieldCanvas.width, footballFieldCanvas.height);

    // Dibujar el campo de fútbol (código ya existente)
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, footballFieldCanvas.width, footballFieldCanvas.height); // Campo exterior
    ctx.beginPath(); // Línea de medio campo
    ctx.moveTo(footballFieldCanvas.width / 2, 0);
    ctx.lineTo(footballFieldCanvas.width / 2, footballFieldCanvas.height);
    ctx.stroke();
    ctx.beginPath(); // Círculo central
    ctx.arc(footballFieldCanvas.width / 2, footballFieldCanvas.height / 2, 60, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.strokeRect(0, footballFieldCanvas.height / 2 - 100, 100, 200); // Área de gol izquierda
    ctx.strokeRect(0, footballFieldCanvas.height / 2 - 50, 50, 100); // Área de penalti izquierda
    ctx.beginPath(); // Punto de penalti izquierda
    ctx.arc(75, footballFieldCanvas.height / 2, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeRect(footballFieldCanvas.width - 100, footballFieldCanvas.height / 2 - 100, 100, 200); // Área de gol derecha
    ctx.strokeRect(footballFieldCanvas.width - 50, footballFieldCanvas.height / 2 - 50, 50, 100); // Área de penalti derecha
    ctx.beginPath(); // Punto de penalti derecha
    ctx.arc(footballFieldCanvas.width - 75, footballFieldCanvas.height / 2, 3, 0, 2 * Math.PI);
    ctx.fill();
    // Arcos de esquina
    ctx.beginPath(); ctx.arc(0, 0, 20, 0, Math.PI / 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(footballFieldCanvas.width, 0, 20, Math.PI / 2, Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, footballFieldCanvas.height, 20, 0, -Math.PI / 2, true); ctx.stroke();
    ctx.beginPath(); ctx.arc(footballFieldCanvas.width, footballFieldCanvas.height, 20, Math.PI, 3 * Math.PI / 2); ctx.stroke();

    loadAndDrawActionsOnField();
}

async function loadAndDrawActionsOnField() {
    const accionesData = await fetchData('acciones'); // Returns object
    const accionesArray = Object.values(accionesData); // Convert to array for forEach

    accionesArray.forEach(action => {
        const canvasX = (action.x / 100) * footballFieldCanvas.width;
        const canvasY = (action.y / 100) * footballFieldCanvas.height;
        ctx.beginPath();
        if (action.accion === 'Tiro a Puerta' || action.accion === 'Gol') { ctx.fillStyle = 'red'; ctx.arc(canvasX, canvasY, 8, 0, 2 * Math.PI); }
        else if (action.accion === 'Tiro fuera') { ctx.fillStyle = 'orange'; ctx.arc(canvasX, canvasY, 7, 0, 2 * Math.PI); }
        else if (action.accion === 'Pase Clave') { ctx.fillStyle = 'blue'; ctx.arc(canvasX, canvasY, 6, 0, 2 * Math.PI); }
        else if (action.accion === 'Recuperación') { ctx.fillStyle = 'green'; ctx.rect(canvasX - 5, canvasY - 5, 10, 10); }
        else if (action.accion === 'Falta') { ctx.fillStyle = 'purple'; ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI); }
        else { ctx.fillStyle = 'grey'; ctx.arc(canvasX, canvasY, 4, 0, 2 * Math.PI); }
        ctx.fill();
    });
}

footballFieldCanvas.addEventListener('click', (e) => {
    const rect = footballFieldCanvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 100;
    const y = (e.clientY - rect.top) / rect.height * 100;
    fieldXInput.value = x.toFixed(1);
    fieldYInput.value = y.toFixed(1);
});

fieldDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    fieldFormMessage.style.display = 'none';
    const x = parseFloat(fieldXInput.value);
    const y = parseFloat(fieldYInput.value);
    const actionType = actionTypeSelect.value;
    const playerId = parseInt(actionPlayerInput.value);

    if (isNaN(x) || isNaN(y) || !actionType || isNaN(playerId)) {
        fieldFormMessage.textContent = 'Por favor, selecciona un punto en el campo, el tipo de acción y el ID del jugador.';
        fieldFormMessage.style.color = '#e74c3c';
        fieldFormMessage.style.display = 'block';
        return;
    }
    try {
        const newActionRef = database.ref('acciones').push();
        await newActionRef.set({
            id: newActionRef.key, partido_id: null, jugador_id: playerId, accion: actionType, x: x, y: y,
            resultado: "", ocasion: false, finalizador: false, blocaje: false, blocaje_caida: false,
            prolongacion: false, fuera: false, defensa_despeje: false, defensa_corner: false, gol: false,
            penalti: false, final_fuera: false, final_despeje: false, final_gol: false, final_blocaje: false,
            portero_corner: false, portero_despeje: false,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        fieldFormMessage.textContent = '¡Acción guardada con éxito!';
        fieldFormMessage.style.color = '#28a745';
        fieldFormMessage.style.display = 'block';
        fieldXInput.value = ''; fieldYInput.value = ''; actionTypeSelect.value = ''; actionPlayerInput.value = '';
        drawFootballField();
    } catch (error) {
        console.error('Error al guardar acción en Firebase:', error);
        fieldFormMessage.textContent = 'Error al guardar la acción: ' + error.message;
        fieldFormMessage.style.color = '#e74c3c';
        fieldFormMessage.style.display = 'block';
    }
});

// === Funciones para Gráficos Dinámicos (Chart.js) ===

// Gráfico: Goles por Jugador (Adaptado para fetchData devolviendo objeto)
async function displayGoalsByPlayerChart() {
    destroyChart();
    hideFieldMap();
    playerSelectionArea.style.display = 'none';
    analysisMessage.textContent = 'Cargando datos de goles por jugador...';
    analysisMessage.style.display = 'block';
    chartArea.style.display = 'none';

    const jugadoresData = await fetchData('jugadores'); // Es un objeto
    const jugadoresArray = Object.values(jugadoresData);

    if (jugadoresArray.length === 0) {
        analysisMessage.textContent = 'No hay datos de jugadores para mostrar el gráfico.';
        chartArea.style.display = 'none';
        return;
    }

    const golesPorJugador = jugadoresArray.map(jugador => {
        const totalGoles = (jugador.gol_cabeza || 0) + (jugador.gol_pie || 0) + (jugador.penalti || 0) +
                           (jugador.gol_falta || 0) + (jugador.gol_corner || 0) + (jugador.gol_penalti || 0) +
                           (jugador.gol_centro_lateral || 0) + (jugador.gol_individual || 0) +
                           (jugador.gol_transicion || 0) + (jugador.gol_tiro_area || 0) +
                           (jugador.gol_tiro_fuera_area || 0) + (jugador.gol_error_rival || 0);
        return { nombre: jugador.nombre, goles: totalGoles }; // Usando jugador.nombre como en el original
    }).sort((a, b) => b.goles - a.goles);

    const labels = golesPorJugador.map(item => item.nombre);
    const data = golesPorJugador.map(item => item.goles);

    myChartInstance = new Chart(chartCtx, {
        type: 'bar', data: { labels: labels, datasets: [{ label: 'Número de Goles', data: data, backgroundColor: 'rgba(54, 162, 235, 0.8)', borderColor: 'rgba(54, 162, 235, 1)', borderWidth: 1 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: 'Goles Totales por Jugador' }, legend: { display: false } }, scales: { y: { beginAtZero: true, title: { display: true, text: 'Cantidad de Goles' } }, x: { title: { display: true, text: 'Jugador' } } } }
    });
    analysisMessage.style.display = 'none';
    chartArea.style.display = 'block';
}

// Chart 1: Actions per Player (Bar Chart)
showActionsPerPlayerChartButton.addEventListener('click', async () => {
    destroyChart();
    hideFieldMap();
    playerSelectionArea.style.display = 'none';
    analysisMessage.textContent = 'Cargando datos de acciones por jugador...';
    analysisMessage.style.display = 'block';
    chartArea.style.display = 'none';

    const accionesData = await fetchData('acciones'); // Object
    const jugadoresData = await fetchData('jugadores'); // Object

    if (Object.keys(accionesData).length === 0 || Object.keys(jugadoresData).length === 0) {
        analysisMessage.textContent = 'No hay suficientes datos para generar el gráfico de acciones por jugador.';
        return;
    }

    const accionesArray = Object.values(accionesData);
    const playerActionCounts = {};

    accionesArray.forEach(accion => {
        if (accion.jugador_id) { // Asegurarse que el id_jugador existe en la acción
            playerActionCounts[accion.jugador_id] = (playerActionCounts[accion.jugador_id] || 0) + 1;
        }
    });

    const labels = [];
    const data = [];

    for (const playerId in playerActionCounts) {
        // Encontrar el jugador por su ID. Necesitamos buscar en jugadoresData por la key que Firebase usa, o si el ID es un campo.
        // Asumimos que playerId (de acciones) es la key en jugadoresData o un campo 'id' dentro del objeto jugador.
        // For simplicity, let's find by iterating Object.values(jugadoresData) if 'id' is a field.
        // Or, if playerID from acciones IS the Firebase key for a player:
        const jugador = Object.values(jugadoresData).find(j => j.id === playerId) || jugadoresData[playerId];

        // Si el ID en acciones es la key de Firebase para jugadores, la segunda parte de OR es mejor.
        // Si el ID en acciones es un campo 'id_jugador' que debe coincidir con un campo 'id' en el objeto jugador:
        // const jugador = Object.values(jugadoresData).find(j => String(j.id) === String(playerId));

        labels.push(jugador ? jugador.nombre : `Jugador ID: ${playerId}`); // Fallback si no se encuentra el nombre
        data.push(playerActionCounts[playerId]);
    }

    if (labels.length === 0) {
        analysisMessage.textContent = 'No se encontraron acciones para jugadores.';
        return;
    }

    myChartInstance = new Chart(chartCtx, {
        type: 'bar',
        data: { labels, datasets: [{ label: 'Número de Acciones', data, backgroundColor: 'rgba(75, 192, 192, 0.8)', borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: 'Acciones Totales por Jugador' }, legend: { display: false } }, scales: { y: { beginAtZero: true, title: { display: true, text: 'Cantidad de Acciones' } }, x: { title: { display: true, text: 'Jugador' } } } }
    });
    analysisMessage.style.display = 'none';
    chartArea.style.display = 'block';
});

// Chart 2: Action Types per Player (Pie Chart)
showActionTypesPerPlayerChartButton.addEventListener('click', async () => {
    destroyChart();
    hideFieldMap();
    analysisMessage.textContent = 'Selecciona un jugador para ver los tipos de acción.';
    analysisMessage.style.display = 'block';
    chartArea.style.display = 'none';
    playerSelectionArea.style.display = 'block';

    playerSelectDropdown.innerHTML = '<option value="">Cargando jugadores...</option>';
    const playersData = await fetchData('jugadores'); // Object
    if (Object.keys(playersData).length > 0) {
        playerSelectDropdown.innerHTML = '<option value="">-- Selecciona Jugador --</option>';
        for (const firebaseKey in playersData) { // firebaseKey es el ID que necesitamos si acciones.jugador_id se refiere a esto
            const player = playersData[firebaseKey];
            // Usamos firebaseKey como el value para el option, asumiendo que acciones.jugador_id == firebaseKey
            const option = new Option(player.nombre || `Jugador ${firebaseKey}`, firebaseKey);
            playerSelectDropdown.add(option);
        }
    } else {
        playerSelectDropdown.innerHTML = '<option value="">No hay jugadores disponibles</option>';
        analysisMessage.textContent = 'No se encontraron jugadores.';
    }
});

playerSelectDropdown.addEventListener('change', async () => {
    const selectedPlayerId = playerSelectDropdown.value; // Esto será la Firebase Key del jugador
    if (!selectedPlayerId) {
        destroyChart();
        chartArea.style.display = 'none';
        analysisMessage.textContent = 'Selecciona un jugador para ver los tipos de acción.';
        analysisMessage.style.display = 'block';
        return;
    }
    destroyChart();
    hideFieldMap();
    analysisMessage.textContent = `Cargando tipos de acción para el jugador seleccionado...`;
    analysisMessage.style.display = 'block';
    chartArea.style.display = 'none';

    const accionesData = await fetchData('acciones'); // Object
    const accionesArray = Object.values(accionesData);
    const playerActionTypes = {};

    accionesArray.forEach(accion => {
        // Comparar accion.jugador_id con selectedPlayerId (que es la Firebase Key)
        if (String(accion.jugador_id) === String(selectedPlayerId) && accion.accion) {
            playerActionTypes[accion.accion] = (playerActionTypes[accion.accion] || 0) + 1;
        }
    });

    const labels = Object.keys(playerActionTypes);
    const data = Object.values(playerActionTypes);

    if (labels.length === 0) {
        analysisMessage.textContent = 'No se encontraron tipos de acción para este jugador.';
        return;
    }

    myChartInstance = new Chart(chartCtx, {
        type: 'pie',
        data: { labels, datasets: [{ label: 'Tipos de Acción', data,
            backgroundColor: ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(255, 206, 86, 0.8)', 'rgba(75, 192, 192, 0.8)', 'rgba(153, 102, 255, 0.8)', 'rgba(255, 159, 64, 0.8)'],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
            borderWidth: 1 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: `Tipos de Acción para ${playerSelectDropdown.options[playerSelectDropdown.selectedIndex].text}` }, legend: { position: 'top', } } }
    });
    analysisMessage.style.display = 'none';
    chartArea.style.display = 'block';
});

// Chart 3: Goals per Match (Bar Chart)
showGoalsPerMatchChartButton.addEventListener('click', async () => {
    destroyChart();
    hideFieldMap();
    playerSelectionArea.style.display = 'none';
    analysisMessage.textContent = 'Cargando datos de goles por partido...';
    analysisMessage.style.display = 'block';
    chartArea.style.display = 'none';

    const partidosData = await fetchData('partidos'); // Object

    if (Object.keys(partidosData).length === 0) {
        analysisMessage.textContent = 'No hay datos de partidos para mostrar el gráfico.';
        return;
    }

    const labels = [];
    const data = [];

    for (const matchKey in partidosData) {
        const partido = partidosData[matchKey];
        const totalGoals = (parseInt(partido.goles_local) || 0) + (parseInt(partido.goles_visitante) || 0);
        // Usaremos el ID del partido (Firebase key) o podríamos construir un nombre más descriptivo
        // Para el label, podríamos usar `Partido ${matchKey}` o algo con las fechas/equipos si los tenemos
        labels.push(`Partido ${matchKey.substring(0,6)}...`); // Acortar la key para que no sea muy larga
        data.push(totalGoals);
    }

    if (labels.length === 0) {
        analysisMessage.textContent = 'No se encontraron datos de goles en los partidos.';
        return;
    }

    myChartInstance = new Chart(chartCtx, {
        type: 'bar',
        data: { labels, datasets: [{ label: 'Goles Totales', data, backgroundColor: 'rgba(255, 159, 64, 0.8)', borderColor: 'rgba(255, 159, 64, 1)', borderWidth: 1 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: 'Goles Totales por Partido' }, legend: { display: false } }, scales: { y: { beginAtZero: true, title: { display: true, text: 'Cantidad de Goles' } }, x: { title: { display: true, text: 'Partido (ID)' } } } }
    });
    analysisMessage.style.display = 'none';
    chartArea.style.display = 'block';
});


// === Event Listeners para los botones de análisis (EXISTENTES ACTUALIZADOS) ===

showFieldMapButton.addEventListener('click', () => {
    destroyChart();
    analysisMessage.textContent = '';
    analysisMessage.style.display = 'none';
    playerSelectionArea.style.display = 'none'; // Ocultar selector de jugador
    fieldMapContainer.style.display = 'block';
    drawFootballField();
});

showGoalsByPlayerChartButton.addEventListener('click', () => {
    // La llamada a displayGoalsByPlayerChart ya maneja destroyChart, hideFieldMap, y playerSelectionArea.
    displayGoalsByPlayerChart();
});


// Asegurarse de que el mapa de campo y el área del gráfico se ocultan al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    if (fieldMapContainer) {
        fieldMapContainer.style.display = 'none';
    }
    if (chartArea) {
        chartArea.style.display = 'none';
    }
    if (playerSelectionArea) {
        playerSelectionArea.style.display = 'none';
    }
});

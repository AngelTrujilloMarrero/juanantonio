// js/analysis.js
let myChartInstance = null; // Para almacenar la instancia del gráfico y destruirla si es necesario
let selectedPoint = null; // Global variable for selected point
let drawnActions = []; // Array to store details of actions drawn on canvas
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
const actionHistoryLog = document.getElementById('action-history-log');

// Nuevos botones de análisis
const showGoalsByPlayerChartButton = document.getElementById('show-goals-by-player-chart');


// Función para obtener datos de Firebase
async function fetchData(tableName) {
    try {
        const snapshot = await database.ref(tableName).once('value');
        const data = snapshot.val();
        return data ? Object.values(data) : []; // Convertir objeto a array
    } catch (error) {
        console.error(`Error al obtener datos de ${tableName}:`, error);
        analysisMessage.textContent = `Error al cargar datos de ${tableName}: ${error.message}`;
        analysisMessage.style.display = 'block';
        return [];
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
    fieldMapContainer.style.display = 'none';
}

// === Funciones para Dibujar el Mapa de Campo ===
function drawFootballField() {
    // Limpiar el canvas
    ctx.clearRect(0, 0, footballFieldCanvas.width, footballFieldCanvas.height);

    // Dibujar el campo de fútbol (código ya existente)
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;

    // Campo exterior
    ctx.strokeRect(0, 0, footballFieldCanvas.width, footballFieldCanvas.height);

    // Línea de medio campo
    ctx.beginPath();
    ctx.moveTo(footballFieldCanvas.width / 2, 0);
    ctx.lineTo(footballFieldCanvas.width / 2, footballFieldCanvas.height);
    ctx.stroke();

    // Círculo central
    ctx.beginPath();
    ctx.arc(footballFieldCanvas.width / 2, footballFieldCanvas.height / 2, 60, 0, 2 * Math.PI);
    ctx.stroke();

    // Área de gol izquierda
    ctx.strokeRect(0, footballFieldCanvas.height / 2 - 100, 100, 200);
    // Área de penalti izquierda
    ctx.strokeRect(0, footballFieldCanvas.height / 2 - 50, 50, 100);
    // Punto de penalti izquierda
    ctx.beginPath();
    ctx.arc(75, footballFieldCanvas.height / 2, 3, 0, 2 * Math.PI);
    ctx.fill();

    // Área de gol derecha
    ctx.strokeRect(footballFieldCanvas.width - 100, footballFieldCanvas.height / 2 - 100, 100, 200);
    // Área de penalti derecha
    ctx.strokeRect(footballFieldCanvas.width - 50, footballFieldCanvas.height / 2 - 50, 50, 100);
    // Punto de penalti derecha
    ctx.beginPath();
    ctx.arc(footballFieldCanvas.width - 75, footballFieldCanvas.height / 2, 3, 0, 2 * Math.PI);
    ctx.fill();

    // Arcos de esquina (opcional, simplificado)
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(footballFieldCanvas.width, 0, 20, Math.PI / 2, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, footballFieldCanvas.height, 20, 0, -Math.PI / 2, true);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(footballFieldCanvas.width, footballFieldCanvas.height, 20, Math.PI, 3 * Math.PI / 2);
    ctx.stroke();

    // Cargar y dibujar acciones desde Firebase
    loadAndDrawActionsOnField();

    if (selectedPoint) {
        const canvasX = (selectedPoint.x / 100) * footballFieldCanvas.width;
        const canvasY = (selectedPoint.y / 100) * footballFieldCanvas.height;

        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 10, 0, 2 * Math.PI); // Larger circle for selection
        ctx.fillStyle = 'rgba(255, 255, 0, 0.5)'; // Semi-transparent yellow
        ctx.fill();
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

async function loadAndDrawActionsOnField() {
    const acciones = await fetchData('acciones');
    drawnActions = []; // Clear existing drawn actions

    acciones.forEach(action => {
        // Mapear coordenadas (0-100) a las dimensiones del canvas
        const canvasX = (action.x / 100) * footballFieldCanvas.width;
        const canvasY = (action.y / 100) * footballFieldCanvas.height;
        let actionRadius = 4; // Default radius

        ctx.beginPath();
        // Diferentes colores/formas según el tipo de acción
        if (action.accion === 'Tiro a Puerta' || action.accion === 'Gol') { // Si 'Gol' es un tipo de acción
            ctx.fillStyle = 'red';
            actionRadius = 8;
            ctx.arc(canvasX, canvasY, actionRadius, 0, 2 * Math.PI);
        } else if (action.accion === 'Tiro fuera') {
            ctx.fillStyle = 'orange';
            actionRadius = 7;
            ctx.arc(canvasX, canvasY, actionRadius, 0, 2 * Math.PI);
        } else if (action.accion === 'Pase Clave') {
            ctx.fillStyle = 'blue';
            actionRadius = 6;
            ctx.arc(canvasX, canvasY, actionRadius, 0, 2 * Math.PI);
        } else if (action.accion === 'Recuperación') {
            ctx.fillStyle = 'green';
            actionRadius = 5; // Assuming square is drawn from center, radius is half-width
            ctx.rect(canvasX - actionRadius, canvasY - actionRadius, actionRadius * 2, actionRadius * 2);
        } else if (action.accion === 'Falta') {
            ctx.fillStyle = 'purple';
            actionRadius = 5;
            ctx.arc(canvasX, canvasY, actionRadius, 0, 2 * Math.PI);
        } else {
            ctx.fillStyle = 'grey'; // Default para otras acciones
            actionRadius = 4;
            ctx.arc(canvasX, canvasY, actionRadius, 0, 2 * Math.PI);
        }
        ctx.fill();

        // Store the action and its drawing details
        // Make sure to store the original action data from Firebase
        drawnActions.push({
            data: action, // This is the original action object from Firebase
            canvasX: canvasX,
            canvasY: canvasY,
            radius: actionRadius + 3 // Add a small buffer for click detection
        });
    });
}

// Event listener para obtener coordenadas al hacer clic en el campo
footballFieldCanvas.addEventListener('click', (e) => {
    const rect = footballFieldCanvas.getBoundingClientRect();
    const clickCanvasX = e.clientX - rect.left;
    const clickCanvasY = e.clientY - rect.top;

    let clickedOnExistingAction = false;
    for (const drawn_action of drawnActions) {
        // Calculate distance between click and center of the drawn action
        const distance = Math.sqrt(
            Math.pow(clickCanvasX - drawn_action.canvasX, 2) +
            Math.pow(clickCanvasY - drawn_action.canvasY, 2)
        );

        if (distance < drawn_action.radius) { // Check if click is within the action's radius
            const actionData = drawn_action.data;
            fieldXInput.value = actionData.x.toFixed(1);
            fieldYInput.value = actionData.y.toFixed(1);
            actionTypeSelect.value = actionData.accion;
            actionPlayerInput.value = actionData.jugador_id || '';

            selectedPoint = { x: actionData.x, y: actionData.y }; // Use action's original % coordinates

            // Optional: Display a message or update UI to indicate an existing action is selected
            fieldFormMessage.textContent = `Acción existente seleccionada: ${actionData.accion}`;
            fieldFormMessage.style.color = '#3498db'; // Blue color for info
            fieldFormMessage.style.display = 'block';

            clickedOnExistingAction = true;
            break;
        }
    }

    if (!clickedOnExistingAction) {
        // Click was not on an existing action, treat as new point
        const xPercentage = (clickCanvasX / footballFieldCanvas.width) * 100;
        const yPercentage = (clickCanvasY / footballFieldCanvas.height) * 100;

        fieldXInput.value = xPercentage.toFixed(1);
        fieldYInput.value = yPercentage.toFixed(1);
        // Clear other form fields for a new action
        actionTypeSelect.value = '';
        actionPlayerInput.value = '';

        selectedPoint = { x: xPercentage, y: yPercentage };

        fieldFormMessage.textContent = 'Nuevo punto seleccionado. Completa los detalles de la acción.';
        fieldFormMessage.style.color = '#28a745'; // Green
        fieldFormMessage.style.display = 'block';
    }

    drawFootballField(); // Redraw to show selection highlight
});

// Event listener para guardar datos de la acción
fieldDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    fieldFormMessage.style.display = 'none'; // Ocultar mensaje anterior

    const x = parseFloat(fieldXInput.value);
    const y = parseFloat(fieldYInput.value);
    const actionType = actionTypeSelect.value;
    const playerId = parseInt(actionPlayerInput.value); // Convertir a número

    if (isNaN(x) || isNaN(y) || !actionType || isNaN(playerId)) {
        fieldFormMessage.textContent = 'Por favor, selecciona un punto en el campo, el tipo de acción y el ID del jugador.';
        fieldFormMessage.style.color = '#e74c3c'; // Red
        fieldFormMessage.style.display = 'block';
        return;
    }

    try {
        const newActionRef = database.ref('acciones').push();
        const actionToSave = {
            id: newActionRef.key,
            partido_id: null,
            jugador_id: playerId,
            accion: actionType,
            x: x,
            y: y,
            resultado: "",
            ocasion: false,
            finalizador: false,
            blocaje: false,
            blocaje_caida: false,
            prolongacion: false,
            fuera: false,
            defensa_despeje: false,
            defensa_corner: false,
            gol: false,
            penalti: false,
            final_fuera: false,
            final_despeje: false,
            final_gol: false,
            final_blocaje: false,
            portero_corner: false,
            portero_despeje: false,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };
        await newActionRef.set(actionToSave);

        const loggedAction = {
            ...actionToSave,
            timestamp: Date.now()
        };
        updateActionHistoryLog(loggedAction);

        fieldFormMessage.textContent = '¡Acción guardada con éxito!';
        fieldFormMessage.style.color = '#28a745'; // Green color
        fieldFormMessage.style.display = 'block';

        selectedPoint = null; // Clear selection
        // Limpiar formulario y campo
        fieldXInput.value = '';
        fieldYInput.value = '';
        actionTypeSelect.value = '';
        actionPlayerInput.value = '';
        drawFootballField(); // Redibujar el campo con la nueva acción

    } catch (error) {
        console.error('Error al guardar acción en Firebase:', error);
        fieldFormMessage.textContent = 'Error al guardar la acción: ' + error.message;
        fieldFormMessage.style.color = '#e74c3c'; // Red color
        fieldFormMessage.style.display = 'block';
    }
});


// === Funciones para Gráficos Dinámicos (Chart.js) ===

function updateActionHistoryLog(actionData) {
    if (!actionHistoryLog) return;

    const listItem = document.createElement('li');

    // Format timestamp
    const date = new Date(actionData.timestamp);
    const formattedTime = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    let actionText = `${actionData.accion} (Jugador: ${actionData.jugador_id || 'N/A'})`;
    if (actionData.x !== undefined && actionData.y !== undefined) {
        actionText += ` en [${actionData.x.toFixed(1)}, ${actionData.y.toFixed(1)}]`;
    }
    actionText += ` - ${formattedTime}`;

    listItem.textContent = actionText;

    // Add to the top of the list
    actionHistoryLog.prepend(listItem);

    // Optional: Limit the number of history items
    const maxHistoryItems = 20;
    if (actionHistoryLog.children.length > maxHistoryItems) {
        actionHistoryLog.removeChild(actionHistoryLog.lastChild);
    }
}

// Gráfico: Goles por Jugador
async function displayGoalsByPlayerChart() {
    destroyChart(); // Destruir cualquier gráfico anterior
    hideFieldMap(); // Ocultar el mapa de campo

    analysisMessage.textContent = 'Cargando datos de goles por jugador...';
    analysisMessage.style.display = 'block';
    chartArea.style.display = 'block'; // Mostrar el área del gráfico

    const jugadores = await fetchData('jugadores');

    if (jugadores.length === 0) {
        analysisMessage.textContent = 'No hay datos de jugadores para mostrar el gráfico.';
        analysisMessage.style.display = 'block';
        chartArea.style.display = 'none';
        return;
    }

    // Calcular el total de goles para cada jugador
    const golesPorJugador = jugadores.map(jugador => {
        const totalGoles = (jugador.gol_cabeza || 0) +
                           (jugador.gol_pie || 0) +
                           (jugador.penalti || 0) + // Asumiendo que penalti es un gol directo aquí
                           (jugador.gol_falta || 0) +
                           (jugador.gol_corner || 0) +
                           (jugador.gol_penalti || 0) + // si hay otro campo para goles de penalti
                           (jugador.gol_centro_lateral || 0) +
                           (jugador.gol_individual || 0) +
                           (jugador.gol_transicion || 0) +
                           (jugador.gol_tiro_area || 0) +
                           (jugador.gol_tiro_fuera_area || 0) +
                           (jugador.gol_error_rival || 0);
        return {
            nombre: jugador.nombre,
            goles: totalGoles
        };
    }).sort((a, b) => b.goles - a.goles); // Ordenar de mayor a menor goles

    const labels = golesPorJugador.map(item => item.nombre);
    const data = golesPorJugador.map(item => item.goles);

    // Crear el gráfico
    myChartInstance = new Chart(chartCtx, {
        type: 'bar', // Tipo de gráfico: barras
        data: {
            labels: labels,
            datasets: [{
                label: 'Número de Goles',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.8)', // Azul
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Goles Totales por Jugador'
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Cantidad de Goles'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Jugador'
                    }
                }
            }
        }
    });
    analysisMessage.style.display = 'none'; // Ocultar mensaje una vez que el gráfico está cargado
}


// === Event Listeners para los botones de análisis ===

function clearFieldMessage() {
    fieldFormMessage.textContent = '';
    fieldFormMessage.style.display = 'none';
}
actionTypeSelect.addEventListener('change', clearFieldMessage);
actionPlayerInput.addEventListener('input', clearFieldMessage);

showFieldMapButton.addEventListener('click', () => {
    destroyChart(); // Ocultar cualquier gráfico existente
    analysisMessage.textContent = '';
    analysisMessage.style.display = 'none';
    fieldMapContainer.style.display = 'block';
    drawFootballField(); // Asegurarse de que el campo se dibuje correctamente al mostrar
});

showGoalsByPlayerChartButton.addEventListener('click', () => {
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
});

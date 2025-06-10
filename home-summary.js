// home-summary.js
const summaryEquipos = document.getElementById('summary-equipos');
const summaryJugadores = document.getElementById('summary-jugadores');
const summaryPartidos = document.getElementById('summary-partidos');
const summaryAcciones = document.getElementById('summary-acciones');
const summaryTiposDeJuego = document.getElementById('summary-tiposdejuego');
const summaryChartCanvas = document.getElementById('summaryChart');

let summaryChartInstance = null; // Para la instancia del gráfico de resumen

// Función para obtener el recuento de documentos en una colección de Firebase
async function getCollectionCount(collectionName) {
    try {
        const snapshot = await database.ref(collectionName).once('value');
        const data = snapshot.val();
        return data ? Object.keys(data).length : 0;
    } catch (error) {
        console.error(`Error al obtener el recuento de ${collectionName}:`, error);
        return 0;
    }
}

// Función para cargar y mostrar el resumen de la base de datos
async function loadSummaryData() {
    // Destruir el gráfico anterior si existe
    if (summaryChartInstance) {
        summaryChartInstance.destroy();
        summaryChartInstance = null;
    }

    summaryEquipos.textContent = 'Cargando...';
    summaryJugadores.textContent = 'Cargando...';
    summaryPartidos.textContent = 'Cargando...';
    summaryAcciones.textContent = 'Cargando...';
    summaryTiposDeJuego.textContent = 'Cargando...';

    const equiposCount = await getCollectionCount('equipos');
    const jugadoresCount = await getCollectionCount('jugadores');
    const partidosCount = await getCollectionCount('partidos');
    const accionesCount = await getCollectionCount('acciones');
    const tiposDeJuegoCount = await getCollectionCount('tiposdejuego');

    summaryEquipos.textContent = equiposCount;
    summaryJugadores.textContent = jugadoresCount;
    summaryPartidos.textContent = partidosCount;
    summaryAcciones.textContent = accionesCount;
    summaryTiposDeJuego.textContent = tiposDeJuegoCount;

    // Generar un gráfico de barras simple con los recuentos
    const ctx = summaryChartCanvas.getContext('2d');
    summaryChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Equipos', 'Jugadores', 'Partidos', 'Acciones', 'Tipos de Juego'],
            datasets: [{
                label: 'Número de Registros',
                data: [equiposCount, jugadoresCount, partidosCount, accionesCount, tiposDeJuegoCount],
                backgroundColor: [
                    'rgba(52, 152, 219, 0.8)', // Blue
                    'rgba(46, 204, 113, 0.8)', // Green
                    'rgba(241, 196, 15, 0.8)',  // Yellow
                    'rgba(231, 76, 60, 0.8)',   // Red
                    'rgba(155, 89, 182, 0.8)' // Purple
                ],
                borderColor: [
                    'rgba(52, 152, 219, 1)',
                    'rgba(46, 204, 113, 1)',
                    'rgba(241, 196, 15, 1)',
                    'rgba(231, 76, 60, 1)',
                    'rgba(155, 89, 182, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Cantidad'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Tipo de Datos'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // No mostrar leyenda, ya que solo hay un dataset
                },
                title: {
                    display: true,
                    text: 'Resumen de Datos de la Base de Datos'
                }
            }
        }
    });
}

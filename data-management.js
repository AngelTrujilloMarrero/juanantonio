// data-management.js
const dataSelect = document.getElementById('data-select');
const formContainer = document.getElementById('form-container');
const dataListContainer = document.getElementById('data-list-container');

// Estructuras de datos para generar formularios y tablas
const dataStructures = {
    equipos: {
        fields: [
            { name: "nombre", type: "text", label: "Nombre del Equipo" },
            { name: "temporada_id", type: "number", label: "ID de Temporada" }
        ],
        idField: "id"
    },
    jugadores: {
        fields: [
            { name: "nombre", type: "text", label: "Nombre del Jugador" },
            { name: "equipo_id", type: "number", label: "ID del Equipo" },
            { name: "posición", type: "text", label: "Posición" },
            { name: "porcentaje_jugado", type: "number", label: "Porcentaje Jugado" },
            { name: "titular", type: "number", label: "Titular" },
            { name: "suplente", type: "number", label: "Suplente" },
            { name: "gol_cabeza", type: "number", label: "Gol de Cabeza" },
            { name: "gol_pie", type: "number", label: "Gol de Pie" },
            { name: "penalti", type: "number", label: "Penalti" },
            { name: "gol_falta", type: "number", label: "Gol de Falta" },
            { name: "gol_corner", type: "number", label: "Gol de Corner" },
            { name: "gol_penalti", type: "number", label: "Gol de Penalti" },
            { name: "gol_centro_lateral", type: "number", label: "Gol de Centro Lateral" },
            { name: "gol_individual", type: "number", label: "Gol Individual" },
            { name: "gol_transicion", type: "number", label: "Gol en Transición" },
            { name: "gol_tiro_area", type: "number", label: "Gol de Tiro en Área" },
            { name: "gol_tiro_fuera_area", type: "number", label: "Gol de Tiro Fuera del Área" },
            { name: "gol_error_rival", type: "number", label: "Gol por Error Rival" },
            { name: "goles_totales", type: "number", label: "Goles Totales" },
            { name: "goles_por_partido", type: "number", label: "Goles por Partido" }
        ],
        idField: "id"
    },
    partidos: {
        fields: [
            { name: "equipo_local_id", type: "number", label: "ID Equipo Local" },
            { name: "equipo_visitante_id", type: "number", label: "ID Equipo Visitante" },
            { name: "fecha", type: "date", label: "Fecha" },
            { name: "resultado", type: "text", label: "Resultado" }
        ],
        idField: "id"
    },
    rivales: {
        fields: [
            { name: "nombre", type: "text", label: "Nombre del Rival" },
            { name: "equipo_id", type: "number", label: "ID del Equipo" },
            { name: "faltas_1er_tiempo", type: "number", label: "Faltas 1er Tiempo" },
            { name: "faltas_2do_tiempo", type: "number", label: "Faltas 2do Tiempo" },
            { name: "faltas_1er_rival", type: "number", label: "Faltas 1er Rival" },
            { name: "faltas_2do_rival", type: "number", label: "Faltas 2do Rival" },
            { name: "recuperaciones_1er_tiempo", type: "number", label: "Recuperaciones 1er Tiempo" },
            { name: "recuperaciones_2do_tiempo", type: "number", label: "Recuperaciones 2do Tiempo" },
            { name: "recuperaciones_1er_rival", type: "number", label: "Recuperaciones 1er Rival" },
            { name: "recuperaciones_2do_rival", type: "number", label: "Recuperaciones 2do Rival" }
        ],
        idField: "id"
    },
    temporadas: {
        fields: [
            { name: "nombre", type: "text", label: "Nombre de Temporada" },
            { name: "año", type: "number", label: "Año" }
        ],
        idField: "id"
    },
    ocasiones: {
        fields: [
            { name: "rival_id", type: "number", label: "ID Rival" },
            { name: "jugador_id", type: "number", label: "ID Jugador" },
            { name: "acción", type: "text", label: "Acción" },
            { name: "ocasion", type: "checkbox", label: "¿Fue Ocasión?" },
            { name: "x", type: "number", label: "Coordenada X" },
            { name: "y", type: "number", label: "Coordenada Y" },
            { name: "resultado", type: "text", label: "Resultado" },
            { name: "finalizador", type: "checkbox", label: "¿Finalizador?" },
            { name: "blocaje", type: "checkbox", label: "¿Blocaje?" },
            { name: "blocaje_caida", type: "checkbox", label: "¿Blocaje por Caída?" },
            { name: "prolongacion", type: "checkbox", label: "¿Prolongación?" },
            { name: "fuera", type: "checkbox", label: "¿Fuera?" },
            { name: "defensa_despeje", type: "checkbox", label: "Defensa: Despeje" },
            { name: "defensa_corner", type: "checkbox", label: "Defensa: Corner" },
            { name: "gol", type: "checkbox", label: "¿Gol?" },
            { name: "penalti", type: "checkbox", label: "¿Penalti?" },
            { name: "final_fuera", type: "checkbox", label: "Final: Fuera" },
            { name: "final_despeje", type: "checkbox", label: "Final: Despeje" },
            { name: "final_gol", type: "checkbox", label: "Final: Gol" },
            { name: "final_blocaje", type: "checkbox", label: "Final: Blocaje" },
            { name: "portero_corner", type: "checkbox", label: "Portero: Corner" },
            { name: "portero_despeje", type: "checkbox", label: "Portero: Despeje" }
        ],
        idField: "id"
    },
    tiposdejuego: {
        fields: [
            { name: "partido_id", type: "number", label: "ID Partido" },
            { name: "rival_id", type: "number", label: "ID Rival" },
            { name: "falta_derecha", type: "number", label: "Falta Derecha" },
            { name: "falta_izquierda", type: "number", label: "Falta Izquierda" },
            { name: "falta_frontal", type: "number", label: "Falta Frontal" },
            { name: "tiro_derecha", type: "number", label: "Tiro Derecha" },
            { name: "tiro_izquierda", type: "number", label: "Tiro Izquierda" },
            { name: "tiro_frontal", type: "number", label: "Tiro Frontal" },
            { name: "tiro_area", type: "number", label: "Tiro en Área" },
            { name: "centros_derecha", type: "number", label: "Centros Derecha" },
            { name: "centros_izquierda", type: "number", label: "Centros Izquierda" }
        ],
        idField: "id"
    }
};

// Función para generar un formulario dinámico
function generateForm(tableName, data = {}) {
    const tableStructure = dataStructures[tableName];
    if (!tableStructure) {
        formContainer.innerHTML = `<p>Selecciona una tabla válida para gestionar.</p>`;
        return;
    }

    let formHtml = `
        <h3>${data.id ? 'Editar' : 'Insertar'} ${tableName.charAt(0).toUpperCase() + tableName.slice(1)}</h3>
        <form id="${tableName}-form">
    `;

    // Si estamos editando, guardamos el ID para futuras operaciones
    if (data.id) {
        formHtml += `<input type="hidden" name="${tableStructure.idField}" value="${data[tableStructure.idField]}">`;
    }

    tableStructure.fields.forEach(field => {
        const value = data[field.name] !== undefined ? data[field.name] : '';
        formHtml += `
            <div>
                <label for="${field.name}">${field.label}:</label>
        `;
        if (field.type === 'checkbox') {
            formHtml += `<input type="checkbox" id="${field.name}" name="${field.name}" ${value ? 'checked' : ''}>`;
        } else {
            formHtml += `<input type="${field.type}" id="${field.name}" name="${field.name}" value="${value}" ${field.type === 'number' ? 'step="any"' : ''} required>`;
        }
        formHtml += `
            </div>
        `;
    });

    formHtml += `
            <button type="submit">${data.id ? 'Guardar Cambios' : 'Insertar Datos'}</button>
            ${data.id ? '<button type="button" id="cancel-edit-button">Cancelar Edición</button>' : ''}
        </form>
    `;
    formContainer.innerHTML = formHtml;

    document.getElementById(`${tableName}-form`).addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newData = {};
        formData.forEach((value, key) => {
            if (tableStructure.fields.find(f => f.name === key && f.type === 'checkbox')) {
                newData[key] = value === 'on' ? true : false; // Handle checkbox boolean
            } else if (tableStructure.fields.find(f => f.name === key && f.type === 'number')) {
                newData[key] = parseFloat(value); // Convert to number
            } else {
                newData[key] = value;
            }
        });

        const id = e.target[tableStructure.idField] ? e.target[tableStructure.idField].value : null;

        if (id) {
            updateData(tableName, id, newData);
        } else {
            insertData(tableName, newData);
        }
    });

    if (data.id) {
        document.getElementById('cancel-edit-button').addEventListener('click', () => {
            generateForm(tableName); // Vuelve al formulario de inserción
            displayData(tableName); // Recarga los datos
        });
    }
}

// Función para obtener un nuevo ID autoincremental
async function getNextId(tableName) {
    const snapshot = await database.ref(tableName).orderByKey().limitToLast(1).once('value');
    let maxId = 0;
    snapshot.forEach(childSnapshot => {
        const data = childSnapshot.val();
        if (data && data.id && typeof data.id === 'number') {
            maxId = Math.max(maxId, data.id);
        }
    });
    return maxId + 1;
}


// Función para insertar datos
async function insertData(tableName, data) {
    try {
        // Genera un ID incremental para el nuevo registro
        const newId = await getNextId(tableName);
        data[dataStructures[tableName].idField] = newId;

        const newRef = database.ref(tableName).push(); // Usa push para generar un ID único de Firebase
        await newRef.set(data);
        alert('Datos insertados correctamente!');
        generateForm(tableName); // Limpiar formulario
        displayData(tableName); // Recargar la lista
    } catch (error) {
        console.error('Error al insertar datos:', error);
        alert('Error al insertar datos: ' + error.message);
    }
}

// Función para actualizar datos
async function updateData(tableName, id, data) {
    try {
        // Encontrar la clave de Firebase correspondiente al ID del registro
        const snapshot = await database.ref(tableName).orderByChild(dataStructures[tableName].idField).equalTo(parseInt(id)).once('value');
        let firebaseKey = null;
        snapshot.forEach(childSnapshot => {
            firebaseKey = childSnapshot.key;
        });

        if (firebaseKey) {
            await database.ref(`${tableName}/${firebaseKey}`).update(data);
            alert('Datos actualizados correctamente!');
            generateForm(tableName); // Limpiar formulario
            displayData(tableName); // Recargar la lista
        } else {
            alert('No se encontró el registro para actualizar.');
        }
    } catch (error) {
        console.error('Error al actualizar datos:', error);
        alert('Error al actualizar datos: ' + error.message);
    }
}

// Función para eliminar datos
async function deleteData(tableName, id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este registro?')) {
        return;
    }
    try {
        // Encontrar la clave de Firebase correspondiente al ID del registro
        const snapshot = await database.ref(tableName).orderByChild(dataStructures[tableName].idField).equalTo(parseInt(id)).once('value');
        let firebaseKey = null;
        snapshot.forEach(childSnapshot => {
            firebaseKey = childSnapshot.key;
        });

        if (firebaseKey) {
            await database.ref(`${tableName}/${firebaseKey}`).remove();
            alert('Datos eliminados correctamente!');
            displayData(tableName); // Recargar la lista
        } else {
            alert('No se encontró el registro para eliminar.');
        }
    } catch (error) {
        console.error('Error al eliminar datos:', error);
        alert('Error al eliminar datos: ' + error.message);
    }
}

// Función para mostrar los datos en una tabla
async function displayData(tableName) {
    if (!tableName) {
        dataListContainer.innerHTML = '';
        return;
    }
    try {
        const snapshot = await database.ref(tableName).once('value');
        const data = snapshot.val();
        let tableHtml = `<h3>Datos de ${tableName.charAt(0).toUpperCase() + tableName.slice(1)}</h3>`;

        if (!data) {
            tableHtml += '<p>No hay datos disponibles.</p>';
            dataListContainer.innerHTML = tableHtml;
            return;
        }

        const dataArray = Object.values(data); // Convertir el objeto de Firebase en un array

        let teamsMap = {};
        if (tableName === 'partidos') {
            const teamsSnapshot = await database.ref('equipos').once('value');
            const teamsData = teamsSnapshot.val() || {};
            for (const firebaseKey in teamsData) {
                const team = teamsData[firebaseKey];
                teamsMap[team.id] = team.nombre; // Assuming 'id' is the key in 'equipos' that matches 'equipo_local_id' and 'nombre' holds the team name
            }
        }

        tableHtml += `<table><thead><tr>`;
        // Encabezados específicos para partidos
        if (tableName === 'partidos') {
            dataStructures.partidos.fields.forEach(field => {
                tableHtml += `<th>${field.label}</th>`;
            });
        } else {
            // Encabezados genéricos para otras tablas
            const headers = Object.keys(dataArray[0] || {});
            headers.forEach(header => {
                tableHtml += `<th>${header}</th>`;
            });
        }
        tableHtml += `<th>Acciones</th></tr></thead><tbody>`;

        dataArray.forEach(row => {
            tableHtml += `<tr>`;
            if (tableName === 'partidos') {
                dataStructures.partidos.fields.forEach(field => {
                    let cellValue = row[field.name];
                    if (field.name === 'equipo_local_id') {
                        cellValue = teamsMap[row[field.name]] || row[field.name];
                    } else if (field.name === 'equipo_visitante_id') {
                        cellValue = teamsMap[row[field.name]] || row[field.name];
                    }
                    tableHtml += `<td>${cellValue !== undefined ? cellValue : ''}</td>`;
                });
            } else {
                const headers = Object.keys(row); // Usar las claves de la fila actual
                headers.forEach(header => {
                    tableHtml += `<td>${row[header] !== undefined ? row[header] : ''}</td>`;
                });
            }
            tableHtml += `
                <td class="action-buttons">
                    <button class="edit-button" data-id="${row[dataStructures[tableName].idField]}">Editar</button>
                    <button class="delete-button" data-id="${row[dataStructures[tableName].idField]}">Eliminar</button>
                </td>
            </tr>`;
        });

        tableHtml += `</tbody></table>`;
        dataListContainer.innerHTML = tableHtml;

        // Añadir event listeners a los botones de editar y eliminar
        dataListContainer.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const idToEdit = e.target.dataset.id;
                const recordToEdit = dataArray.find(item => item[dataStructures[tableName].idField] == idToEdit);
                if (recordToEdit) {
                    generateForm(tableName, recordToEdit);
                }
            });
        });

        dataListContainer.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const idToDelete = e.target.dataset.id;
                deleteData(tableName, idToDelete);
            });
        });

    } catch (error) {
        console.error('Error al cargar datos:', error);
        dataListContainer.innerHTML = `<p>Error al cargar datos: ${error.message}</p>`;
    }
}


// Event listener para el cambio de selección de tabla
dataSelect.addEventListener('change', (e) => {
    const selectedTable = e.target.value;
    generateForm(selectedTable);
    displayData(selectedTable);
});

// Inicializar con un formulario vacío o un mensaje
generateForm('');
displayData('');

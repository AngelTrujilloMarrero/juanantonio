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
    acciones: {
        fields: [
            { name: "id", type: "text", label: "ID Acción", readonly: true },
            { name: "partido_id", type: "text", label: "ID Partido" },
            { name: "jugador_id", type: "number", label: "ID Jugador" },
            { name: "accion", type: "text", label: "Tipo de Acción" },
            { name: "x", type: "number", label: "Coordenada X (%)" },
            { name: "y", type: "number", label: "Coordenada Y (%)" },
            { name: "timestamp", type: "number", label: "Timestamp", readonly: true },
            { name: "resultado", type: "text", label: "Resultado" },
            { name: "ocasion", type: "checkbox", label: "¿Ocasión?" },
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
    // Ensure that data[tableStructure.idField] is accessed safely
    const idValue = data[tableStructure.idField] !== undefined ? data[tableStructure.idField] : (data.id !== undefined ? data.id : '');
    if (data.id || idValue) { // Check if either data.id or data[tableStructure.idField] has a value
        formHtml += `<input type="hidden" name="${tableStructure.idField}" value="${idValue}">`;
    }


    tableStructure.fields.forEach(field => {
        const value = data[field.name] !== undefined ? data[field.name] : '';
        const readonly = field.readonly ? 'readonly' : '';
        formHtml += `
            <div>
                <label for="${field.name}">${field.label}:</label>
        `;
        if (field.type === 'checkbox') {
            formHtml += `<input type="checkbox" id="${field.name}" name="${field.name}" ${value ? 'checked' : ''} ${readonly}>`;
        } else {
            // Ensure required attribute is not on readonly fields if that causes issues,
            // but typically readonly fields are not required for submission logic.
            // For now, keeping required as it was unless specific issues arise.
            formHtml += `<input type="${field.type}" id="${field.name}" name="${field.name}" value="${value}" ${field.type === 'number' ? 'step="any"' : ''} ${readonly} required>`;
        }
        formHtml += `
            </div>
        `;
    });

    formHtml += `
            <button type="submit">${(data.id || idValue) ? 'Guardar Cambios' : 'Insertar Datos'}</button>
            ${(data.id || idValue) ? '<button type="button" id="cancel-edit-button">Cancelar Edición</button>' : ''}
        </form>
    `;
    formContainer.innerHTML = formHtml;

    document.getElementById(`${tableName}-form`).addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newData = {};
        let idFromForm = null;

        tableStructure.fields.forEach(field => {
            // Make sure to only process fields that are part of the defined structure
            if (formData.has(field.name)) {
                const value = formData.get(field.name);
                if (field.type === 'checkbox') {
                    newData[field.name] = value === 'on' ? true : false;
                } else if (field.type === 'number') {
                    newData[field.name] = parseFloat(value);
                } else {
                    newData[field.name] = value;
                }
            } else if (field.type === 'checkbox') { // Handle unchecked checkboxes
                newData[field.name] = false;
            }
        });

        // Get the ID from the hidden field if it exists
        if (e.target[tableStructure.idField]) {
            idFromForm = e.target[tableStructure.idField].value;
        }


        if (idFromForm) {
            updateData(tableName, idFromForm, newData);
        } else {
            insertData(tableName, newData);
        }
    });

    if (data.id || idValue) {
        document.getElementById('cancel-edit-button').addEventListener('click', () => {
            generateForm(tableName);
            displayData(tableName);
        });
    }
}

// Función para obtener un nuevo ID autoincremental
async function getNextId(tableName) {
    // This function might need adjustment if IDs are Firebase push keys (strings)
    // For now, it assumes numeric, sequential IDs for tables where it's used.
    // 'acciones' uses Firebase push keys, so this function isn't suitable for generating its 'id'.
    const snapshot = await database.ref(tableName).orderByKey().limitToLast(1).once('value');
    let maxId = 0;
    snapshot.forEach(childSnapshot => {
        const data = childSnapshot.val();
        // Check if the idField of the specific table structure holds a number
        const idFieldName = dataStructures[tableName] ? dataStructures[tableName].idField : 'id';
        if (data && data[idFieldName] && typeof data[idFieldName] === 'number') {
            maxId = Math.max(maxId, data[idFieldName]);
        }
    });
    return maxId + 1;
}


// Función para insertar datos
async function insertData(tableName, data) {
    try {
        const idFieldName = dataStructures[tableName].idField;
        if (tableName === 'acciones') {
            // For 'acciones', the ID is a Firebase push key, generated by push() and stored in data.id
            const newRef = database.ref(tableName).push();
            data[idFieldName] = newRef.key; // Set the 'id' field to the Firebase key
            await newRef.set(data);
        } else {
            // For other tables, assuming numeric ID generation if needed
            // This part might need review based on actual ID strategy for other tables
            const newId = await getNextId(tableName);
            data[idFieldName] = newId;
            // If using numeric IDs as keys in Firebase:
            // await database.ref(tableName).child(newId.toString()).set(data);
            // Or if numeric IDs are just fields and Firebase keys are separate:
            const newRef = database.ref(tableName).push(); // Or .child(customKey)
            await newRef.set(data);
        }
        alert('Datos insertados correctamente!');
        generateForm(tableName);
        displayData(tableName);
    } catch (error) {
        console.error('Error al insertar datos:', error);
        alert('Error al insertar datos: ' + error.message);
    }
}

// Función para actualizar datos
async function updateData(tableName, id, data) {
    try {
        const idFieldName = dataStructures[tableName].idField;
        // For 'acciones' (and potentially others using Firebase push keys as idField),
        // 'id' is the Firebase key.
        if (tableName === 'acciones' || (data[idFieldName] && !/^\d+$/.test(data[idFieldName])) ) { // if id is not purely numeric
             await database.ref(`${tableName}/${id}`).update(data);
        } else {
            // For tables with numeric IDs that are NOT Firebase keys directly
            const snapshot = await database.ref(tableName).orderByChild(idFieldName).equalTo(parseInt(id)).once('value');
            let firebaseKey = null;
            snapshot.forEach(childSnapshot => {
                firebaseKey = childSnapshot.key;
            });

            if (firebaseKey) {
                await database.ref(`${tableName}/${firebaseKey}`).update(data);
            } else {
                alert('No se encontró el registro para actualizar (numeric ID match).');
                return; // Prevent further alerts
            }
        }
        alert('Datos actualizados correctamente!');
        generateForm(tableName);
        displayData(tableName);
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
        const idFieldName = dataStructures[tableName].idField;
        if (tableName === 'acciones' || (id && !/^\d+$/.test(id)) ) { // if id is not purely numeric
            await database.ref(`${tableName}/${id}`).remove();
        } else {
            const snapshot = await database.ref(tableName).orderByChild(idFieldName).equalTo(parseInt(id)).once('value');
            let firebaseKey = null;
            snapshot.forEach(childSnapshot => {
                firebaseKey = childSnapshot.key;
            });

            if (firebaseKey) {
                await database.ref(`${tableName}/${firebaseKey}`).remove();
            } else {
                alert('No se encontró el registro para eliminar (numeric ID match).');
                return;
            }
        }
        alert('Datos eliminados correctamente!');
        displayData(tableName);
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
        const tableStructure = dataStructures[tableName];
        if (!tableStructure) {
             dataListContainer.innerHTML = `<p>Estructura de tabla no definida para ${tableName}.</p>`;
             return;
        }
        const idFieldName = tableStructure.idField;

        const snapshot = await database.ref(tableName).once('value');
        const data = snapshot.val();
        let tableHtml = `<h3>Datos de ${tableName.charAt(0).toUpperCase() + tableName.slice(1)}</h3>`;

        if (!data) {
            tableHtml += '<p>No hay datos disponibles.</p>';
            dataListContainer.innerHTML = tableHtml;
            return;
        }

        const dataArray = Object.values(data);

        // Define headers based on dataStructures, maintaining order and including all fields
        const headers = tableStructure.fields.map(field => field.name);


        tableHtml += `<table><thead><tr>`;
        headers.forEach(headerName => {
            const fieldDefinition = tableStructure.fields.find(f => f.name === headerName);
            tableHtml += `<th>${fieldDefinition ? fieldDefinition.label : headerName}</th>`;
        });
        tableHtml += `<th>Acciones</th></tr></thead><tbody>`;

        dataArray.forEach(row => {
            tableHtml += `<tr>`;
            headers.forEach(header => {
                tableHtml += `<td>${row[header] !== undefined ? row[header] : ''}</td>`;
            });
            // Ensure row[idFieldName] is used for data-id attribute
            tableHtml += `
                <td class="action-buttons">
                    <button class="edit-button" data-id="${row[idFieldName]}">Editar</button>
                    <button class="delete-button" data-id="${row[idFieldName]}">Eliminar</button>
                </td>
            </tr>`;
        });

        tableHtml += `</tbody></table>`;
        dataListContainer.innerHTML = tableHtml;

        dataListContainer.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const idToEdit = e.target.dataset.id;
                // Find can be tricky if ID types differ (e.g. string vs number)
                // It's safer if IDs are consistently string or number in data and comparison
                const recordToEdit = dataArray.find(item => String(item[idFieldName]) === String(idToEdit));
                if (recordToEdit) {
                    generateForm(tableName, recordToEdit);
                } else {
                    console.warn("Could not find record to edit with ID:", idToEdit);
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

// Este script maneja la lógica de validación y persistencia del "City Pass"

// Función que se ejecuta cuando la página se carga
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar el estado guardado al iniciar la aplicación
    loadValidatedAttractions();

    // 2. Asignar el evento a todos los botones de validación
    const validateButtons = document.querySelectorAll('.validate-btn');
    
    validateButtons.forEach(button => {
        button.addEventListener('click', handleValidation);
    });
});

/**
 * Maneja el evento de clic en el botón de validación.
 * @param {Event} event - El evento de clic.
 */
function handleValidation(event) {
    const button = event.target;
    // La información del atractivo está en el contenedor principal (attraction-item)
    const attractionItem = button.closest('.attraction-item');
    const attractionId = attractionItem.getAttribute('data-id');

    // Prevenir la doble validación
    if (attractionItem.classList.contains('validated')) {
        alert('Este atractivo ya ha sido validado en tu pase.');
        return;
    }

    // --- Simulación de Validación ---
    
    // Aquí, en una app real, se enviaría el ID y una prueba de ubicación/código QR
    // a un servidor para una validación segura.
    
    // Por ahora, solo confirmamos la acción:
    if (confirm(`¿Confirma la validación para "${attractionItem.querySelector('span').textContent}"? (SIMULADO)`)) {
        markAsValidated(attractionItem, attractionId);
    }
}

/**
 * Marca visualmente y guarda en el almacenamiento local un atractivo como visitado.
 * @param {HTMLElement} itemElement - El elemento HTML del atractivo.
 * @param {string} id - El ID único del atractivo.
 */
function markAsValidated(itemElement, id) {
    // 1. Actualizar la apariencia visual (HTML/CSS)
    itemElement.classList.add('validated');
    const button = itemElement.querySelector('.validate-btn');
    button.textContent = '✅ Validado';
    
    // 2. Guardar el estado en el almacenamiento local del navegador (LocalStorage)
    // Esto hace que el estado se mantenga incluso si cierras y vuelves a abrir la app.
    
    // Recuperar la lista de IDs validados
    let validatedList = JSON.parse(localStorage.getItem('gyeCityPassValidated')) || [];
    
    // Agregar el nuevo ID si no está ya
    if (!validatedList.includes(id)) {
        validatedList.push(id);
        localStorage.setItem('gyeCityPassValidated', JSON.stringify(validatedList));
    }

    alert('¡Visita registrada con éxito! Disfruta de Guayaquil.');
}

/**
 * Carga el estado guardado desde el LocalStorage al iniciar la aplicación.
 */
function loadValidatedAttractions() {
    const validatedList = JSON.parse(localStorage.getItem('gyeCityPassValidated'));
    
    if (validatedList && validatedList.length > 0) {
        validatedList.forEach(id => {
            const itemElement = document.querySelector(`.attraction-item[data-id="${id}"]`);
            if (itemElement) {
                // Usar la misma función para aplicar los estilos de "validado"
                markAsValidated(itemElement, id);
                // Como no queremos mostrar el alert al cargar, solo actualizamos visualmente:
                itemElement.classList.add('validated');
                itemElement.querySelector('.validate-btn').textContent = '✅ Validado';
            }
        });
    }
}
// Constante para guardar la clave del ID de usuario en el almacenamiento local
const USER_ID_STORAGE_KEY = 'gyeCityPassUserId';
// Constante para guardar la clave de las atracciones validadas
const VALIDATED_ATTRACTIONS_KEY = 'gyeCityPassValidated';

// Función que se ejecuta cuando la página se carga
document.addEventListener('DOMContentLoaded', () => {
    // 1. **NUEVO PASO:** Cargar o crear el ID único del usuario
    loadOrCreateUserId();
    
    // 2. Cargar el estado guardado de las atracciones validadas
    loadValidatedAttractions();

    // 3. Asignar el evento a todos los botones de validación
    const validateButtons = document.querySelectorAll('.validate-btn');
    
    validateButtons.forEach(button => {
        button.addEventListener('click', handleValidation);
    });
});

/**
 * Genera un ID de pase único y aleatorio (ej: GYE-A1B2C3D4).
 * En un sistema real, este ID vendría de un servidor.
 * @returns {string} El ID único generado.
 */
function generateUniqueId() {
    const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `GYE-${randomPart}`;
}

/**
 * Carga el ID de usuario desde el almacenamiento local o genera uno nuevo.
 */
function loadOrCreateUserId() {
    // 1. Intentar recuperar el ID guardado
    let userId = localStorage.getItem(USER_ID_STORAGE_KEY);
    
    if (!userId) {
        // 2. Si no hay ID, generar uno nuevo
        userId = generateUniqueId();
        // 3. Guardar el nuevo ID
        localStorage.setItem(USER_ID_STORAGE_KEY, userId);
        console.log("Nuevo ID de usuario generado y guardado:", userId);
    }
    
    // 4. Mostrar el ID en la interfaz
    const userIdDisplay = document.getElementById('pass-id-display');
    if (userIdDisplay) {
        userIdDisplay.textContent = userId;
    }
}


// --- Lógica de Validación (CÓDIGO ANTERIOR, pero modificado para usar la constante de clave) ---

function handleValidation(event) {
    const button = event.target;
    const attractionItem = button.closest('.attraction-item');
    const attractionId = attractionItem.getAttribute('data-id');

    if (attractionItem.classList.contains('validated')) {
        alert('Este atractivo ya ha sido validado en tu pase.');
        return;
    }

    if (confirm(`¿Confirma la validación para "${attractionItem.querySelector('span').textContent}"? (SIMULADO)`)) {
        markAsValidated(attractionItem, attractionId);
    }
}

function markAsValidated(itemElement, id) {
    itemElement.classList.add('validated');
    const button = itemElement.querySelector('.validate-btn');
    button.textContent = '✅ Validado';
    
    let validatedList = JSON.parse(localStorage.getItem(VALIDATED_ATTRACTIONS_KEY)) || [];
    
    if (!validatedList.includes(id)) {
        validatedList.push(id);
        localStorage.setItem(VALIDATED_ATTRACTIONS_KEY, JSON.stringify(validatedList));
    }

    alert('¡Visita registrada con éxito! Disfruta de Guayaquil.');
}

function loadValidatedAttractions() {
    const validatedList = JSON.parse(localStorage.getItem(VALIDATED_ATTRACTIONS_KEY));
    
    if (validatedList && validatedList.length > 0) {
        validatedList.forEach(id => {
            const itemElement = document.querySelector(`.attraction-item[data-id="${id}"]`);
            if (itemElement) {
                itemElement.classList.add('validated');
                itemElement.querySelector('.validate-btn').textContent = '✅ Validado';
            }
        });
    }
}

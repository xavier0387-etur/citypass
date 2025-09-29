// ========================================================================
// SCRIPT.JS: Lógica del City Pass Digital de Guayaquil
// ========================================================================

// Constantes para guardar las claves en el almacenamiento local del navegador
const USER_ID_STORAGE_KEY = 'gyeCityPassUserId';
const VALIDATED_ATTRACTIONS_KEY = 'gyeCityPassValidated';

// Función principal que se ejecuta cuando la página se carga
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar o crear el ID único del usuario y generar el QR
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
 * @returns {string} El ID único generado.
 */
function generateUniqueId() {
    const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `GYE-${randomPart}`;
}

/**
 * Carga el ID de usuario desde el almacenamiento local, lo genera si es nuevo, 
 * lo muestra en el HTML y genera el Código QR.
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
    
    // 5. Generar el Código QR
    generateQRCode(userId);
}

/**
 * Utiliza la librería qrcode.js para generar el código visual.
 * NOTA: Esta función requiere que la etiqueta <script> de qrcode.js esté en index.html.
 * @param {string} data - La información a codificar (el ID de usuario).
 */
function generateQRCode(data) {
    const qrcodeContainer = document.getElementById('qrcode');
    
    if (typeof QRCode === 'undefined') {
        console.error("La librería qrcode.js no está cargada. Asegúrate de incluirla en index.html");
        return;
    }

    // Limpiar el contenedor por si ya existía un QR
    qrcodeContainer.innerHTML = ''; 
    
    // Crear la instancia del Código QR
    new QRCode(qrcodeContainer, {
        text: data, // El texto que codifica el QR es el ID único del turista
        width: 128,
        height: 128,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}

/**
 * Maneja el evento de clic en el botón de validación, usando el ID de Turista.
 * @param {Event} event - El evento de clic.
 */
function handleValidation(event) {
    const button = event.target;
    const attractionItem = button.closest('.attraction-item');
    const attractionId = attractionItem.getAttribute('data-id');

    // Obtener el ID Único del Turista
    const touristId = localStorage.getItem(USER_ID_STORAGE_KEY);
    
    if (!touristId) {
        alert('Error: No se encontró un ID de pase. Intente recargar la aplicación.');
        return;
    }

    if (attractionItem.classList.contains('validated')) {
        alert('Este atractivo ya ha sido validado en tu pase.');
        return;
    }

    const attractionName = attractionItem.querySelector('span').textContent;

    if (confirm(`¿CONFIRMAR VALIDACIÓN?\n\nAtractivo: ${attractionName}\nID de Pase: ${touristId}`)) {
        
        // Ejecutar la función de registro (simulada)
        const validationSuccess = simulateRemoteValidation(touristId, attractionId, attractionName);
        
        if (validationSuccess) {
            markAsValidated(attractionItem, attractionId);
        } else {
            alert('Fallo en la validación simulada. El pase podría ser inválido.');
        }
    }
}

/**
 * SIMULA el proceso de envío de datos a un servidor.
 * En una aplicación real, esta función haría una llamada API segura.
 * @param {string} touristId - El ID único del pase.
 * @param {string} attractionId - El ID del atractivo que se visita.
 * @param {string} attractionName - El nombre del atractivo.
 * @returns {boolean} - Retorna true para simular el éxito.
 */
function simulateRemoteValidation(touristId, attractionId, attractionName) {
    
    // Estos datos son los que enviarías a tu servidor para registrar la visita.
    console.log("--- REGISTRO DE VALIDACIÓN SIMULADO ---");
    console.log(`Pase Único (Tourist ID): ${touristId}`);
    console.log(`Atractivo (Attraction ID): ${attractionId}`);
    console.log(`Nombre: ${attractionName}`);
    console.log(`Fecha/Hora: ${new Date().toLocaleString()}`);
    console.log("-----------------------------------------");
    
    // Se retorna éxito para que el pase se marque como visitado
    return true; 
}


/**
 * Marca visualmente y guarda en el almacenamiento local un atractivo como visitado.
 * @param {HTMLElement} itemElement - El elemento HTML del atractivo.
 * @param {string} id - El ID único del atractivo.
 */
function markAsValidated(itemElement, id) {
    // 1. Actualizar apariencia visual
    itemElement.classList.add('validated');
    const button = itemElement.querySelector('.validate-btn');
    button.textContent = '✅ Validado';
    
    // 2. Guardar el estado en el almacenamiento local
    let validatedList = JSON.parse(localStorage.getItem(VALIDATED_ATTRACTIONS_KEY)) || [];
    
    if (!validatedList.includes(id)) {
        validatedList.push(id);
        localStorage.setItem(VALIDATED_ATTRACTIONS_KEY, JSON.stringify(validatedList));
    }

    // El mensaje de éxito lo da la función handleValidation
}

/**
 * Carga el estado guardado desde el LocalStorage al iniciar la aplicación.
 */
function loadValidatedAttractions() {
    const validatedList = JSON.parse(localStorage.getItem(VALIDATED_ATTRACTIONS_KEY));
    
    if (validatedList && validatedList.length > 0) {
        validatedList.forEach(id => {
            const itemElement = document.querySelector(`.attraction-item[data-id="${id}"]`);
            if (itemElement) {
                // Aplicar los estilos de "validado"
                itemElement.classList.add('validated');
                // Actualizar el texto del botón
                const button = itemElement.querySelector('.validate-btn');
                if (button) {
                     button.textContent = '✅ Validado';
                }
            }
        });
    }
}

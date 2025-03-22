// Funzione per ottenere il valore di un parametro dall'URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Funzione per decodificare il token JWT
function decodeJWT(token) {
    try {
        const payloadBase64 = token.split('.')[1]; // Prende solo il payload
        const payloadDecoded = atob(payloadBase64); // Decodifica Base64
        return JSON.parse(payloadDecoded); // Converte in JSON
    } catch (e) {
        console.error("Errore nella decodifica del token", e);
        return null;
    }
}

// Controlla se il token è scaduto
function isTokenExpired(exp) {
    const now = Math.floor(Date.now() / 1000); // Ottiene il tempo attuale in secondi (timestamp UNIX)
    return exp < now; // Se exp è nel passato, il token è scaduto
}

// Funzione per caricare la sidebar e il navbar dinamicamente
function loadLayout(callback) {
    fetch("../html/navbar.html").then(res => res.text()).then(data => {
        document.getElementById("navbar-container").innerHTML = data;
    });

    fetch("../html/sidebar.html").then(res => res.text()).then(data => {
        document.getElementById("sidebar-container").innerHTML = data;

        // Dopo che la sidebar è stata caricata, esegui il controllo del token e aggiorna il footer
        const token = getQueryParam("token");
        if (!token) {
            // Se non c'è il token, reindirizza al login
            window.location.href = `https://corewebapp-azcore.up.railway.app/Account/Login?ReturnUrl=${encodeURIComponent(window.location.pathname)}`;
        }

        // Decodifica il token e mostra i dati
        const userData = decodeJWT(token);
        if (userData) {
            console.log("Dati estratti dal token:", userData);

            // Controlla se il token è scaduto
            if (isTokenExpired(userData.exp)) {
                console.warn("Token scaduto! Reindirizzo al login...");
                window.location.href = `https://corewebapp-azcore.up.railway.app/Account/Login?ReturnUrl=${encodeURIComponent(window.location.pathname)}`;
            }

            // Mostra il nome utente e il ruolo nel footer della sidebar
            const usernameElement = document.getElementById("usernameDisplay");
            const roleElement = document.getElementById("userRoleDisplay");

            if (usernameElement && roleElement) {
                usernameElement.innerText = userData.sub; // Mostra l'email o il nome utente
                roleElement.innerText = userData.role; // Mostra il ruolo dell'utente
            } else {
                console.warn("Elementi del footer non trovati.");
            }
        } else {
            console.warn("Token non valido!");
        }

        // Esegui la funzione di callback (se presente)
        if (callback) callback();
    });
}

// Esegui la funzione al caricamento della pagina
document.addEventListener("DOMContentLoaded", function () {
    loadLayout();
});

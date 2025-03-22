// Recupera il token JWT dall'URL
const urlParams = new URLSearchParams(window.location.search);
const urlToken = urlParams.get("token");

// Salva il token nel localStorage se presente
if (urlToken) {
    localStorage.setItem("jwtToken", urlToken);
}

// Verifica che il token sia presente
const token = localStorage.getItem("jwtToken");
if (!token) {
    alert("Token mancante. Accesso non autorizzato.");
    window.location.href = "https://corewebapp-azcore.up.railway.app/";
}

// Carica la sidebar
fetch("sidebar.html")
    .then(response => response.text())
    .then(html => {
        document.getElementById("sidebar-placeholder").innerHTML = html;
        activateSidebar();
        populateSidebarData();
        initSubmenuEvents();
    })
    .catch(error => console.error("Errore caricamento sidebar:", error));

// ✅ Funzione per decodificare il payload di un token JWT
function decodeJwtPayload(token) {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) {
            console.error("❌ Token non valido, formato errato:", token);
            return null;
        }

        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("❌ Errore nella decodifica del token:", e);
        return null;
    }
}

// Attiva il toggle della sidebar principale
function activateSidebar() {
    const toggleBtn = document.getElementById("toggleSidebar");
    const sidebarMenu = document.getElementById("sidebarMenu");

    if (toggleBtn && sidebarMenu) {
        toggleBtn.addEventListener("click", (e) => {
            e.preventDefault();
            sidebarMenu.classList.toggle("collapsed");
        });

        toggleBtn.classList.add("blinking");
        setTimeout(() => toggleBtn.classList.remove("blinking"), 3000);
    }
}

// Mostra nome e ruolo utente nella sidebar
function populateSidebarData() {
    const token = localStorage.getItem("jwtToken");
    if (!token) return;

    const payload = decodeJwtPayload(token);
    if (!payload) return;

    const usernameEl = document.getElementById("usernameDisplay");
    const roleEl = document.getElementById("userRoleDisplay");

    if (usernameEl) usernameEl.textContent = payload.sub || "Utente";
    if (roleEl) roleEl.textContent = payload.role || "";
}

// Attiva il sottomenu "Inserimenti"
function initSubmenuEvents() {
    const toggleInserimenti = document.getElementById("toggleInserimenti");
    const inserimentiSubmenu = document.getElementById("inserimentiSubmenu");

    if (toggleInserimenti && inserimentiSubmenu) {
        toggleInserimenti.addEventListener("click", (e) => {
            e.preventDefault();
            inserimentiSubmenu.classList.toggle("d-none");
        });
    }
}





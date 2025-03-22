// Verifica e recupero del token
const token = localStorage.getItem("jwtToken");
if (!token) {
    alert("Token mancante. Accesso non autorizzato.");
    window.location.href = "https://corewebapp-azcore.up.railway.app/";
}

// Carica dinamicamente la sidebar
fetch("sidebar.html")
    .then(response => response.text())
    .then(html => {
        document.getElementById("sidebar-placeholder").innerHTML = html;
        activateSidebar();
        populateSidebarData();
    })
    .catch(error => console.error("Errore caricamento sidebar:", error));

// Attiva il toggle del menu
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

// Mostra dati utente (nome e ruolo)
function populateSidebarData() {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        document.getElementById("usernameDisplay").textContent = payload.sub || "Utente";
        document.getElementById("userRoleDisplay").textContent = payload.role || "";
    } catch (e) {
        console.error("Errore decodifica token:", e);
    }
}

// Eventi click sulle box (usato / nuovo)
document.addEventListener("DOMContentLoaded", () => {
    const usatoBox = document.getElementById("usatoBox");
    const nuovoBox = document.getElementById("nuovoBox");
    const toggleInserimenti = document.getElementById("toggleInserimenti");
    const inserimentiSubmenu = document.getElementById("inserimentiSubmenu");

    if (usatoBox) {
        usatoBox.addEventListener("click", () => {
            console.log("Auto usata cliccata");
        });
    }

    if (nuovoBox) {
        nuovoBox.addEventListener("click", () => {
            console.log("Auto nuova cliccata");
        });
    }

    if (toggleInserimenti && inserimentiSubmenu) {
        toggleInserimenti.addEventListener("click", (e) => {
            e.preventDefault();
            inserimentiSubmenu.classList.toggle("d-none");
        });
    }
});


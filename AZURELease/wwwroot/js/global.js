// Funzione per ottenere il valore di un parametro dall'URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Recupera il token dall'URL e salvalo in localStorage
const token = getQueryParam("token");
if (token) {
    localStorage.setItem("jwt", token);
} else {
    console.warn("Token non trovato nell'URL, utilizzo quello in localStorage.");
}

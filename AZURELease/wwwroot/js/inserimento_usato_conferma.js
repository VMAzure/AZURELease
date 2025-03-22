document.addEventListener("DOMContentLoaded", () => {
   

    // 2️⃣ Recupera token
    const token = localStorage.getItem("jwtToken");
    if (!token) {
        window.location.href = "https://corewebapp-azcore.up.railway.app/";
        return;
    }

    // 3️⃣ Recupera targa
    const targa = localStorage.getItem("lastInsertedTarga")?.toUpperCase();

    if (!targa) {
        alert("Targa non trovata.");
        window.location.href = "inserimento_usato.html";
        return;
    }

    // 4️⃣ Recupera id_auto tramite la targa
    fetch(`https://coreapi-production-ca29.up.railway.app/api/azlease/usato?targa=${targa}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(res => res.json())
        .then(data => {
            const id_auto = data.id_auto;
            if (!id_auto) throw new Error("ID auto non trovato");

            // 5️⃣ Recupera tutti i dati completi tramite id_auto
            return fetch(`https://coreapi-production-ca29.up.railway.app/api/azlease/dettagli-usato/${id_auto}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        })
        .then(res => res.json())
        .then(dati => {
            console.log("📦 Dati completi ricevuti:", dati);
            window.payload = dati; // ✅ accessibile ovunque
            renderDettagliAuto(dati);

        })
        .catch(err => {
            console.error("❌ Errore nel recupero dei dati:", err);
            alert("Errore nel recupero dei dati dell’auto.");
        });

    function renderDettagliAuto(dati) {
        const container = document.getElementById("dettagliAuto");
        if (!container) return;

        container.innerHTML = ""; // pulizia

        // 🔹 Sezione 1: Dati Veicolo
        renderSezione("Dati Veicolo", {
            "Targa": dati.auto.targa,
            "Anno Immatricolazione": dati.auto.anno_immatricolazione,
            "Data Passaggio Proprietà": dati.auto.data_passaggio_proprieta,
            "Km Certificati": dati.auto.km_certificati,
            "Data Ultimo Intervento": dati.auto.data_ultimo_intervento,
            "Descrizione Intervento": dati.auto.descrizione_ultimo_intervento,
            "Cronologia Tagliandi": dati.auto.cronologia_tagliandi ? "Sì" : "No",
            "Doppie Chiavi": dati.auto.doppie_chiavi ? "Sì" : "No",
            "Colore": dati.auto.colore
        });

        // 🔹 Sezione 2: Dati Inserimento (da Supabase)
        renderSezione("Dati Inserimento", {
            "Prezzo Costo (€)": `${dati.inserimento.prezzo_costo} €`,
            "Prezzo Vendita (€)": `${dati.inserimento.prezzo_vendita} €`,
            "Inserito il": formatData(dati.inserimento.data_inserimento),
            "Ultima modifica": formatData(dati.inserimento.data_ultima_modifica),
            "Visibile": dati.inserimento.visibile ? "Sì" : "No"
        });

        // 🔹 Sezione 3: Dettagli Tecnici Motornet
        renderSezione("Dettagli Tecnici", {
            "Marca": dati.dettagli.marca_nome,
            "Modello": dati.dettagli.modello,
            "Allestimento": dati.dettagli.allestimento,
            "Alimentazione": dati.dettagli.alimentazione,
            "Cavalli (HP)": dati.dettagli.hp,
            "Cilindrata": `${dati.dettagli.cilindrata} cc`,
            "Trazione": dati.dettagli.trazione,
            "Cambio": dati.dettagli.cambio,
            "Porte": dati.dettagli.porte,
            "Posti": dati.dettagli.posti,
            "Bagagliaio": `${dati.dettagli.bagagliaio} L`,
            "Lunghezza": `${dati.dettagli.lunghezza} cm`,
            "Larghezza": `${dati.dettagli.larghezza} cm`,
            "Altezza": `${dati.dettagli.altezza} cm`,
        });

        // Immagine se disponibile
        if (dati.dettagli.immagine) {
            const img = document.createElement("img");
            img.src = dati.dettagli.immagine;
            img.alt = "Immagine veicolo";
            img.className = "img-fluid mt-4 rounded shadow-sm";
            container.appendChild(img);
        }
    }
    function renderSezione(titolo, datiObj) {
        const container = document.getElementById("dettagliAuto");

        const sezione = document.createElement("div");
        sezione.className = "mb-5";

        const titoloEl = document.createElement("h4");
        titoloEl.className = "mb-3 text-primary";
        titoloEl.textContent = titolo;
        sezione.appendChild(titoloEl);

        const row = document.createElement("div");
        row.className = "row g-3";

        Object.entries(datiObj).forEach(([campo, valore]) => {
            const col = document.createElement("div");
            col.className = "col-md-6";

            const icon = getIconaCampo(campo);
            const visualValue = getValoreConBadge(campo, valore);

            col.innerHTML = `
            <div class="border rounded p-2 bg-light shadow-sm d-flex justify-content-between align-items-center small">
                <div class="text-muted">${icon} ${campo}</div>
                <div class="fw-semibold text-end">${visualValue ?? "-"}</div>
            </div>
        `;

            row.appendChild(col);
        });

        sezione.appendChild(row);
        container.appendChild(sezione);
    }


    function formatData(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString("it-IT");
    }
    function getIconaCampo(label) {
        const icone = {
            "Targa": "fas fa-car",
            "Anno Immatricolazione": "fas fa-calendar-alt",
            "Data Passaggio Proprietà": "fas fa-calendar-day",
            "Km Certificati": "fas fa-tachometer-alt",
            "Data Ultimo Intervento": "fas fa-tools",
            "Descrizione Intervento": "fas fa-file-alt",
            "Colore": "fas fa-palette",
            "Prezzo Costo (€)": "fas fa-euro-sign",
            "Prezzo Vendita (€)": "fas fa-euro-sign",
            "Inserito il": "fas fa-plus-circle",
            "Ultima modifica": "fas fa-edit",
            "Marca": "fas fa-industry",
            "Modello": "fas fa-car-side",
            "Allestimento": "fas fa-layer-group",
            "Alimentazione": "fas fa-gas-pump",
            "Cambio": "fas fa-cogs",
            "Trazione": "fas fa-road",
            "Bagagliaio": "fas fa-suitcase",
            "Visibile": "fas fa-eye",
            "Posti": "fas fa-user-friends",
            "Porte": "fas fa-door-open"
        };

        return icone[label]
            ? `<i class="${icone[label]} me-2 text-secondary"></i>`
            : "";
    }
    function getValoreConBadge(label, valore) {
        if (typeof valore === "boolean") {
            return valore
                ? `<span class="badge bg-success">Sì</span>`
                : `<span class="badge bg-danger">No</span>`;
        }

        if (label.toLowerCase() === "visibile") {
            return valore === true
                ? `<span class="badge bg-success">Visibile</span>`
                : `<span class="badge bg-secondary">Nascosta</span>`;
        }

        if (label === "Alimentazione") {
            if (valore?.toLowerCase().includes("ibrido"))
                return `<span class="badge bg-success">${valore}</span>`;
            if (valore?.toLowerCase().includes("elettrica"))
                return `<span class="badge bg-primary">${valore}</span>`;
            return `<span class="badge bg-secondary">${valore}</span>`;
        }

        return valore ?? "-";
    }


});

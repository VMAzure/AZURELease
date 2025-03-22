/*const token = localStorage.getItem("jwtToken");*/
const gridContainer = document.getElementById("marcheGrid");
const payload = {};
let marcheConLogo = {};

function showLoader() {
    const loader = document.getElementById("globalLoader");
    if (loader) loader.classList.remove("d-none");
}

function hideLoader() {
    const loader = document.getElementById("globalLoader");
    if (loader) loader.classList.add("d-none");
}


document.addEventListener("DOMContentLoaded", () => {
    if (!token || !gridContainer) return;

    fetch("https://coreapi-production-ca29.up.railway.app/api/usato/motornet/marche", {
        headers: { Authorization: `Bearer ${token}` }
    })
        .then(res => res.json())
        .then(marche => {
            marcheConLogo = marche.filter(m => !m.logo.includes("no-logo.png"));
            renderMarche(marcheConLogo);
        });

    function renderMarche(lista) {
        gridContainer.innerHTML = "";

        lista.forEach(marca => {
            const col = document.createElement("div");
            col.className = "col text-center";

            const img = document.createElement("img");
            img.src = marca.logo;
            img.alt = marca.nome;
            img.className = "img-fluid logo-marca";
            img.style.cursor = "pointer";

            img.addEventListener("click", () => {
                payload.marca = {
                    acronimo: marca.acronimo,
                    nome: marca.nome
                };

                const searchInput = document.getElementById("searchMarca");
                if (searchInput) searchInput.value = marca.nome;

                gridContainer.classList.add("fade-out");

                setTimeout(() => {
                    gridContainer.classList.remove("fade-out");
                    gridContainer.innerHTML = "";

                    const inputGroup = document.createElement("div");
                    inputGroup.className = "input-group mb-4";

                    const input = document.createElement("input");
                    input.type = "number";
                    input.min = "1900";
                    input.max = new Date().getFullYear();
                    input.placeholder = "Inserisci anno di immatricolazione (es. 2022)";
                    input.className = "form-control";
                    input.id = "annoImmatricolazione";

                    const btn = document.createElement("button");
                    btn.textContent = "Go!";
                    btn.className = "btn btn-primary";
                    btn.id = "goAnno";
                    btn.addEventListener("click", () => {
                    
                        const anno = parseInt(document.getElementById("annoImmatricolazione").value);
                        if (isNaN(anno) || anno < 1900 || anno > new Date().getFullYear()) {
                            alert("Inserisci un anno valido.");
                            return;
                        }
                        payload.anno = anno;

                        showLoader();

                        fetch(`https://coreapi-production-ca29.up.railway.app/api/usato/motornet/modelli/${payload.marca.acronimo}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        })
                            .then(res => {
                                if (!res.ok) throw new Error("Token non valido o scaduto. Status: " + res.status);
                                return res.json();
                            })
                            .then(modelli => {
                                const modelliFiltrati = modelli.filter(modello => {
                                    const inizio = new Date(modello.inizio_produzione).getFullYear();
                                    const fine = modello.fine_produzione
                                        ? new Date(modello.fine_produzione).getFullYear() + 1
                                        : new Date().getFullYear() + 1;
                                    return anno >= inizio && anno <= fine;
                                });

                                renderModelliRaggruppati(modelliFiltrati);
                            })
                            .catch(err => {
                                console.error("Errore nel recupero dei modelli:", err);
                                alert("Errore durante il recupero dei modelli.");
                            })
                            .finally(() => {
                                hideLoader();
                            });
                    });


                    inputGroup.appendChild(input);
                    inputGroup.appendChild(btn);
                    gridContainer.appendChild(inputGroup);
                }, 300);
            });

            col.appendChild(img);

            const label = document.createElement("div");
            label.textContent = marca.nome;
            label.className = "mt-2 small fw-semibold";
            label.style.color = "#00213b";
            col.appendChild(label);

            gridContainer.appendChild(col);
        });
    }

    const searchInput = document.getElementById("searchMarca");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const value = e.target.value.trim().toLowerCase();
            if (value.length >= 3) {
                const filtrate = marcheConLogo.filter(m =>
                    m.nome.toLowerCase().includes(value)
                );
                renderMarche(filtrate);
            } else {
                renderMarche(marcheConLogo);
            }
        });
    }
    const inputDataIntervento = document.getElementById("data_ultimo_intervento");
    const inputDescrizioneIntervento = document.getElementById("descrizione_ultimo_intervento");

    if (inputDataIntervento && inputDescrizioneIntervento) {
        inputDataIntervento.addEventListener("input", () => {
            if (inputDataIntervento.value) {
                inputDescrizioneIntervento.disabled = false;
            } else {
                inputDescrizioneIntervento.disabled = true;
                inputDescrizioneIntervento.value = ""; // reset se tolta la data
            }
        });
    }

});

function renderModelliRaggruppati(modelli) {
    const container = document.getElementById("modelliGrid");
    if (!container) return;

    container.innerHTML = "";
    container.classList.remove("d-none");

    const gruppi = {};
    modelli.forEach(modello => {
        if (!gruppi[modello.gruppo_storico]) {
            gruppi[modello.gruppo_storico] = [];
        }
        gruppi[modello.gruppo_storico].push(modello);
    });

    Object.keys(gruppi).forEach(gruppo => {
        const wrapper = document.createElement("div");
        wrapper.className = "mb-4";

        const header = document.createElement("div");
        header.className = "d-flex align-items-center mb-2 gruppo-header";
        header.style.cursor = "pointer";

        const img = document.createElement("img");
        img.src = `https://cdn.imagin.studio/getImage?customer=it-azureautomotive&make=${payload.marca.nome}&modelFamily=${encodeURIComponent(gruppo)}&angle=29&tailoring=azure&zoomType=fullscreen&zoomLevel=1`;
        img.alt = gruppo;
        img.className = "img-fluid me-3";
        img.style.maxHeight = "60px";

        const title = document.createElement("h5");
        title.textContent = gruppo;
        title.className = "m-0";

        header.appendChild(img);
        header.appendChild(title);
        wrapper.appendChild(header);

        const varianti = document.createElement("div");
        varianti.className = "row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 mt-2 varianti-toggle d-none";

        gruppi[gruppo].forEach(modello => {
            const col = document.createElement("div");
            col.className = "col";

            const card = document.createElement("div");
            card.className = "p-3 border rounded shadow-sm text-center bg-light modello-card";
            card.style.cursor = "pointer";
            card.textContent = modello.descrizione;

            card.addEventListener("click", () => {
                showLoader();

                fetch(`https://coreapi-production-ca29.up.railway.app/api/usato/motornet/allestimenti/${payload.marca.acronimo}/${modello.codice_desc_modello}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                    .then(res => res.json())
                    .then(allestimenti => {
                        if (!Array.isArray(allestimenti) || allestimenti.length === 0) {
                            alert("Nessun allestimento trovato.");
                            return;

                        }

                        container.innerHTML = "";
                        container.classList.remove("d-none");

                        const searchInput = document.createElement("input");
                        searchInput.type = "text";
                        searchInput.placeholder = "Cerca versione o motorizzazione...";
                        searchInput.className = "form-control mb-3";
                        searchInput.id = "searchAllestimenti";
                        container.appendChild(searchInput);

                        const allestimentiContainer = document.createElement("div");
                        container.appendChild(allestimentiContainer);

                        function renderVersioni(filteredList, nomeModello) {
                            allestimentiContainer.innerHTML = "";

                            const row = document.createElement("div");
                            row.className = "row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3";

                            filteredList.forEach(versione => {
                                const col = document.createElement("div");
                                col.className = "col";

                                const card = document.createElement("div");
                                card.className = "p-3 border rounded shadow-sm bg-white text-center versione-card";
                                card.style.cursor = "pointer";
                                card.textContent = versione.versione;

                                card.addEventListener("click", () => {
                                    payload.codice_univoco = versione.codice_univoco;

                                    const titolo = document.getElementById("titoloFormUsato");
                                    if (titolo) {
                                        const marca = payload.marca.nome;
                                        const allestimento = versione.versione;
                                        titolo.innerHTML = `Inserisci dati per <strong>${marca} ${nomeModello}</strong><br><small class="text-muted">${allestimento}</small>`;
                                    }

                                    const formBox = document.getElementById("formInserimentoContainer");
                                    if (formBox) {
                                        formBox.classList.remove("d-none");
                                        formBox.scrollIntoView({ behavior: "smooth", block: "start" });
                                    }
                                });

                                col.appendChild(card);
                                row.appendChild(col);
                            });

                            allestimentiContainer.appendChild(row);
                        }


                        renderVersioni(allestimenti, modello.gruppo_storico);

                        searchInput.addEventListener("input", () => {
                            const value = searchInput.value.trim().toLowerCase();
                            const filtrati = allestimenti.filter(v => v.versione.toLowerCase().includes(value));
                            renderVersioni(filtrati);
                        });
                    })
                    .catch(err => {
                        console.error("Errore nel recupero degli allestimenti:", err);
                        alert("Errore durante il recupero degli allestimenti.");
                    })
                    
                    .finally(() => {
                        hideLoader();

                    });

            });

            col.appendChild(card);
            varianti.appendChild(col);
        });

        header.addEventListener("click", () => {
            varianti.classList.toggle("d-none");
        });

        wrapper.appendChild(varianti);
        container.appendChild(wrapper);
    });
}

document.getElementById("formInserimentoUsato").addEventListener("submit", (e) => {
    e.preventDefault();
    showLoader();

    const dataUltimo = document.getElementById("data_ultimo_intervento").value;
    const descrizioneUltimo = document.getElementById("descrizione_ultimo_intervento").value;

    const body = {
        targa: document.getElementById("targa").value.toUpperCase(),
        anno_immatricolazione: payload.anno,
        data_passaggio_proprieta: document.getElementById("data_passaggio_proprieta").value,
        km_certificati: parseInt(document.getElementById("km_certificati").value),
        data_ultimo_intervento: dataUltimo || new Date().toISOString().split("T")[0],
        descrizione_ultimo_intervento: dataUltimo ? descrizioneUltimo : "Lavaggio",
        cronologia_tagliandi: document.getElementById("cronologia_tagliandi").checked,
        doppie_chiavi: document.getElementById("doppie_chiavi").checked,
        codice_motornet: payload.codice_univoco,
        colore: document.getElementById("colore").value,
        prezzo_costo: parseFloat(document.getElementById("prezzo_costo").value),
        prezzo_vendita: parseFloat(document.getElementById("prezzo_vendita").value),
        immagini: [],
        danni: [],
        opzionato_da: null,
        opzionato_il: null,
        venduto_da: null,
        venduto_il: null,
        visibile: true
    };

    fetch("https://coreapi-production-ca29.up.railway.app/api/azlease/usato", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
    })
        .then(res => {
            if (!res.ok) throw new Error("Errore nell'inserimento. Status: " + res.status);
            return res.json();
        })
        .then(data => {
            console.log("✅ Inserimento riuscito:", data);
            hideLoader();

            localStorage.setItem("lastInsertedTarga", document.getElementById("targa").value.toUpperCase());
            window.location.href = `inserimento_usato_conferma.html`;
        })

        .catch(err => {
            console.error("❌ Errore nell'inserimento:", err);
            alert("Errore durante l'inserimento dell'auto.");
            hideLoader();

        });
});


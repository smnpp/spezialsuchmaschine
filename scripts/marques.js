import { dbpediaUrl } from './util.js';  // Si dbpediaUrl est dans util.js
import { escapeHtml } from './util.js';  // Importation de escapeHtml
import { createElementFromHtml } from './util.js';  // Importation de createElementFromHtml
import { requete_marques } from './requetes.js';  // Importation de requete_marques

async function fetchMarques() {
    console.log("fetchMarques");

    try {
        const url = dbpediaUrl(requete_marques());  // La requête SPARQL enrichie
        const reponse = await fetch(url);
        if (!reponse.ok) {
            throw new Error("Network response was not ok");
        }

        const donnees = await reponse.json();
        return donnees.results.bindings.map((x) => {
            const logoURL = x.thumbnail?.value || x.logo?.value || null;

            // Corriger les URLs Wikimedia Commons
            const correctedLogoURL = logoURL?.includes("w/index.php?title=Special:Redirect/file/")
                ? logoURL.replace("w/index.php?title=Special:Redirect/file/", "wiki/Special:FilePath/")
                : logoURL;

            return {
                brandURL: x.brand.value,
                brandName: x.label?.value || extractBrandName(x.brand.value),
                dateFondation: x.foundingDate?.value || x.introduced?.value || x.foundingYear?.value || 'Date non disponible',
                logoURL: correctedLogoURL
            };
        });
    } catch (error) {
        console.error("Error fetching marques:", error);
        return [];
    }
}

function extractBrandName(url) {
    const parts = url.split('/');
    return parts[parts.length - 1];  // Retourne la dernière partie de l'URL
}

async function init() {
    console.log("init");
    const marques = await fetchMarques();
    renderMarques(marques);
}

function renderMarques(marques) {
    console.log("renderMarques");

    const marquesSpinnerContainer = document.getElementById('spinner');
    if (marquesSpinnerContainer) marquesSpinnerContainer.remove();

    const marquesList = document.getElementById('marques-list');
    marquesList.innerHTML = '';  // Réinitialiser la liste avant de l'afficher

    if (marques.length === 0) {
        marquesList.innerHTML = "<li>No marques found.</li>";
        return;
    }

    for (const marque of marques) {
        const listItem = createElementFromHtml(`
            <li class="marque-element">
                <a href="marque.html?uri=${encodeURIComponent(marque.brandURL)}" class="brand-link">
                    <span class="brand-name">${escapeHtml(marque.brandName)}</span>
                </a>
                <span class="founding-date">Founding Date: ${marque.dateFondation}</span>
                ${
                    marque.logoURL 
                    ? `<img src="${marque.logoURL}" alt="${escapeHtml(marque.brandName)} logo" style="width:100px; height:auto;">`
                    : `<span>Logo non disponible</span>`
                }
            </li>
        `);
        marquesList.append(listItem);
    }
}

init();

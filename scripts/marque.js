import { dbpediaUrl } from './util.js';
import { escapeHtml } from './util.js';
import { requete_details_marque } from './requetes.js';

// Fonction pour extraire l'URI de la marque depuis l'URL
function getBrandURIFromQuery() {
    console.debug("[getBrandURIFromQuery] Extraction de l'URI depuis l'URL.");
    const params = new URLSearchParams(window.location.search);
    const uri = params.get('uri');
    console.debug(`[getBrandURIFromQuery] URI extraite : ${uri}`);
    return uri; // Récupère l'URI
}

async function fetchBrandDetails(brandURI) {
    try {
        const url = dbpediaUrl(requete_details_marque(brandURI));
        console.log("SPARQL URL:", url); // Log l'URL de la requête
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données");
        }

        const data = await response.json();
        console.log("SPARQL Response:", data); // Log la réponse entière

        if (!data.results || !data.results.bindings || data.results.bindings.length === 0) {
            console.error("Aucun résultat trouvé pour l'URI :", brandURI);
            return null;
        }

        const results = data.results.bindings[0];
        console.log("Données de la marque:", results); // Log les données de la marque

        return {
            label: results.label?.value || 'Nom non disponible',
            abstract: results.abstract?.value || 'Description non disponible',
            logo: results.thumbnail?.value || results.logo?.value || null,
            foundingDate: results.foundingDate?.value || 'Date de fondation non disponible',
            introduced: results.introduced?.value || 'Date d’introduction non disponible',
            website: results.website?.value || null,
            founder: results.ownersLabel?.value || 'Propriétaires non disponible',
            products: results.product?.value || 'Produits non disponibles',
            revenue: results.revenue?.value || 'Chiffre d’affaires non disponible',
        };
    } catch (error) {
        console.error("Erreur lors de la récupération ou du traitement des données SPARQL:", error);
    }
}

// Fonction pour afficher les informations de la marque
function renderBrandDetails(brand) {
    const container = document.getElementById('brand-details');

    if (!brand) {
        container.innerHTML = "<p>Impossible de charger les détails de la marque. Vérifiez l'URI ou réessayez plus tard.</p>";
        return;
    }

    const html = `
        <h2>${escapeHtml(brand.label)}</h2>
        ${brand.logo ? `<img src="${brand.logo}" alt="Logo de ${escapeHtml(brand.label)}">` : ''}
        <p><strong>Description :</strong> ${escapeHtml(brand.abstract)}</p>
        <p><strong>Date de fondation :</strong> ${escapeHtml(brand.foundingDate)}</p>
        <p><strong>Date d’introduction :</strong> ${escapeHtml(brand.introduced)}</p>
        <p><strong>Propriétaire(s) :</strong> ${escapeHtml(brand.founder)}</p>
        <p><strong>Produits notables :</strong> ${escapeHtml(brand.products)}</p>
        <p><strong>Chiffre d’affaires :</strong> ${escapeHtml(brand.revenue)}</p>
        ${brand.website ? `<p><strong>Site officiel :</strong> <a href="${brand.website}" target="_blank">${escapeHtml(brand.website)}</a></p>` : ''}
    `;

    container.innerHTML = html;
}


// Fonction principale pour initialiser la page
async function init() {
    console.debug("[init] Initialisation de la page.");

    const brandURI = getBrandURIFromQuery();

    if (!brandURI) {
        console.warn("[init] Aucune URI spécifiée dans les paramètres de l'URL.");
        document.getElementById('brand-details').innerHTML = "<p>Aucune marque spécifiée.</p>";
        return;
    }

    console.debug(`[init] URI spécifiée : ${brandURI}`);

    const brandDetails = await fetchBrandDetails(brandURI);
    renderBrandDetails(brandDetails);

    console.debug("[init] Initialisation terminée.");
}

// Lancer l'initialisation
init();

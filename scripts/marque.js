function getBrandNameFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("name");
}

// Fonction pour exécuter une requête SPARQL
async function executeSparqlQuery(sparqlQuery) {
    const endpointUrl = "https://dbpedia.org/sparql";
    const fullUrl = `${endpointUrl}?query=${encodeURIComponent(
        sparqlQuery
    )}&format=json`;

    try {
        const response = await fetch(fullUrl);
        const data = await response.json();
        return data.results.bindings;
    } catch (error) {
        console.error("Erreur lors de la requête SPARQL :", error);
        return [];
    }
}

// Fonction générique pour récupérer une valeur unique
function getValue(results, key) {
    return (
        results.find(binding => binding[key])?.[key]?.value || "Non disponible"
    );
}

// Fonction générique pour récupérer des valeurs multiples sans doublons
function getUniqueValues(results, key) {
    return [
        ...new Set(
            results
                .filter(binding => binding[key])
                .map(binding => binding[key].value)
        )
    ];
}

function updateContainer(containerId, content) {
    const container = document.getElementById(containerId);
    const parent = container.parentElement;
    if (content && content !== "Non disponible") {
        container.textContent = content; // Met à jour le contenu
        container.style.display = ""; // Affiche le conteneur s'il était masqué
    } else {
        // container.textContent = "Donnée non disponible"; // Masque le conteneur s'il est vide
        parent.style.display = "none"; // Masque le container
    }
}

async function displayBrandInfo() {
    const brandName = getBrandNameFromURL();

    if (!brandName) {
        console.error("Nom de la marque manquant dans l'URL.");
        return;
    }

    // Récupérer les informations via des requêtes segmentées
    const labelResults = await executeSparqlQuery(getBrandLabel(brandName));
    const abstractResults = await executeSparqlQuery(
        getBrandAbstract(brandName)
    );
    const thumbnailResults = await executeSparqlQuery(
        getBrandThumbnail(brandName)
    );
    const foundingDateResults = await executeSparqlQuery(
        getBrandFoundingDate(brandName)
    );
    const introducedResults = await executeSparqlQuery(
        getBrandIntroduced(brandName)
    );
    const revenueResults = await executeSparqlQuery(getBrandRevenue(brandName));

    const productsResults = await executeSparqlQuery(
        getBrandProducts(brandName)
    );

    const ownersResults = await executeSparqlQuery(getBrandOwners(brandName));
    console.log(ownersResults);

    const websiteResults = await executeSparqlQuery(getBrandWebsite(brandName));

    const locationCityResults = await executeSparqlQuery(
        getBrandLocationCity(brandName)
    );

    const founderResults = await executeSparqlQuery(getBrandFounder(brandName));

    const label = getValue(labelResults, "label");
    const abstract = getValue(abstractResults, "abstract");
    const thumbnail = getValue(thumbnailResults, "thumbnail");
    const foundingDate = getValue(foundingDateResults, "foundingDate");
    const introduced = getValue(introducedResults, "introduced");
    const revenue = getValue(revenueResults, "revenue");
    const products = getUniqueValues(productsResults, "product");
    const owners = getUniqueValues(ownersResults, "ownersLabel");
    const website = getValue(websiteResults, "website");
    const locationCity = getUniqueValues(
        locationCityResults,
        "locationCityName"
    );
    const founder = getUniqueValues(founderResults, "founderLabel");

    updateContainer("brand-title", label);
    updateContainer("brand-abstract", abstract);
    updateContainer("fondation-year", foundingDate);
    updateContainer("introduction-year", introduced);
    updateContainer("revenue", revenue);
    updateContainer("location-city", locationCity.join(", "));
    updateContainer("products", products.join(", "));
    updateContainer("owners", owners.join(", "));
    updateContainer("founder", founder.join(", "));

    const imagesContainer = document.getElementById("brand-thumbnail");
    imagesContainer.innerHTML = ""; // Réinitialiser le conteneur
    if (thumbnail !== "Non disponible") {
        const img = document.createElement("img");
        img.src = thumbnail;
        img.alt = "";
        img.style.maxWidth = "100%";
        img.style.borderRadius = "8px";
        imagesContainer.appendChild(img);
    } else {
        imagesContainer.textContent = "Image non disponible.";
    }

    const websiteContainer = document.getElementById("website");
    if (website !== "Non disponible") {
        const link = document.createElement("a");
        link.href = website;
        link.textContent = `Site officiel de ${label}`;
        link.target = "_blank"; // Ouvrir dans un nouvel onglet
        link.rel = "noopener noreferrer"; // Bonnes pratiques de sécurité
        link.style.color = "#007bff";
        link.style.textDecoration = "none";

        link.addEventListener(
            "mouseover",
            () => (link.style.textDecoration = "underline")
        );
        link.addEventListener(
            "mouseout",
            () => (link.style.textDecoration = "none")
        );

        websiteContainer.innerHTML = ""; // Réinitialiser le conteneur
        websiteContainer.appendChild(link);
    } else {
        websiteContainer.style.display = "none";
    }
}

// Exécuter la fonction lors du chargement de la page
document.addEventListener("DOMContentLoaded", displayBrandInfo);

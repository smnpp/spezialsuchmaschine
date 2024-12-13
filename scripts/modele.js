// Récupérer le nom du modèle depuis l'URL
function getModelNameFromURL() {
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

// Fonction pour afficher les modèles associés sous forme de liens
function displayRelatedModels(results, containerId) {
    const container = document.getElementById(containerId);
    const parent = container.parentElement;
    container.innerHTML = ""; // Réinitialiser le conteneur

    const relatedURIs = getUniqueValues(results, "relatedMeanOfTransportation");
    const relatedLabels = getUniqueValues(
        results,
        "relatedMeanOfTransportationLabel"
    );

    if (relatedURIs.length > 0 && relatedLabels.length > 0) {
        relatedURIs.forEach((uri, index) => {
            const label = relatedLabels[index] || "Lien inconnu";
            const modelName = uri.split("/").pop();
            const link = document.createElement("a");
            link.href = `modele.html?name=${encodeURIComponent(modelName)}`;
            link.textContent = label;
            link.style.display = "block";
            link.style.color = "#007bff";
            link.style.textDecoration = "none";
            link.style.marginBottom = "5px";
            link.addEventListener(
                "mouseover",
                () => (link.style.textDecoration = "underline")
            );
            link.addEventListener(
                "mouseout",
                () => (link.style.textDecoration = "none")
            );
            container.appendChild(link);
        });
    } else {
        parent.style.display = "none";
    }
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

function displayManufacturer(results, containerId) {
    const container = document.getElementById(containerId);
    const parent = container.parentElement;
    container.innerHTML = ""; // Réinitialiser le conteneur

    const relatedURIs = getUniqueValues(results, "manufacturer");
    const relatedLabels = getUniqueValues(results, "manufacturerLabel");

    if (relatedURIs.length > 0 && relatedLabels.length > 0) {
        relatedURIs.forEach((uri, index) => {
            const label = relatedLabels[index] || "Lien inconnu";
            const brandName = uri.split("/").pop();
            const link = document.createElement("a");
            link.href = `marque.html?name=${encodeURIComponent(brandName)}`;
            link.textContent = label;
            link.style.display = "block";
            link.style.color = "#007bff";
            link.style.textDecoration = "none";
            link.style.marginBottom = "5px";
            link.addEventListener(
                "mouseover",
                () => (link.style.textDecoration = "underline")
            );
            link.addEventListener(
                "mouseout",
                () => (link.style.textDecoration = "none")
            );
            container.appendChild(link);
        });
    } else {
        parent.style.display = "none";
    }
}

// Fonction principale pour afficher les informations du modèle
async function displayModelInfo() {
    const modelName = getModelNameFromURL();

    if (!modelName) {
        console.error("Nom du modèle manquant dans l'URL.");
        return;
    }

    // Récupérer les informations via des requêtes segmentées
    const labelResults = await executeSparqlQuery(getModelLabel(modelName));
    const abstractResults = await executeSparqlQuery(
        getModelAbstract(modelName)
    );
    const productionResults = await executeSparqlQuery(
        getModelProduction(modelName)
    );
    const designerResults = await executeSparqlQuery(
        getModelDesigner(modelName)
    );
    const layoutResults = await executeSparqlQuery(getModelLayout(modelName));
    const engineResults = await executeSparqlQuery(getModelEngine(modelName));
    const manufacturerResults = await executeSparqlQuery(
        getModelManufacturer(modelName)
    );
    const relatedModelsResults = await executeSparqlQuery(
        getModelRelatedMeanOfTransportation(modelName)
    );
    const imageResults = await executeSparqlQuery(getModelImage(modelName));
    console.log(imageResults);

    // Extraire les informations
    const label = getValue(labelResults, "label");
    const abstract = getValue(abstractResults, "abstract");
    const productionYear = getValue(productionResults, "production");
    const designers =
        getUniqueValues(designerResults, "designerName").join(", ") ||
        "Non disponible";
    const layout =
        getUniqueValues(layoutResults, "layoutLabel").join(", ") ||
        "Non disponible";
    const engine = getValue(engineResults, "engine");
    const manufacturer = getValue(manufacturerResults, "manufacturerLabel");
    const imageSrc = getValue(imageResults, "image");

    // Mettre à jour les éléments HTML
    // document.getElementById("model-title").textContent = label;
    updateContainer("model-title", label);
    updateContainer("model-description", abstract);
    updateContainer("production-year", productionYear);
    updateContainer("designers", designers);
    updateContainer("layout", layout);
    updateContainer("engine", engine);

    // affiche la marque
    displayManufacturer(manufacturerResults, "manufacturer");

    // Afficher les modèles associés
    displayRelatedModels(relatedModelsResults, "related-transport");

    // Afficher l'image
    const imagesContainer = document.getElementById("images");
    imagesContainer.innerHTML = ""; // Réinitialiser le conteneur
    if (imageSrc !== "Non disponible") {
        const img = document.createElement("img");
        img.src = imageSrc;
        img.alt = `Image du modèle ${label}`;
        img.style.maxWidth = "100%";
        img.style.borderRadius = "8px";
        imagesContainer.appendChild(img);
    } else {
        imagesContainer.textContent = "Image non disponible.";
    }
}

// Exécuter la fonction lors du chargement de la page
document.addEventListener("DOMContentLoaded", displayModelInfo);

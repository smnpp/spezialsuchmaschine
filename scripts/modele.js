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

// Fonction pour mettre à jour les informations sur la page
async function displayModelInfo() {
    const modelName = getModelNameFromURL(); // Récupère le nom du modèle depuis l'URL

    if (!modelName) {
        console.error("Nom du modèle manquant dans l'URL.");
        return;
    }

    const query = getModelInformations(modelName);
    const results = await executeSparqlQuery(query);
    console.log(results);

    // Fonction pour éliminer les doublons dans un tableau
    const removeDuplicates = array => [...new Set(array)];

    // Fonction pour récupérer une valeur unique
    const getValue = (bindings, key) =>
        bindings.find(binding => binding[key])?.[key]?.value ||
        "Non disponible";

    // Fonction pour récupérer et dédupliquer les valeurs multiples
    const getUniqueValues = (bindings, key) =>
        removeDuplicates(
            bindings
                .filter(binding => binding[key])
                .map(binding => binding[key].value)
        );

    // Extraire et afficher les informations
    const label = getValue(results, "label");
    const abstract = getValue(results, "abstract");
    const productionYear = getValue(results, "production");
    const designers =
        getUniqueValues(results, "designerName").join(", ") || "Non disponible";
    const layout =
        getUniqueValues(results, "layoutLabel").join(", ") || "Non disponible";
    const engine = getValue(results, "engine");
    const manufacturer = getValue(results, "manufacturerLabel");
    const imageSrc = getValue(results, "image");

    // Gérer les modèles associés sous forme de liens
    const relatedTransportContainer =
        document.getElementById("related-transport");
    relatedTransportContainer.innerHTML = ""; // Réinitialiser le conteneur
    const relatedTransportURIs = getUniqueValues(
        results,
        "relatedMeanOfTransportation"
    );
    const relatedTransportLabels = getUniqueValues(
        results,
        "relatedMeanOfTransportationLabel"
    );

    if (relatedTransportURIs.length > 0 && relatedTransportLabels.length > 0) {
        relatedTransportURIs.forEach((uri, index) => {
            const label = relatedTransportLabels[index];
            const modelName = uri.split("/").pop(); // Extraire le nom du modèle depuis l'URI
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
            relatedTransportContainer.appendChild(link);
        });
    } else {
        relatedTransportContainer.textContent = "Non disponible";
    }

    // Mettre à jour les éléments HTML
    document.getElementById("model-title").textContent = label;
    document.getElementById("model-description").textContent = abstract;
    document.getElementById("production-year").textContent = productionYear;
    document.getElementById("designers").textContent = designers;
    document.getElementById("layout").textContent = layout;
    document.getElementById("engine").textContent = engine;
    document.getElementById("manufacturer").textContent = manufacturer;

    // Mettre à jour les images
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

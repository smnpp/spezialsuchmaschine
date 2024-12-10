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
        ).join(", ") || "Non disponible";

    // Extraire et afficher les informations
    const label = getValue(results, "label");
    const abstract = getValue(results, "abstract");
    const productionYear = getValue(results, "production");
    const designers = getUniqueValues(results, "designerName");
    const layout = getUniqueValues(results, "layoutLabel");
    const engine = getValue(results, "engine");
    const manufacturer = getValue(results, "manufacturerLabel");
    // Gérer les modèles associés sous forme de liens
    const relatedTransport = getUniqueValues(
        results,
        "relatedMeanOfTransportationLabel"
    );
    /*
    const relatedTransportContainer =
        document.getElementById("related-transport");
    relatedTransportContainer.innerHTML = ""; // Réinitialiser le conteneur
    if (relatedTransport.length > 0) {
        relatedTransport.forEach(model => {
            const link = document.createElement("a");
            const modelSlug = getValue(results, "relatedMeanOfTransportation"); // Convertir le nom du modèle pour l'URL
            // link.href = `modele.html?name=${modelSlug}`;
            link.href = `${modelSlug}`;
            link.textContent = model;
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
        */

    // Mettre à jour les éléments HTML
    document.getElementById("model-title").textContent = label;
    document.getElementById("model-description").textContent = abstract;
    document.getElementById("production-year").textContent = productionYear;
    document.getElementById("designers").textContent = designers;
    document.getElementById("layout").textContent = layout;
    document.getElementById("engine").textContent = engine;
    document.getElementById("manufacturer").textContent = manufacturer;
    document.getElementById("related-transport").textContent = relatedTransport;
}

// Exécuter la fonction lors du chargement de la page
document.addEventListener("DOMContentLoaded", displayModelInfo);

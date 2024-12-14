// Récupération des éléments de l'interface
const searchInput = document.getElementById("search");

// Fonction pour exécuter une requête SPARQL
async function executeSparqlQuery(sparqlQuery) {
    const endpointUrl = "https://dbpedia.org/sparql";
    const fullUrl = `${endpointUrl}?query=${encodeURIComponent(
        sparqlQuery
    )}&format=json`;

    try {
        const response = await fetch(fullUrl);
        const data = await response.json();
        return data.results.bindings; // Retourne les résultats
    } catch (error) {
        console.error("Erreur lors de la requête SPARQL :", error);
        return [];
    }
}

// Fonction pour créer dynamiquement le conteneur des résultats
function createResultsContainer() {
    let container = document.getElementById("search-autocomplete");
    if (!container) {
        container = document.createElement("div");
        container.id = "search-autocomplete";
        container.style.position = "absolute";
        container.style.width = "100%";
        container.style.background = "white";
        container.style.border = "1px solid #ccc";
        container.style.borderRadius = "4px";
        container.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
        container.style.maxHeight = "200px";
        container.style.overflowY = "auto";
        container.style.zIndex = "10";
        searchInput.parentNode.appendChild(container);
    }
    return container;
}

// Fonction pour supprimer dynamiquement le conteneur des résultats
function removeResultsContainer() {
    const container = document.getElementById("search-autocomplete");
    if (container) {
        container.remove();
    }
}

// Fonction pour afficher les résultats dans le conteneur
function displayResults(modelsResults, brandsResults) {
    let container = document.getElementById("search-autocomplete");

    // Si le conteneur n'existe pas, créez-le
    if (!container) {
        container = document.createElement("div");
        container.id = "search-autocomplete";
        container.style.marginTop = "10px";
        searchInput.parentNode.appendChild(container);
    }

    // Réinitialiser le conteneur
    container.innerHTML = "";

    const titleModel = document.createElement("h3");
    titleModel.textContent = "Modèles";
    titleModel.style.margin = "10px 0";
    titleModel.style.color = "#333";
    container.appendChild(titleModel);

    modelsResults.forEach(result => {
        addLineResult(
            "modele",
            result.modelLabel.value,
            result.model.value,
            container
        );
    });

    const brandTitle = document.createElement("h3");
    brandTitle.textContent = "Marques";
    brandTitle.style.margin = "10px 0";
    brandTitle.style.color = "#333";
    container.appendChild(brandTitle);

    brandsResults.forEach(result => {
        addLineResult(
            "marque",
            result.manufacturerLabel.value,
            result.manufacturer.value,
            container
        );
    });
}

function addLineResult(type, label, name, container) {
    const suggestion = document.createElement("div");
    suggestion.textContent = label;
    suggestion.style.padding = "10px";
    suggestion.style.cursor = "pointer";
    suggestion.style.borderBottom = "1px solid #f0f0f0";

    // Créer un lien vers la page du modèle
    const modelLink = document.createElement("a");
    modelLink.href = `${type}.html?name=${encodeURIComponent(
        name.split("/").pop()
    )}`;
    modelLink.textContent = label;
    modelLink.style.textDecoration = "none";
    modelLink.style.color = "black";

    suggestion.innerHTML = "";
    suggestion.appendChild(modelLink);

    suggestion.addEventListener("click", () => {
        window.location.href = modelLink.href;
        container.innerHTML = ""; // Vider les résultats après sélection
    });

    suggestion.addEventListener("mouseover", () => {
        suggestion.style.backgroundColor = "#f4f4f4";
    });

    suggestion.addEventListener("mouseout", () => {
        suggestion.style.backgroundColor = "white";
    });

    container.appendChild(suggestion);
}

// Gestion de l'événement de saisie dans la barre de recherche
searchInput.addEventListener("input", async () => {
    const userInput = searchInput.value.trim();

    // Si l'entrée est vide, supprimer les résultats
    if (userInput.length < 1) {
        const container = document.getElementById("search-autocomplete");
        if (container) {
            container.innerHTML = ""; // Réinitialiser les résultats
        }
        return;
    }

    const modelsQuery = getDeutchModelSearchQuery(userInput);
    const modelsResults = await executeSparqlQuery(modelsQuery);
    const brandsQuery = getDeutchCarBrand(userInput);
    const brandsResults = await executeSparqlQuery(brandsQuery);
    displayResults(modelsResults, brandsResults);
});

// Supprimer le conteneur lorsque l'utilisateur clique en dehors
document.addEventListener("click", event => {
    if (!searchInput.contains(event.target)) {
        removeResultsContainer();
    }
});

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
// Fonction pour afficher les résultats directement dans le conteneur de recherche
function displayResults(results) {
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

    if (results.length === 0) {
        container.innerHTML = "<div>Aucun résultat trouvé.</div>";
        return;
    }

    // Ajoutez les résultats
    results.forEach(result => {
        const suggestion = document.createElement("div");
        suggestion.textContent = result.modelLabel.value;
        suggestion.style.padding = "10px";
        suggestion.style.cursor = "pointer";
        suggestion.style.borderBottom = "1px solid #f0f0f0";

        suggestion.addEventListener("click", () => {
            searchInput.value = result.modelLabel.value;
            container.innerHTML = ""; // Vider les résultats après sélection
        });

        suggestion.addEventListener("mouseover", () => {
            suggestion.style.backgroundColor = "#f4f4f4";
        });

        suggestion.addEventListener("mouseout", () => {
            suggestion.style.backgroundColor = "white";
        });

        container.appendChild(suggestion);
    });
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

    const sparqlQuery = getDeutchModelSearchQuery(userInput);
    const results = await executeSparqlQuery(sparqlQuery);
    displayResults(results);
});

// Supprimer le conteneur lorsque l'utilisateur clique en dehors
document.addEventListener("click", event => {
    if (!searchInput.contains(event.target)) {
        removeResultsContainer();
    }
});

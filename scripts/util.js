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

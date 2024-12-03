function getModelSearchQuery(userInput) {
    return `
    PREFIX dct: <http://purl.org/dc/terms/>

    SELECT DISTINCT ?model ?modelLabel
    WHERE {
        ?model dbo:manufacturer dbr:BMW .
        ?model dct:subject dbc:BMW_vehicles.
        ?model rdf:type dbo:Automobile.

        ?model rdfs:label ?modelLabel .
        FILTER(REGEX(STR(?modelLabel), "${userInput}", "i")) .
        FILTER(LANG(?modelLabel) IN ("fr")).
    }
    `;
}

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

function getDeutchModelSearchQuery(userInput) {
    return `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX dbc: <http://dbpedia.org/resource/Category:>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dct: <http://purl.org/dc/terms/>

    SELECT DISTINCT ?model ?modelLabel ?manufacturer ?manufacturerLabel
    WHERE {
        ?manufacturer dct:subject dbc:Car_manufacturers_of_Germany .

        ?model dbo:manufacturer ?manufacturer .
        ?model rdf:type dbo:Automobile .

        ?model rdfs:label ?modelLabel .
        FILTER(LANG(?modelLabel) = "fr") .
        ?manufacturer rdfs:label ?manufacturerLabel .
        FILTER(LANG(?manufacturerLabel) = "fr") .
        FILTER(REGEX(STR(?modelLabel), "${userInput}", "i")) .
    }
    `;
}

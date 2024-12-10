function getDeutchModelSearchQuery(userInput) {
    return `
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX dbc: <http://dbpedia.org/resource/Category:>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dct: <http://purl.org/dc/terms/>

    SELECT DISTINCT ?model ?modelLabel ?manufacturer ?manufacturerLabel
    WHERE {
        ?manufacturer dct:subject dbc:Car_manufacturers_of_Germany .

        ?model (dbo:manufacturer|dbp:manufacturer) ?manufacturer .
        ?model rdf:type dbo:Automobile .

        ?model rdfs:label ?modelLabel .
        FILTER(LANG(?modelLabel) = "fr") .
        ?manufacturer rdfs:label ?manufacturerLabel .
        FILTER(LANG(?manufacturerLabel) = "fr") .
        FILTER(REGEX(STR(?modelLabel), "${userInput}", "i")) .
    }
    LIMIT 10
    `;
}

function getModelInformations(userInput) {
    return `PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX dbp: <http://dbpedia.org/property/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dbr: <http://dbpedia.org/resource/>

SELECT DISTINCT ?label ?abstract ?production ?designerName ?layoutLabel ?engine ?manufacturerLabel ?relatedMeanOfTransportation ?relatedMeanOfTransportationLabel ?image
WHERE {
    # Nom et description du modèle
    dbr:${userInput} rdfs:label ?label .
    dbr:${userInput} dbo:abstract ?abstract .
    FILTER(LANG(?label) = "fr") .
    FILTER(LANG(?abstract) = "fr") .

    # Année de production
    OPTIONAL {
        dbr:${userInput} dbp:production ?production .
    }

    # Designers
    OPTIONAL {
        dbr:${userInput} dbp:designer ?designer .
        ?designer rdfs:label ?designerName .
        FILTER(LANG(?designerName) = "fr") .
    }

    # Layout (Configuration)
    OPTIONAL {
        dbr:${userInput} dbp:layout ?layout .
        ?layout rdfs:label ?layoutLabel .
        FILTER(LANG(?layoutLabel) = "fr") .
    }

    # Moteur
    OPTIONAL {
        dbr:${userInput} dbp:engine ?engine .
    }

    # Fabricant
    OPTIONAL {
        dbr:${userInput} dbp:manufacturer ?manufacturer .
        ?manufacturer rdfs:label ?manufacturerLabel .
        FILTER(LANG(?manufacturerLabel) = "en") .
    }

    # Moyens de transport associés
    OPTIONAL {
        dbr:${userInput} dbo:relatedMeanOfTransportation ?relatedMeanOfTransportation .
        ?relatedMeanOfTransportation rdfs:label ?relatedMeanOfTransportationLabel .
        FILTER(LANG(?relatedMeanOfTransportationLabel) = "fr") .
    }

    # Images
    OPTIONAL {
        dbr:${userInput} dbp:image ?image .
    }
}
`;
}

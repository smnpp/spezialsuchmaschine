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

function getModelAbstract(userInput) {
    return `SELECT DISTINCT ?abstract
WHERE {
OPTIONAL {
    <http://dbpedia.org/resource/${userInput}> dbo:abstract ?abstract .
    FILTER(LANG(?abstract) = "fr") .
} 
}`;
}

function getModelLabel(userInput) {
    return `SELECT DISTINCT ?label
WHERE {
OPTIONAL {
    <http://dbpedia.org/resource/${userInput}> rdfs:label ?label .
    FILTER(LANG(?label) = "fr") .
}
}`;
}

function getModelProduction(userInput) {
    return `SELECT DISTINCT ?production
WHERE {
OPTIONAL {
    <http://dbpedia.org/resource/${userInput}> dbp:production ?production .
    FILTER(LANG(?label) = "fr") .
}
}`;
}

function getModelDesigner(userInput) {
    return `SELECT DISTINCT ?designerName
WHERE {
OPTIONAL {
    <http://dbpedia.org/resource/${userInput}> dbp:designer ?designer .
    ?designer rdfs:label ?designerName .
    FILTER(LANG(?designerName) = "en") .
}
}`;
}

function getModelLayout(userInput) {
    return `SELECT DISTINCT ?layoutLabel
WHERE {
OPTIONAL {
    <http://dbpedia.org/resource/${userInput}> dbp:layout ?layout .
    ?layout rdfs:label ?layoutLabel .
    FILTER(LANG(?layoutLabel) = "en") .
}
}`;
}

function getModelEngine(userInput) {
    return `SELECT DISTINCT ?engine
WHERE {
OPTIONAL {
    <http://dbpedia.org/resource/${userInput}> dbp:engine ?engine .
}
}`;
}

function getModelManufacturer(userInput) {
    return `SELECT DISTINCT ?manufacturer ?manufacturerLabel
WHERE {
OPTIONAL {
    <http://dbpedia.org/resource/${userInput}> dbp:manufacturer ?manufacturer .
    ?manufacturer rdfs:label ?manufacturerLabel .
    FILTER(LANG(?manufacturerLabel) = "en") .
}
}`;
}

function getModelRelatedMeanOfTransportation(userInput) {
    return `SELECT DISTINCT ?relatedMeanOfTransportation ?relatedMeanOfTransportationLabel
WHERE {
OPTIONAL {
    <http://dbpedia.org/resource/${userInput}> dbo:relatedMeanOfTransportation ?relatedMeanOfTransportation .
    ?relatedMeanOfTransportation rdfs:label ?relatedMeanOfTransportationLabel .
    FILTER(LANG(?relatedMeanOfTransportationLabel) = "fr") .
}
}`;
}

function getModelImage(userInput) {
    return `SELECT DISTINCT ?image
WHERE {
OPTIONAL {
    <http://dbpedia.org/resource/${userInput}> dbo:thumbnail ?image .
}
}`;
}

export function requete_marques() {
    return `
            SELECT DISTINCT ?brand ?label ?foundingDate ?introduced ?logo ?thumbnail
            WHERE {
              ?car rdf:type dbo:Automobile ;
                  dbp:manufacturer ?brand .
              ?brand dbp:locationCountry "Germany"@en .
              OPTIONAL { ?brand rdfs:label ?label FILTER (lang(?label) = "en") }
              OPTIONAL { ?brand dbo:foundingDate ?foundingDate }
              OPTIONAL { ?brand dbp:introduced ?introduced }
              OPTIONAL { ?brand dbo:foundingYear ?foundingDate }
              OPTIONAL { ?brand dbp:logo ?logo }
              OPTIONAL { ?brand dbo:thumbnail ?thumbnail }
            }
            `;
}

// Requête SPARQL pour récupérer les informations de la marque
export function requete_details_marque(brandURI) {
  return `
      SELECT DISTINCT ?label ?abstract ?logo ?thumbnail ?foundingDate ?introduced ?country ?website  
                      ?revenue ?product ?ownersLabel
      WHERE {
          <${brandURI}> rdfs:label ?label ;
                       dbo:abstract ?abstract ;
                       dbo:thumbnail ?thumbnail .
          OPTIONAL { <${brandURI}> dbo:foundingDate ?foundingDate }
          OPTIONAL { <${brandURI}> dbp:introduced ?introduced }
          OPTIONAL { <${brandURI}> dbp:logo ?logo }
          OPTIONAL { <${brandURI}> dbo:country ?country }
          OPTIONAL { <${brandURI}> foaf:homepage ?website }
          OPTIONAL { <${brandURI}> dbp:revenue ?revenue }
          OPTIONAL { <${brandURI}> dbp:products ?product }
          OPTIONAL { <${brandURI}> dbo:owners ?owners.
                      ?owners rdfs:label ?ownersLabel }
          FILTER (lang(?label) = "en" && lang(?abstract) = "en")
      }
      LIMIT 1
  `;
}


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

async function displayGermanBrands() {
    const brandsContainer = document.getElementById("brands-container");
    const brandsQuery = getAllDeutchCarBrand();
    const results = await executeSparqlQuery(brandsQuery);
    console.log(results);

    if (results.length === 0) {
        brandsContainer.innerHTML = "<p>Aucune marque trouvée.</p>";
        return;
    }

    results.forEach(brand => {
        const card = document.createElement("div");
        card.className = "brand-card";

        if (brand.thumbnail) {
            const img = document.createElement("img");
            img.src = brand.thumbnail.value;
            img.alt = "";
            img.className = "brand-image";
            card.appendChild(img);
        }

        const title = document.createElement("h3");
        title.className = "brand-title";
        title.textContent = brand.manufacturerLabel
            ? brand.manufacturerLabel.value
            : "Marque inconnue";
        card.appendChild(title);

        const link = document.createElement("a");
        link.href = `marque.html?name=${encodeURIComponent(
            brand.manufacturer.value.split("/").pop()
        )}`;
        link.className = "brand-link";
        link.textContent = "Voir plus";
        card.appendChild(link);

        brandsContainer.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", displayGermanBrands);

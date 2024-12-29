function getBrandNameFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("name");
}

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

function getValue(results, key) {
    return (
        results.find(binding => binding[key])?.[key]?.value || "Non disponible"
    );
}

function getUniqueValues(results, key) {
    return [
        ...new Set(
            results
                .filter(binding => binding[key])
                .map(binding => binding[key].value)
        )
    ];
}

function updateContainer(containerId, content) {
    const container = document.getElementById(containerId);
    const parent = container.parentElement;
    if (content && content !== "Non disponible") {
        container.textContent = content;
        container.style.display = "";
    } else {
        parent.style.display = "none";
    }
}

async function displayBrandInfo() {
    const brandName = getBrandNameFromURL();

    if (!brandName) {
        console.error("Nom de la marque manquant dans l'URL.");
        return;
    }

    const labelResults = await executeSparqlQuery(getBrandLabel(brandName));
    const abstractResults = await executeSparqlQuery(
        getBrandAbstract(brandName)
    );
    const thumbnailResults = await executeSparqlQuery(
        getBrandThumbnail(brandName)
    );
    const foundingDateResults = await executeSparqlQuery(
        getBrandFoundingDate(brandName)
    );
    const introducedResults = await executeSparqlQuery(
        getBrandIntroduced(brandName)
    );
    const revenueResults = await executeSparqlQuery(getBrandRevenue(brandName));

    const productsResults = await executeSparqlQuery(
        getBrandProducts(brandName)
    );

    const ownersResults = await executeSparqlQuery(getBrandOwners(brandName));
    console.log(ownersResults);

    const websiteResults = await executeSparqlQuery(getBrandWebsite(brandName));

    const locationCityResults = await executeSparqlQuery(
        getBrandLocationCity(brandName)
    );

    const founderResults = await executeSparqlQuery(getBrandFounder(brandName));

    const label = getValue(labelResults, "label");
    const abstract = getValue(abstractResults, "abstract");
    const thumbnail = getValue(thumbnailResults, "thumbnail");
    const foundingDate = getValue(foundingDateResults, "foundingDate");
    const introduced = getValue(introducedResults, "introduced");
    const revenue = getValue(revenueResults, "revenue");
    const products = getUniqueValues(productsResults, "product");
    const owners = getUniqueValues(ownersResults, "ownersLabel");
    const website = getValue(websiteResults, "website");
    const locationCity = getUniqueValues(
        locationCityResults,
        "locationCityName"
    );
    const founder = getUniqueValues(founderResults, "founderLabel");

    updateContainer("brand-title", label);
    updateContainer("brand-abstract", abstract);
    updateContainer("fondation-year", foundingDate);
    updateContainer("introduction-year", introduced);
    updateContainer("revenue", revenue);
    updateContainer("location-city", locationCity.join(", "));
    updateContainer("products", products.join(", "));
    updateContainer("owners", owners.join(", "));
    updateContainer("founder", founder.join(", "));

    const imagesContainer = document.getElementById("brand-thumbnail");
    imagesContainer.innerHTML = "";
    if (thumbnail !== "Non disponible") {
        const img = document.createElement("img");
        img.src = thumbnail;
        img.alt = "";
        img.style.maxWidth = "100%";
        img.style.borderRadius = "8px";
        imagesContainer.appendChild(img);
    } else {
        imagesContainer.textContent = "Image non disponible.";
    }

    const websiteContainer = document.getElementById("website");
    if (website !== "Non disponible") {
        const link = document.createElement("a");
        link.href = website;
        link.textContent = `Site officiel de ${label}`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.style.color = "#007bff";
        link.style.textDecoration = "none";

        link.addEventListener(
            "mouseover",
            () => (link.style.textDecoration = "underline")
        );
        link.addEventListener(
            "mouseout",
            () => (link.style.textDecoration = "none")
        );

        websiteContainer.innerHTML = "";
        websiteContainer.appendChild(link);
    } else {
        websiteContainer.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", displayBrandInfo);

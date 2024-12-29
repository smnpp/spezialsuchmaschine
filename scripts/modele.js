function getModelNameFromURL() {
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

function displayRelatedModels(results, containerId) {
    const container = document.getElementById(containerId);
    const parent = container.parentElement;
    container.innerHTML = "";

    const relatedURIs = getUniqueValues(results, "relatedMeanOfTransportation");
    const relatedLabels = getUniqueValues(
        results,
        "relatedMeanOfTransportationLabel"
    );

    if (relatedURIs.length > 0 && relatedLabels.length > 0) {
        relatedURIs.forEach((uri, index) => {
            const label = relatedLabels[index] || "Lien inconnu";
            const modelName = uri.split("/").pop();
            const link = document.createElement("a");
            link.href = `modele.html?name=${encodeURIComponent(modelName)}`;
            link.textContent = label;
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
            container.appendChild(link);
        });
    } else {
        parent.style.display = "none";
    }
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

function displayManufacturer(results, containerId) {
    const container = document.getElementById(containerId);
    const parent = container.parentElement;
    container.innerHTML = "";

    const relatedURIs = getUniqueValues(results, "manufacturer");
    const relatedLabels = getUniqueValues(results, "manufacturerLabel");

    if (relatedURIs.length > 0 && relatedLabels.length > 0) {
        relatedURIs.forEach((uri, index) => {
            const label = relatedLabels[index] || "Lien inconnu";
            const brandName = uri.split("/").pop();
            const link = document.createElement("a");
            link.href = `marque.html?name=${encodeURIComponent(brandName)}`;
            link.textContent = label;
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
            container.appendChild(link);
        });
    } else {
        parent.style.display = "none";
    }
}

async function displayModelInfo() {
    const modelName = getModelNameFromURL();

    if (!modelName) {
        console.error("Nom du modèle manquant dans l'URL.");
        return;
    }

    const labelResults = await executeSparqlQuery(getModelLabel(modelName));
    const abstractResults = await executeSparqlQuery(
        getModelAbstract(modelName)
    );
    const productionResults = await executeSparqlQuery(
        getModelProduction(modelName)
    );
    const designerResults = await executeSparqlQuery(
        getModelDesigner(modelName)
    );
    const layoutResults = await executeSparqlQuery(getModelLayout(modelName));
    const engineResults = await executeSparqlQuery(getModelEngine(modelName));
    const manufacturerResults = await executeSparqlQuery(
        getModelManufacturer(modelName)
    );
    const relatedModelsResults = await executeSparqlQuery(
        getModelRelatedMeanOfTransportation(modelName)
    );
    const imageResults = await executeSparqlQuery(getModelImage(modelName));
    console.log(imageResults);

    const label = getValue(labelResults, "label");
    const abstract = getValue(abstractResults, "abstract");
    const productionYear = getValue(productionResults, "production");
    const designers =
        getUniqueValues(designerResults, "designerName").join(", ") ||
        "Non disponible";
    const layout =
        getUniqueValues(layoutResults, "layoutLabel").join(", ") ||
        "Non disponible";
    const engine = getValue(engineResults, "engine");
    const manufacturer = getValue(manufacturerResults, "manufacturerLabel");
    const imageSrc = getValue(imageResults, "image");

    updateContainer("model-title", label);
    updateContainer("model-description", abstract);
    updateContainer("production-year", productionYear);
    updateContainer("designers", designers);
    updateContainer("layout", layout);
    updateContainer("engine", engine);

    displayManufacturer(manufacturerResults, "manufacturer");
    displayRelatedModels(relatedModelsResults, "related-transport");

    const imagesContainer = document.getElementById("images");
    imagesContainer.innerHTML = "";
    if (imageSrc !== "Non disponible") {
        const img = document.createElement("img");
        img.src = imageSrc;
        img.alt = `Image du modèle ${label}`;
        img.style.maxWidth = "100%";
        img.style.borderRadius = "8px";
        imagesContainer.appendChild(img);
    } else {
        imagesContainer.textContent = "Image non disponible.";
    }
}

document.addEventListener("DOMContentLoaded", displayModelInfo);

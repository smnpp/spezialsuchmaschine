/* global Slots */
/* eslint-disable no-unused-vars */

// Constants
const DBPEDIA_API = 'https://dbpedia.org/sparql';
const WIKIDATA_API = 'https://query.wikidata.org/sparql';
const DBPEDIA_CAR = 'https://dbpedia.org/page/Category:Car_brands';

function nullableDate(string) {
  return string === null || string === undefined ? null : new Date(string)
}

function wikidataUrl(req) {
  return WIKIDATA_API + '?format=json&query=' + encodeURIComponent(req)
}

// function dbpediaUrl(req) {
//   return DBPEDIA_API + '?format=json&query=' + encodeURIComponent(req)
// }

export function dbpediaUrl(req) {
    return `${DBPEDIA_API}?format=json&query=${encodeURIComponent(req)}`;
}

function extractIdFromWikidataUrl(url) {
  return url?.match(/entity\/(Q\d+)$/)?.[1]
}

function coherentUrl(url) {
  return url.match(/^https?:\/\//) ? url : `http://${url}`
}

export function escapeHtml(unsafe) {
  return unsafe.replace(/[&<>"']/g, function (char) {
    switch (char) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#039;';
    }
  });
}

// Mettre la première lettre en majuscule, tout en faisant attention aux caractères accentués
function ucfirst([first, ...rest]) {
  return first.toLocaleUpperCase() + rest.join('')
}

export function createElementFromHtml(htmlString) {
  const template = document.createElement('template');
  template.innerHTML = htmlString.trim();
  return template.content.firstChild;
}


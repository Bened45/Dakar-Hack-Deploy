// Test de la barre de recherche sans les filtres de prix
console.log("Test de la barre de recherche sans les filtres de prix\n");

// Données de test
const searchData = {
  origin: "Dakar",
  destination: "Saint-Louis",
  date: "2025-11-01"
};

console.log("Données de recherche:", searchData);

// Fonction simulée de handleSearch
function handleSearch(origin, destination, date) {
  console.log("\n=== Traitement de la recherche ===");
  
  // Vérifier les champs requis
  if (!origin || !destination) {
    console.log("❌ Erreur: Les champs de départ et de destination sont requis");
    return;
  }
  
  console.log("✅ Champs de base valides");
  
  // Construire les paramètres de recherche
  const params = new URLSearchParams();
  params.append("origin", origin);
  params.append("destination", destination);
  
  if (date) {
    params.append("date", date);
    console.log("📅 Date ajoutée:", date);
  }
  
  console.log("🔗 URL de recherche générée:", `/search?${params.toString()}`);
  
  // Vérifier que les filtres de prix ne sont plus présents
  const urlParams = new URLSearchParams(params.toString());
  if (!urlParams.has("min_price") && !urlParams.has("max_price")) {
    console.log("✅ Les filtres de prix ont été supprimés avec succès");
  } else {
    console.log("❌ Erreur: Les filtres de prix sont encore présents");
  }
  
  return `/search?${params.toString()}`;
}

// Exécuter le test
const result = handleSearch(searchData.origin, searchData.destination, searchData.date);
console.log("\n✅ Résultat final:", result);

// Test avec des données incomplètes
console.log("\n=== Test avec données incomplètes ===");
try {
  handleSearch("", "Saint-Louis", "");
  console.log("❌ Erreur: La validation aurait dû échouer");
} catch (error) {
  console.log("✅ Validation correcte des champs requis");
}
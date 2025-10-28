// Script de test pour vérifier la création d'itinéraire
const API_BASE_URL = "http://localhost:8081/api";

// Données de test pour la création d'itinéraire
const testData = {
  origin: "Cotonou",
  destination: "Porto-Novo",
  duration: 45
};

// Token de test (dans un vrai scénario, on aurait un vrai token)
const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

console.log("Test de création d'itinéraire avec les données :", testData);

// Fonction pour tester la création d'itinéraire
async function testCreateRoute() {
  try {
    console.log("Envoi de la requête POST à", `${API_BASE_URL}/routes`);
    
    const response = await fetch(`${API_BASE_URL}/routes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${testToken}`,
      },
      body: JSON.stringify(testData)
    });
    
    console.log("Statut de la réponse :", response.status);
    console.log("En-têtes de la réponse :", [...response.headers.entries()]);
    
    if (response.ok) {
      const route = await response.json();
      console.log("Itinéraire créé avec succès :", route);
      return route;
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error("Erreur lors de la création de l'itinéraire :", {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData
      });
      return null;
    }
  } catch (error) {
    console.error("Erreur réseau ou autre :", error.message);
    return null;
  }
}

// Exécuter le test
testCreateRoute();
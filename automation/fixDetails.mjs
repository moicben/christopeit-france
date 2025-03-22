import fs from 'fs';
import path from 'path';

// Chemin vers le fichier products.json
const filePath = path.join('../products.json');

// Charger le fichier JSON
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Fonction pour choisir une valeur aléatoire dans un tableau
const getRandomValue = (array) => array[Math.floor(Math.random() * array.length)];

// Valeurs possibles pour productDelivery et productStock
const deliveryOptions = ['Normal', 'Fast', 'Express'];
const stockOptions = ['En stock', 'Plus que 5', 'En rupture'];

// Ajouter les nouvelles propriétés à chaque produit
data.products.forEach((product) => {
  product.productDelivery = getRandomValue(deliveryOptions);
  product.productStock = getRandomValue(stockOptions);
});

// Écrire les modifications dans le fichier JSON
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

console.log('Les champs productDelivery et productStock ont été ajoutés avec succès.');
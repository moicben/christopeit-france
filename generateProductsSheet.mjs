import fs from 'fs';
import xlsx from 'xlsx';

// Charger les données du fichier JSON
const productsData = JSON.parse(fs.readFileSync('./products.json', 'utf-8'));

// Extraire les produits
const products = productsData.products;

// Transformer les données pour correspondre à la structure demandée
const transformedProducts = products.map((product, index) => ({
  ID: index + 1, // Colonne ID incrémentée de 1 par produit
  Title: product.productTitle || '',
  Description: product.productDescription ? product.productDescription.replace(/<\/?[^>]+(>|$)/g, '') : '', // Supprimer les balises HTML
  Price: product.productPrice ? product.productPrice.replace(',', '.').replace(/\s+/g, '').trim() : '', // Supprimer les espaces et remplacer la virgule par un point
  Condition: 'new', // Ajouter la colonne Condition avec "new"
  Link: `https://{shop.domain}/produits/${product.slug || ''}`,
  Availability: 'in_stock', 
  "Image link": product.productImages?.[0] || ''
}));

// Créer une nouvelle feuille Excel
const worksheet = xlsx.utils.json_to_sheet(transformedProducts);

// Créer un classeur Excel
const workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(workbook, worksheet, 'Products');

// Sauvegarder le fichier Excel
xlsx.writeFile(workbook, './products-christopeit-v1.xlsx');

console.log('Fichier Excel généré : products-christopeit-v1.xlsx');
import { supabase } from '../lib/supabase.js';
import fs from 'fs';

// Charger les données depuis products.json
const productsData = JSON.parse(fs.readFileSync('../products.json', 'utf-8')).products;

async function updateProducts() {
  try {
    for (const product of productsData) {
      // Vérifiez si le produit a un slug (clé unique pour identifier les produits)
      if (!product.slug) {
        console.warn(`Produit sans slug ignoré : ${product.productTitle}`);
        continue;
      }

      // Préparez les données à mettre à jour
      const updateData = {
        desc: product.productDescription?.trim() || null, // Conserver les balises HTML
        details: product.productDetails?.join('').trim() || null, // Concaténer les détails en une seule chaîne
      };

      // Effectuez la mise à jour dans la table "products" en utilisant le slug comme identifiant
      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('slug', product.slug);

      if (error) {
        console.error(`Erreur lors de la mise à jour du produit avec le slug "${product.slug}":`, error.message);
      } else {
        console.log(`Produit mis à jour avec succès : ${product.slug}`);
      }
    }
  } catch (err) {
    console.error('Erreur lors de la mise à jour des produits :', err.message);
  }
}

// Exécutez le script
updateProducts();
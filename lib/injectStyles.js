import { fetchData } from './supabase';

async function injectStyles() {
  try {
    // Récupérer les styles depuis la table "brands"
    const brands = await fetchData('brands', { match: { shop_id: process.env.SHOP_ID } });

    if (!brands || brands.length === 0) {
      console.warn('Aucun style trouvé dans la table "brands".');
      return;
    }

    const brand = brands[0]; // Supposons que vous utilisez le premier enregistrement

    // Créer une balise <style> pour injecter les styles dynamiques
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';

    // Ajouter les styles dynamiques
    styleElement.innerHTML = `
      body {
        background-color: ${brand.background_color || '#fff'};
        color: ${brand.text_color || '#000'};
      }

      a {
        color: ${brand.link_color || '#0000EE'};
      }

      button {
        background-color: ${brand.button_background_color || '#CE122D'};
        color: ${brand.button_text_color || '#fff'};
      }
    `;

    // Ajouter la balise <style> au <head> du document
    document.head.appendChild(styleElement);
  } catch (error) {
    console.error('Erreur lors de l\'injection des styles :', error.message);
  }
}

// Exécuter l'injection des styles
injectStyles();
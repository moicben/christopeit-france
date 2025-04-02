const fs = require('fs');
const { Parser } = require('json2csv');

// Lire le fichier JSON
const jsonFilePath = '../products.json';
const csvFilePath = '../products.csv';

fs.readFile(jsonFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Erreur lors de la lecture du fichier JSON:', err);
    return;
  }

  try {
    const jsonData = JSON.parse(data);
    const products = jsonData.products;

    // Transformer les données pour correspondre aux nouvelles colonnes
    const transformedData = products.map(product => ({
      category_id: 1, // Valeur fixe
      slug: product.slug || '',
      title: product.productTitle || '',
      desc: product.productDescription?.replace(/<[^>]*>/g, '').trim() || '', // Supprimer les balises HTML
      metaTitle: product.productTitle || '',
      metaDesc: product.productDescription?.replace(/<[^>]*>/g, '').trim() || '',
      images: JSON.stringify(product.productImages || []),
      details: JSON.stringify(product.productDetails || []),
      delivery: product.productDelivery || '',
      stock: product.productStock || '',
      advantagesTitle: 'Avantages clés', // Titre fixe
      advantagesContent: JSON.stringify(product.productAdvantages?.replace(/<[^>]*>/g, '').trim() || ''),
      more1Title: 'Highlight 1', // Titre fixe
      more1Content: JSON.stringify(product.productHighlight1?.replace(/<[^>]*>/g, '').trim() || ''),
      more2Title: 'Highlight 2', // Titre fixe
      more2Content: JSON.stringify(product.productHighlight2?.replace(/<[^>]*>/g, '').trim() || ''),
      more3Title: 'Highlight 3', // Titre fixe
      more3Content: JSON.stringify(product.productHighlight3?.replace(/<[^>]*>/g, '').trim() || '')
    }));

    // Convertir en CSV
    const parser = new Parser();
    const csv = parser.parse(transformedData);

    // Écrire le fichier CSV
    fs.writeFile(csvFilePath, csv, 'utf8', err => {
      if (err) {
        console.error('Erreur lors de l\'écriture du fichier CSV:', err);
        return;
      }
      console.log('Fichier CSV généré avec succès:', csvFilePath);
    });
  } catch (parseError) {
    console.error('Erreur lors de l\'analyse du fichier JSON:', parseError);
  }
});
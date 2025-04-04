import fs from 'fs';
import path from 'path';
import { fetchData } from '../lib/supabase.js';

// Récupération de l'URL du site depuis la table shops
const shops = await fetchData('shops', { match: { id: process.env.SHOP_ID } });

if (!shops || shops.length === 0) {
  throw new Error('Aucun shop trouvé pour soumettre le sitemap.');
}

const siteUrl = `https://${shops[0].domain}`; // Utilisation du domaine du premier shop


// Liste des pages statiques
const staticPages = [
  '/',
  '/about',
  '/contact',
  '/follow-order',
  '/help',
  '/checkout',
  '/verification',
];

const generateSitemap = async () => {
  // Récupération des données dynamiques depuis Supabase
  const categories = await fetchData('categories', { match: { shop_id: process.env.SHOP_ID } });
  const products = await fetchData('products', { match: { shop_id: process.env.SHOP_ID } });
  const contents = await fetchData('contents', { match: { shop_id: process.env.SHOP_ID } });

  if (!categories || !products || !contents) {
    throw new Error('Erreur lors de la récupération des données depuis Supabase.');
  }

  // Génération des URLs pour les pages statiques
  const staticUrls = staticPages.map((page) => `
    <url>
      <loc>${siteUrl}${page}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.5</priority>
    </url>
  `);

  // Génération des URLs pour les catégories
  const categoryUrls = categories.map((category) => `
    <url>
      <loc>${siteUrl}/${category.slug}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>
  `);

  // Génération des URLs pour les produits
  const productUrls = products.map((product) => {
    const category = categories.find((cat) => cat.id === product.category_id);
    if (!category) return ''; // Ignorer les produits sans catégorie correspondante
    return `
      <url>
        <loc>${siteUrl}/${category.slug}/${product.slug}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>
    `;
  }).filter(Boolean); // Supprimer les entrées vides

  // Génération des URLs pour les articles de blog
  const blogUrls = contents[0].blogContent.articles.map((article) => `
    <url>
      <loc>${siteUrl}/blog/${article.slug}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>monthly</changefreq> 
      <priority>0.6</priority>
    </url>
  `);

  // Combiner toutes les URLs
  const urls = [...staticUrls, ...categoryUrls, ...productUrls, ...blogUrls];

  // Retourner le contenu complet du sitemap
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join('')}
</urlset>`;
};

// Génération du fichier sitemap.xml
const sitemapPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');

generateSitemap()
  .then((sitemap) => {
    fs.writeFileSync(sitemapPath, sitemap);
    console.log(`✅ Sitemap généré avec succès : ${sitemapPath}`);
  })
  .catch((error) => {
    console.error('❌ Erreur lors de la génération du sitemap :', error.message);
  });
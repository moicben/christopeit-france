import { fetchData } from './lib/supabase.js'; // Assurez-vous que le chemin est correct

async function getSiteUrl() {
  const shop = await fetchData('shops', { match: { id: process.env.SHOP_ID } });

  //console.log('Shop ID :', process.env.SHOP_ID);

  const domain = shop[0]?.domain;
  if (!domain) {
    throw new Error('Domaine introuvable dans la base de données.');
  }


  return `https://${domain}`;
}

const siteUrl = await getSiteUrl();

export default {
  siteUrl, // URL dynamique récupérée depuis Supabase
  generateRobotsTxt: true, // Générer un fichier robots.txt
  sitemapSize: 5000, // Taille maximale d'un fichier sitemap
};
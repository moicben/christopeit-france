import path from 'path';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import { fetchData } from '../lib/supabase.js'; // Import de fetchData depuis supabase.js

dotenv.config();

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, GOOGLE_REFRESH_TOKEN_WEBMASTER } = process.env;

console.log('Initializing OAuth2 client...');
const oauth2ClientWebmaster = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

oauth2ClientWebmaster.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN_WEBMASTER });

const webmasters = google.webmasters({
  version: 'v3',
  auth: oauth2ClientWebmaster
});

async function submitSitemap(siteUrl, sitemapUrl) {
  try {
    console.log(`Submitting sitemap: ${sitemapUrl}`);
    // Envoyer le sitemap à Google Search Console
    const response = await webmasters.sitemaps.submit({
      siteUrl,
      feedpath: sitemapUrl
    });
    console.log(`Sitemap submitted: ${sitemapUrl}`);
    console.log('Response:', response);
  } catch (error) {
    console.error('Error submitting sitemap:', error.message);
    console.error('Error details:', error);
  }
}

async function main() {
  try {
    // Récupération de l'URL du site depuis la table shops
    const shops = await fetchData('shops', { match: { id: process.env.SHOP_ID } });

    if (!shops || shops.length === 0) {
      throw new Error('Aucun shop trouvé pour soumettre le sitemap.');
    }

    const siteUrl = `https://${shops[0].domain}`; // Utilisation du domaine du premier shop
    const sitemapUrl = `${siteUrl}/sitemap.xml`;

    console.log(`Site URL: ${siteUrl}`);
    console.log(`Sitemap URL: ${sitemapUrl}`);

    // Envoyer le sitemap à Google Search Console
    await submitSitemap(siteUrl, sitemapUrl);
  } catch (error) {
    console.error('Error in main function:', error.message);
    console.error('Error details:', error);
  }
}

main();
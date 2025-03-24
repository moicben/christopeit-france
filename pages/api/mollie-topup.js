import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

const COOKIES_FILE = path.join(process.cwd(), 'cookies/mollie.json');
const MOLLIE_URL = 'https://my.mollie.com/dashboard/org_19237865/home';

async function importCookies(page) {
  try {
    const cookies = JSON.parse(await fs.readFile(COOKIES_FILE, 'utf-8'));
    console.log('Importing cookies:', cookies);
    await page.setCookie(...cookies);
    console.log('Cookies imported successfully.');
  } catch (error) {
    console.error('Error importing cookies:', error.message);
    throw new Error('Failed to import cookies');
  }
}

async function automateMollieTopUp(amount, cardDetails) {
  const browser = await puppeteer.launch({
    headless: false, // Mode non-headless pour débogage
    defaultViewport: null,
    args: ['--start-maximized'],
  });

  const page = await browser.newPage();

  try {
    // Importer les cookies
    await importCookies(page);

    // Naviguer vers l'URL Mollie
    console.log(`Navigating to ${MOLLIE_URL}...`);
    await page.goto(MOLLIE_URL, { waitUntil: 'networkidle2' });

    // Attendre que la page se charge complètement
    await page.waitForTimeout(2000);

    // Cliquer sur le bouton pour ajouter des fonds
    await page.click(
      '#root > div.styles_fullHeight__Ghly1 > main > article > div > div > div > section > div > div:nth-child(2) > div > div:nth-child(1) > button'
    );

    // Attendre
    await page.waitForTimeout(2000);

    // Taper le montant
    await page.keyboard.type(amount.toString());

    // Attendre
    await page.waitForTimeout(1000);

    // Appuyer sur Entrer
    await page.keyboard.press('Enter');

    // Attendre
    await page.waitForTimeout(1500);

    // Appuyer 2 fois sur 'Tab'
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Appuyer sur Entrer
    await page.keyboard.press('Enter');

    // Attendre que le checkout se charge
    await page.waitForTimeout(4000);

    // Remplir les détails de la carte
    const { cardNumber, cardOwner, cardExpiration, cardCVC } = cardDetails;

    // Écrire le numéro de carte
    await page.keyboard.type(cardNumber);

    // Écrire le titulaire de la carte
    await page.waitForTimeout(1000);
    await page.keyboard.press('Tab');
    await page.waitForTimeout(1000);
    await page.keyboard.type(cardOwner);

    // Écrire la date d'expiration
    await page.waitForTimeout(1000);
    await page.keyboard.press('Tab');
    await page.waitForTimeout(1000);
    await page.keyboard.type(cardExpiration);

    // Écrire le code de sécurité
    await page.waitForTimeout(1000);
    await page.keyboard.press('Tab');
    await page.waitForTimeout(1000);
    await page.keyboard.type(cardCVC);

    // Effectuer le paiement
    await page.waitForTimeout(2000);
    await page.keyboard.press('Enter');

    // Attendre que le paiement soit traité
    await page.waitForTimeout(10000);

    console.log('Top-up completed successfully.');
  } catch (error) {
    console.error('Error during Mollie automation:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, cardDetails } = req.body;

  if (!amount || !cardDetails) {
    return res.status(400).json({ error: 'Missing required parameters: amount or cardDetails' });
  }

  try {
    await automateMollieTopUp(amount, cardDetails);
    res.status(200).json({ message: 'Top-up completed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

const COOKIES_FILE = '../cookies/mollie.json'
const MOLLIE_URL = 'https://my.mollie.com/dashboard/org_19237865/home';

async function importCookies(page) {
  try {
    const cookies = JSON.parse(await fs.readFile(COOKIES_FILE, 'utf-8'));
    console.log('Importing cookies : ', cookies);
    await page.setCookie(...cookies);
    console.log('Cookies imported successfully.');
  } catch (error) {
    console.error('Error importing cookies:', error.message);
  }
}

async function main() {
  const browser = await puppeteer.launch({
    headless: false, // Mode non-headless
    defaultViewport: null,
    args: ['--start-maximized']
  });
  const page = await browser.newPage();

  // Importer les cookies avant de naviguer
  await importCookies(page);

  // Naviguer vers l'URL Mollie
  console.log(`Navigating to ${MOLLIE_URL}...`);
  await page.goto(MOLLIE_URL, { waitUntil: 'networkidle2' });

  // Attendre que la page se charge complètement
  await page.waitForTimeout(2000);

  // Cliquer sur : #root > div.styles_fullHeight__Ghly1 > main > article > div > div > div > section > div > div:nth-child(2) > div > div:nth-child(1) > button
  await page.click('#root > div.styles_fullHeight__Ghly1 > main > article > div > div > div > section > div > div:nth-child(2) > div > div:nth-child(1) > button');

  // Attendre 
  await page.waitForTimeout(2000);

  // Taper '1'
  await page.keyboard.type(amount);

  // Attendre 
  await page.waitForTimeout(1000);

  // Appuyer sur Entrer
  await page.keyboard.press('Enter');

  // Attendre 
  await page.waitForTimeout(1500);

  // Appuyer 2 fois sur 'Tab'
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  // Apuyer sur Entrer
  await page.keyboard.press('Enter');

  // Attendre que le checkout se charge
  await page.waitForTimeout(4000);
  
  // Cliquer vers le haut de la page
  await page.mouse.click(500, 300);

  // Attendre 
  await page.waitForTimeout(1500);

  // Appuyer 2 fois sur tab
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  // Écrire le numéro
  await page.keyboard.type(cardNumber);

  // Écrire le titulaire
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
  

  // Attendre 10 secondes
  await page.waitForTimeout(100000);



  console.log('Page loaded successfully.');

  // Garder le navigateur ouvert pour inspection
  await browser.close();
}

main().catch((error) => {
  console.error('Error:', error.message);
});
import puppeteer from 'puppeteer';
import fs from 'fs';
import OpenAI from 'openai';

// Configurez votre clé API OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const url = 'https://www.christopeit-sport.com/produkte/ausdauersport/?order=topseller&p=1';

async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function translateText(text) {
  try {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'Tu es un outil de traduction allemand vers français, je te donne du texte en allemand, et tu me réponds avec sa traduction en français. ' },
            { role: 'user', content: `Voici le texte à traduire : ${text} \n
            Réponds uniquement avec le texte traduit rien d'autre. \n
            Voici le texte traduit : \n
            ` }
        ],
        max_tokens: 2000
    });

    return response.choices[0].message.content.trim();

  } catch (error) {
      console.error('Error generating homepage content:', error);
      throw error;
  }
}

async function writeSlug(title) {
  try {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'Tu es un assistant français spécialisé e-commerce' },
            { role: 'user', content: `pour le titre de produit suivant rédige un slug produit et unique : ${title}\n
            Réponds uniquement avec le slug produit, rien d'autre.
            Voici le slug produit rédigé :
            `}
        ],
        max_tokens: 2000
    });

    return response.choices[0].message.content.trim();

  } catch (error) {
      console.error('Error generating homepage content:', error);
      throw error;
  }
}




async function main() {
  try {
    const browser = await puppeteer.launch({
        headless: 'new',
        defaultViewport: { width: 1920, height: 1080 },
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--window-size=1920x1080',
            '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
            '--disable-features=IsolateOrigins,site-per-process'
        ],
        ignoreDefaultArgs: ['--disable-extensions']
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0'});

    // Delay
    await delay(2000);

    const productElements = await page.$$('.row.cms-listing-row.js-listing-wrapper a.card-body');
    const productList = [];
    console.log(`Found ${productElements.length} products.`);

    let count = 0;
    for (const element of productElements) {
      //if (count >= 3) break;

      const productPriceElement = await element.$('.product-price-info');
      const productImageElement = await element.$('img');
      const productTitleSlugElement = await element.$('.product-title');

      const product = {
        productSource: await page.evaluate(el => el.href, element),
        productPrice: productPriceElement ? await page.evaluate(el => el.textContent.trim(), productPriceElement) : 'N/A',
        productImages: productImageElement ? [await page.evaluate(el => el.src, productImageElement)] : [],
      };

      try {
        // Navigate to product page to get additional details using Puppeteer
        const productPage = await browser.newPage();
        await productPage.goto(product.productSource, { waitUntil: 'networkidle0' });

        const productTitleElement = await productPage.$('h1.product-detail-name');
        const productDescriptionElement = await productPage.$('.prod-short-infos-holder.styled-list.mb-4');
        const productDetailsElements = await productPage.$$('body > main > div.content-main-holder.user-logged-out > div > div > div > div.product-detail-description.tab-pane-container.row > div:nth-child(2) > div:nth-child(2) > div > div');
        const additionalImagesElements = await productPage.$$('.gallery-slider-item.is-contain.js-magnifier-container img');

        product.productTitle = productTitleElement ? await productPage.evaluate(el => el.textContent.trim(), productTitleElement) : product.productTitle;
        product.productDescription = productDescriptionElement ? await productPage.evaluate(el => el.innerHTML.trim(), productDescriptionElement) : '';
        product.productDetails = await Promise.all(productDetailsElements.map(async detail => await productPage.evaluate(el => el.innerHTML.trim(), detail)));
        product.productImages = product.productImages.concat(await Promise.all(additionalImagesElements.map(async img => await productPage.evaluate(el => el.src, img))));

        // Remove unwanted base64 image
        product.productImages = product.productImages.filter(img => img !== 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');

        // Translate product content and last fixs
        product.productTitle = (await translateText(product.productTitle)).replace("disponible", "").trim();
        product.productDescription = await translateText(product.productDescription);
        product.productDetails = await Promise.all(product.productDetails.map(async detail => await translateText(detail)));
        product.productPrice = product.productPrice.replace(" *", "");
        product.slug = await writeSlug(product.productTitle);

        await productPage.close();
      } catch (error) {
        console.error(`Error processing product at ${product.productSource}:`, error);
        continue; // Continue to the next product
      }

      productList.push(product);
      count++;
      console.log(`Processed ${count} of ${productElements.length} products.`);
    }

    await browser.close();

    fs.writeFileSync('products.json', JSON.stringify({ products: productList }, null, 2));
    console.log('Products saved to products.json');
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

main();
import puppeteer from 'puppeteer';
import fs from 'fs';
import OpenAI from 'openai';

// Configurez votre clé API OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Charger les produits depuis le fichier JSON
const products = JSON.parse(fs.readFileSync('../products.json', 'utf8')).products;

(async () => {
  // Se connecter à une fenêtre Edge déjà ouverte
  const browser = await puppeteer.launch({
    defaultViewport: { width: 1600, height: 1080 },
    headless: false,
    args: [
      '--maximized',
      '--disable-gpu',
    ]
  });

  for (let i = 0; i < products.length; i++) {
    try {
      const product = products[i];
      const page = await browser.newPage();

      // Aller sur la page cible
      await page.goto(product.productSource, { waitUntil: 'networkidle2' });

      // Attendre quelques secondes pour voir si la traduction s'affiche
      await page.waitForTimeout(5000);

      // Extraire le contenu HTML
      const advantages = await page.evaluate(() => {
        const element = document.querySelector('body > main > div:nth-child(3)');
        return element ? element.innerHTML : null;
      });

      const highlight1 = await page.evaluate(() => {
        const element = document.querySelector('body > main > div:nth-child(4)');
        return element ? element.innerHTML : null;
      });

      const highlight2 = await page.evaluate(() => {
        const element = document.querySelector('body > main > div:nth-child(5)');
        return element ? element.innerHTML : null;
      });

      const highlight3 = await page.evaluate(() => {
        const element = document.querySelector('body > main > div:nth-child(6)');
        return element ? element.innerHTML : null;
      });

      const highlight4 = await page.evaluate(() => {
        const element = document.querySelector('body > main > div:nth-child(7)');
        return element ? element.innerHTML : null;
      });

      // Fonction pour supprimer les classes et balises ALT dans une chaine de caractère de code HTML
      const removeUseless = (html) => {
        return html.replace(/ class=".*?"/g, '').replace(/ alt=".*?"/g, '');
      };

      // Fonction pour traduire uniquement le texte entre les balises HTML sans créer une div
      async function translateText(text) {
        try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4-turbo',
          messages: [
            { role: 'system', content: 'Tu es un outil de traduction allemand vers français, je te donne du texte en allemand, et tu réponds UNIQUEMENT avec sa traduction en français, voici le texte à traduire :' },
            { role: 'user', content: `${text}` }
          ],
          max_tokens: 2000
        });

        let translatedText = response.choices[0].message.content.trim();
        translatedText = translatedText.replace(/Réponds uniquement avec le texte traduit rien d'autre./g, '').trim();
        translatedText = translatedText.replace(/Voici le texte traduit :/g, '').trim();
        translatedText = translatedText.replace(/Tes avantages en vue/g, `AVANTAGES CLÉS DU PRODUIT`).trim();

        return translatedText;

        } catch (error) {
          console.error('Error generating homepage content:', error);
          throw error;
        }
      }
      
      const translateHtmlContent = async (html) => {
        const regex = />([^<]+)</g;
        let match;
        const textsToTranslate = [];
        while ((match = regex.exec(html)) !== null) {
        const text = match[1].trim();
        if (text.length >= 6) {
          textsToTranslate.push(text);
        }
        }
        const translatedTexts = await Promise.all(textsToTranslate.map(text => translateText(text)));
        let i = 0;
        return html.replace(regex, (substring, ...args) => {
        const text = args[0].trim();
        if (text.length >= 6) {
        return `>${translatedTexts[i++]}<`;
        }
        return substring;
        });
      };

      // Nettoyer et traduire le contenu HTML
      product.productAdvantages = advantages ? removeUseless(await translateHtmlContent(advantages)) : null;
      product.productHighlight1 = highlight1 ? removeUseless(await translateHtmlContent(highlight1)) : null;
      product.productHighlight2 = highlight2 ? removeUseless(await translateHtmlContent(highlight2)) : null;
      product.productHighlight3 = highlight3 ? removeUseless(await translateHtmlContent(highlight3)) : null;
      product.productHighlight4 = highlight4 ? removeUseless(await translateHtmlContent(highlight4)) : null;

      await page.close();

      console.log(`Produit ${i + 1} mis à jour.`);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du produit ${i + 1}:`, error);
      continue;
    }
  }

  // Sauvegarder les produits mis à jour dans le fichier JSON
  fs.writeFileSync('../products.json', JSON.stringify({ products }, null, 2));

  await browser.close();

})();
import puppeteer from 'puppeteer';
import { writeFile } from 'fs/promises';
import { readFile } from 'fs/promises';

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();

    // Charger les liens des articles depuis le fichier JSON
    const articles = JSON.parse(await readFile('blog-christopeit.json', 'utf-8'));

    const detailedData = [];

    for (const article of articles) {
        console.log(`Scraping: ${article.link}`);
        await page.goto(article.link, { waitUntil: 'networkidle2' });

        // Extraire les données demandées
        const data = await page.evaluate(() => {
            const thumbnailEl = document.querySelector('body > main > div.content-main-holder.user-logged-out > div > div > div > img');
            const titleEl = document.querySelector('body > main > div.content-main-holder.user-logged-out > div > div > div > div.card-body.mt-3.p-4 > h2');
            const tagEl = document.querySelector('body > main > div.content-main-holder.user-logged-out > div > div > div > div.card-body.mt-3.p-4 > div.card-text.mt-1 > small.text-muted.post-category > font');
            const contentEl = document.querySelector('body > main > div.content-main-holder.user-logged-out > div > div > div > div.card-body.mt-3.p-4 > div.card-text.mt-3');

            return {
                thumbnail: thumbnailEl ? thumbnailEl.src : '',
                title: titleEl ? titleEl.innerText.trim() : '',
                tag: tagEl ? tagEl.innerText.trim() : '',
                content: contentEl ? contentEl.innerHTML.trim() : ''
            };
        });

        detailedData.push({
            link: article.link,
            ...data
        });
    }

    // Sauvegarder les données détaillées dans un fichier JSON
    await writeFile('detailed-blog-christopeit.json', JSON.stringify(detailedData, null, 2));
    console.log('Scraping terminé. Données sauvegardées dans detailed-blog-christopeit.json');

    await browser.close();
})();
import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const url = 'https://www.avis-verifies.com/avis-clients/sport-protech.com';
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle2' });

    let allReviews = [];
    let currentPage = 1;
    const totalPages = 11; // Total number of pages to scrape

    while (currentPage <= totalPages) {
      console.log(`Scraping page ${currentPage}...`);

      // Wait for the reviews list to load
      await page.waitForSelector('ul#reviews__list > li');

      // Extract reviews from the current page
      const reviews = await page.$$eval('ul#reviews__list > li', (reviewElements) =>
        reviewElements.map((review) => {
          const stars = review.querySelector('.review__rating-fact')?.textContent.trim() || null;
          const content = review.querySelector('p.review__text.search-criterion')?.textContent.trim() || null;
          const date = review.querySelector('time.review__data-time')?.textContent.trim() || null;
          const experienceDate = review.querySelector('p.review__data > time:nth-child(2)')?.textContent.trim() || null;
          const author = review.querySelector('span.review__data-name')?.textContent.trim() || null;

          return { stars, content, date, experienceDate, author };
        })
      );

      // Add the reviews from the current page to the total list
      allReviews = allReviews.concat(reviews);

      // Check if there is a next page and click the "Next" button
      const nextButton = await page.$('a.button.pagination__button.pagination__button--next');
      if (nextButton && currentPage < totalPages) {
        await nextButton.click();
        await page.waitForTimeout(2000); // Wait for the next page to load
      } else {
        break; // Exit the loop if no next button is found or last page is reached
      }

      currentPage++;
    }

    // Save all reviews to reviews.json
    fs.writeFileSync(
      '../reviews.json', // Adjust path if necessary
      JSON.stringify(allReviews, null, 2),
      'utf-8'
    );

    console.log('All reviews successfully saved to reviews.json');
  } catch (error) {
    console.error('Error while scraping reviews:', error);
  } finally {
    await browser.close();
  }
})();
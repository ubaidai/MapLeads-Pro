import { Actor } from 'apify';
import { PuppeteerCrawler, log } from 'crawlee';

await Actor.init();

const input = await Actor.getInput();
const {
    searchQuery,
    location,
    maxResults = 20,
    includeReviews = false,
    language = 'en',
    proxyConfiguration,
} = input;

// Validate required inputs
if (!searchQuery || !location) {
    throw new Error('Search query and location are required!');
}

log.info('Starting Google Maps scraper', { searchQuery, location, maxResults });

// Construct Google Maps search URL
const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}+${encodeURIComponent(location)}?hl=${language}`;

const proxyConfig = await Actor.createProxyConfiguration(proxyConfiguration);

const crawler = new PuppeteerCrawler({
    proxyConfiguration: proxyConfig,
    launchContext: {
        launchOptions: {
            headless: true,
        },
    },
    async requestHandler({ page, request }) {
        log.info('Processing search results', { url: request.url });

        // Wait for results to load
        await page.waitForSelector('div[role="feed"]', { timeout: 30000 });
        
        // Scroll to load more results
        await autoScroll(page, maxResults);
        
        // Extract business data
        const businesses = await page.evaluate((includeReviews) => {
            const results = [];
            const items = document.querySelectorAll('div[role="feed"] > div > div[jsaction]');
            
            items.forEach((item) => {
                try {
                    const nameEl = item.querySelector('div.fontHeadlineSmall');
                    const name = nameEl ? nameEl.innerText : null;
                    
                    if (!name) return;
                    
                    const ratingEl = item.querySelector('span[role="img"]');
                    const rating = ratingEl ? ratingEl.getAttribute('aria-label') : null;
                    
                    const reviewCountEl = item.querySelector('span[role="img"] + span > span > span');
                    const reviewCount = reviewCountEl ? reviewCountEl.innerText.replace(/[()]/g, '') : null;
                    
                    const categoryEl = item.querySelector('div.fontBodyMedium > div:nth-child(2) > span:first-child');
                    const category = categoryEl ? categoryEl.innerText : null;
                    
                    const addressEl = item.querySelector('div.fontBodyMedium > div:nth-child(2) > span:nth-child(2)');
                    const address = addressEl ? addressEl.innerText : null;
                    
                    const linkEl = item.querySelector('a');
                    const placeUrl = linkEl ? linkEl.href : null;
                    
                    // Extract coordinates from URL
                    let latitude = null;
                    let longitude = null;
                    if (placeUrl) {
                        const coordMatch = placeUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
                        if (coordMatch) {
                            latitude = coordMatch[1];
                            longitude = coordMatch[2];
                        }
                    }
                    
                    const business = {
                        name,
                        rating: rating ? rating.match(/[\d.]+/)?.[0] : null,
                        reviewCount,
                        category,
                        address,
                        placeUrl,
                        latitude,
                        longitude,
                        timestamp: new Date().toISOString(),
                    };
                    
                    results.push(business);
                } catch (e) {
                    console.error('Error extracting business data:', e);
                }
            });
            
            return results;
        }, includeReviews);

        log.info(`Extracted ${businesses.length} businesses`);

        // Save results to dataset
        await Actor.pushData(businesses.slice(0, maxResults));
    },
    failedRequestHandler({ request, error }) {
        log.error(`Request ${request.url} failed multiple times`, { error });
    },
});

// Auto-scroll function to load more results
async function autoScroll(page, targetCount) {
    await page.evaluate(async (targetCount) => {
        const feed = document.querySelector('div[role="feed"]');
        if (!feed) return;
        
        let previousHeight = 0;
        let scrollAttempts = 0;
        const maxScrollAttempts = 50;
        
        while (scrollAttempts < maxScrollAttempts) {
            const items = document.querySelectorAll('div[role="feed"] > div > div[jsaction]');
            
            if (items.length >= targetCount) break;
            
            feed.scrollTo(0, feed.scrollHeight);
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const currentHeight = feed.scrollHeight;
            if (currentHeight === previousHeight) {
                scrollAttempts++;
            } else {
                scrollAttempts = 0;
                previousHeight = currentHeight;
            }
        }
    }, targetCount);
}

// Run the crawler
await crawler.run([searchUrl]);

log.info('Scraping completed');
await Actor.exit();

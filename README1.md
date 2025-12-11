# 📍 Google Maps Business Scraper

Extract complete business data from Google Maps including names, addresses, phone numbers, ratings, reviews, and more. Perfect for lead generation, market research, and local SEO analysis.

## ✨ Features

- 🔍 Search by keyword and location
- 📊 Extract 10+ data points per business
- ⭐ Get ratings and review counts
- 📍 GPS coordinates included
- 🌍 Multi-language support
- 🚀 Fast and efficient scraping
- 💾 Export in JSON, CSV, or Excel

## 📋 Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `searchQuery` | String | ✅ Yes | What to search (e.g., "restaurants", "dentists") |
| `location` | String | ✅ Yes | Where to search (e.g., "New York, NY") |
| `maxResults` | Number | No | Maximum businesses to scrape (default: 20) |
| `includeReviews` | Boolean | No | Extract reviews (default: false) |
| `language` | String | No | Language code (default: "en") |

## 📤 Output Data

Each business includes:

```json
{
  "name": "Business Name",
  "rating": "4.5",
  "reviewCount": "234",
  "category": "Coffee Shop",
  "address": "123 Main St, New York, NY 10001",
  "placeUrl": "https://maps.google.com/?cid=...",
  "latitude": "40.7128",
  "longitude": "-74.0060",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🚀 Usage Examples

### Example 1: Find Coffee Shops
```json
{
  "searchQuery": "coffee shops",
  "location": "Brooklyn, NY",
  "maxResults": 50
}
```

### Example 2: Find Dentists
```json
{
  "searchQuery": "dentists",
  "location": "Los Angeles, CA",
  "maxResults": 100
}
```

### Example 3: Find Restaurants (Spanish)
```json
{
  "searchQuery": "restaurantes",
  "location": "Madrid, Spain",
  "maxResults": 30,
  "language": "es"
}
```

## 💡 Use Cases

- **Lead Generation**: Build prospect lists for B2B sales
- **Market Research**: Analyze competitors and market density
- **Local SEO**: Research local business landscape
- **Directory Building**: Create business directories
- **Event Planning**: Find vendors and venues
- **Franchise Research**: Identify expansion opportunities

## ⚙️ How It Works

1. Constructs Google Maps search URL with your query
2. Loads search results page
3. Scrolls to load more results
4. Extracts business information
5. Saves data to dataset

## 📝 Notes

- Respects Google's rate limits
- Uses residential proxies for reliability
- Results may vary based on Google's availability
- Some data fields may be empty if not available

## 🔧 Technical Details

- Built with Apify SDK and Crawlee
- Uses Puppeteer for browser automation
- Automatically handles pagination
- Proxy support included

## 📞 Support

For issues or questions, please contact support or open an issue in the repository.

## 📜 License

Apache-2.0

---

**Made with ❤️ for the Apify community**

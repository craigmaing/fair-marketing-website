# DataForSEO MCP Server Setup Guide for Fearnbell Marketing

## 🚀 Quick Start

### Prerequisites
1. DataForSEO Account (get one at https://dataforseo.com)
2. Node.js v14+ installed
3. Claude Desktop (for MCP integration)

### Step 1: Set Environment Variables

**Windows (Command Prompt):**
```batch
set DATAFORSEO_LOGIN=your_email@example.com
set DATAFORSEO_PASSWORD=your_password
```

**Windows (PowerShell):**
```powershell
$env:DATAFORSEO_LOGIN="your_email@example.com"
$env:DATAFORSEO_PASSWORD="your_password"
```

**macOS/Linux:**
```bash
export DATAFORSEO_LOGIN="your_email@example.com"
export DATAFORSEO_PASSWORD="your_password"
```

### Step 2: Configure Claude Desktop

1. Open Claude Desktop settings
2. Go to MCP Servers configuration
3. Add the following configuration:

```json
{
  "dataforseo": {
    "command": "node",
    "args": ["C:\\Users\\Fearn\\fearnbell\\dataforseo-mcp-server\\dataforseo-simple.js"],
    "env": {
      "DATAFORSEO_LOGIN": "your_email@example.com",
      "DATAFORSEO_PASSWORD": "your_password"
    }
  }
}
```

### Step 3: Test the Server

```batch
cd C:\Users\Fearn\fearnbell\dataforseo-mcp-server
node dataforseo-simple.js
```

## 📊 Available Tools

### 1. `serp_google_analysis`
Analyze Google search results for competitor research.

**Parameters:**
- `keyword` (required): Search term to analyze
- `location_code` (optional): Location code (2840 for USA, 2826 for UK)
- `language_code` (optional): Language code (default: 'en')

**Example:**
```javascript
{
  "keyword": "marketing agency london",
  "location_code": 2826,
  "language_code": "en"
}
```

### 2. `keyword_research`
Get keyword suggestions and search volume data.

**Parameters:**
- `keywords` (required): Array of seed keywords
- `location_code` (optional): Location code
- `language_code` (optional): Language code

**Example:**
```javascript
{
  "keywords": ["marketing", "seo", "digital agency"],
  "location_code": 2826
}
```

### 3. `competitor_domain_analysis`
Analyze competitor domains for SEO metrics.

**Parameters:**
- `domain` (required): Domain to analyze
- `location_code` (optional): Location code

**Example:**
```javascript
{
  "domain": "competitor.com",
  "location_code": 2826
}
```

### 4. `keyword_difficulty`
Check keyword competition and difficulty metrics.

**Parameters:**
- `keyword` (required): Keyword to analyze
- `location_code` (optional): Location code

## 🔧 Running Competitor Research Scripts

### Basic Competitor Analysis
```bash
cd fearnbell-marketing/scripts
node dataforseo-competitor-research.js
```

This script will:
1. Analyze top competitors for target keywords
2. Extract domain metrics for each competitor
3. Find keyword opportunities
4. Generate content ideas
5. Save comprehensive report

### Output Files
- `data/fearnbell-competitor-report-YYYY-MM-DD.json` - Full JSON report
- `data/competitor-summary-YYYY-MM-DD.md` - Readable markdown summary

## 📈 DataForSEO API Limits & Costs

### API Limits
- **Rate Limit**: 20 requests per second
- **Daily Limit**: Depends on your plan
- **Cost per Request**: Varies by endpoint

### Cost-Efficient Tips
1. Use location codes strategically (focus on primary markets)
2. Limit depth parameter to necessary results
3. Cache results locally to avoid duplicate requests
4. Use batch operations when available

## 🛠️ Troubleshooting

### Common Issues

#### 1. Authentication Error
```
Error: DataForSEO credentials not found!
```
**Solution**: Ensure environment variables are set correctly.

#### 2. Rate Limiting
```
Error: Too many requests
```
**Solution**: Add delays between requests or upgrade your plan.

#### 3. MCP Connection Failed
```
Error: Failed to connect to MCP server
```
**Solution**: 
- Check Node.js is installed
- Verify file paths in Claude Desktop config
- Ensure credentials are correct

## 📚 Advanced Usage

### Custom Research Scripts

Create your own research scripts using the DataForSEO client:

```javascript
const { DataForSEOResearch } = require('./dataforseo-competitor-research.js');

async function customResearch() {
  const researcher = new DataForSEOResearch(
    process.env.DATAFORSEO_LOGIN,
    process.env.DATAFORSEO_PASSWORD
  );
  
  // Custom keyword analysis
  const results = await researcher.getSERPCompetitors('your keyword');
  console.log(results);
}
```

### Batch Processing

For large-scale analysis:

```javascript
const keywords = [/* array of 100+ keywords */];
const batchSize = 10;

for (let i = 0; i < keywords.length; i += batchSize) {
  const batch = keywords.slice(i, i + batchSize);
  // Process batch
  await processBatch(batch);
  // Wait to avoid rate limiting
  await new Promise(resolve => setTimeout(resolve, 5000));
}
```

## 🎯 Fearnbell Marketing Strategy Integration

### Key Focus Areas

1. **Competitor Intelligence**
   - Track top 10 competitors weekly
   - Monitor their keyword rankings
   - Analyze their content strategy

2. **Keyword Opportunities**
   - Find low-competition, high-volume keywords
   - Identify content gaps
   - Track seasonal trends

3. **Content Planning**
   - Use keyword clusters for content hubs
   - Create competitor-beating content
   - Optimize for featured snippets

4. **Performance Tracking**
   - Monitor ranking improvements
   - Track organic traffic growth
   - Measure against competitors

## 📞 Support & Resources

- **DataForSEO Documentation**: https://docs.dataforseo.com/
- **API Dashboard**: https://app.dataforseo.com/
- **Support Email**: support@dataforseo.com
- **Fearnbell Marketing**: info@fearnbellmarketing.com

## 🔄 Next Steps

1. ✅ Run initial competitor analysis
2. ✅ Review generated reports
3. ⏳ Implement keyword strategy
4. ⏳ Create content based on opportunities
5. ⏳ Monitor and iterate

---

*Last Updated: 2025-08-28*
*Version: 1.0.0*
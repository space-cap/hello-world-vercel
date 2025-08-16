# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Korean dental clinic search service built as a Vercel serverless application. The project consists of two HTML interfaces and a serverless API that integrates with Naver's Local Search API.

## Architecture

- **Frontend**: Two HTML files with embedded JavaScript
  - `index.html`: Basic dental search interface with list view
  - `index_map.html`: Enhanced version with interactive Naver Maps integration
- **Backend**: Vercel serverless function at `api/search-dentists.js`
- **API Integration**: Uses Naver Local Search API and Naver Maps API
- **Deployment**: Configured for Vercel platform

## Environment Variables Required

The serverless function requires these environment variables:
- `NAVER_CLIENT_ID`: Naver API client ID
- `NAVER_CLIENT_SECRET`: Naver API client secret

For the map interface, update the Naver Maps API client ID in `index_map.html:234`.

## Key Components

### API Endpoint (`api/search-dentists.js`)
- Serverless function that proxies requests to Naver Local Search API
- Handles CORS, error handling, and data transformation
- Returns dental clinic information including name, address, phone, and coordinates

### Frontend Interfaces
- Both interfaces share similar search functionality but different presentation
- `index_map.html` includes interactive map with markers and info windows
- Search results are displayed as cards with detailed clinic information

## Development Commands

No build process is required - this is a static site with serverless functions.

For local development with Vercel CLI:
```bash
vercel dev
```

For deployment:
```bash
vercel --prod
```

## API Response Structure

The search API returns:
```javascript
{
  success: boolean,
  total: number,
  items: Array<{
    name: string,
    address: string,
    roadAddress: string,
    telephone: string,
    category: string,
    mapx: number,
    mapy: number
  }>
}
```

## Map Integration Notes

- Coordinates from Naver API need conversion: `lng = mapx / 10000000, lat = mapy / 10000000`
- Map markers are numbered and clickable
- Info windows provide detailed clinic information and links to Naver Maps
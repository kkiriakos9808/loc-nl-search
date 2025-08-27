# LOC NL Search (Library of Congress — Natural-Language Search)

A public web app that turns natural-language prompts into structured Library of Congress (LoC) searches and displays results as image-first “cards” with links, rights info, and IIIF previews.

## Goals
- Query LoC collections with plain English (e.g., “photos of Logan Circle between 1900–1920”).
- Normalize results across collections (title, date, thumbnail, rights, source).
- Prefer public-domain / “No known restrictions” items.
- Shareable URLs for queries and filters.

## Tech Stack (MVP)
- **Next.js (App Router) + TypeScript**
- **Tailwind CSS**
- **API routes** for LoC calls + normalization
- **No DB** (phase 1); optional embeddings re-ranking later

## Key LoC Endpoints
- General Search (JSON): `https://www.loc.gov/search/?q=<query>&fo=json`
- Chronicling America (newspapers): `https://chroniclingamerica.loc.gov/search/pages/results/?andtext=<q>&format=json`
- IIIF: manifests on `iiif.loc.gov`, images/tiles on `tile.loc.gov`
- Authorities (optional): `https://id.loc.gov/` (place/subject normalization)

## API (internal) — `/api/search`
**GET** with query params:
- `q` (string) — natural-language prompt
- `yearStart` (int, optional)
- `yearEnd` (int, optional)
- `location` (string, optional)
- `format` (string, optional; e.g., `photo|map|newspaper`)
- `publicDomainOnly` (bool, default `false`)

**Response (JSON array of objects):**
```json
[
  {
    "title": "Logan Circle, Washington, D.C.",
    "date": "1907",
    "description": "Photograph ...",
    "thumbnail": "https://tile.loc.gov/.../full/!400,400/0/default.jpg",
    "iiifManifest": "https://iiif.loc.gov/...",
    "rights": "No known restrictions",
    "collection": "Prints and Photographs",
    "subjects": ["Washington (D.C.)", "Logan Circle"],
    "sourceUrl": "https://www.loc.gov/item/..."
  }
]

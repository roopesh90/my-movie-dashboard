# TMDB Attribution & Brand Guidelines

This project uses data, videos, and images from **The Movie Database (TMDB)** API.

## Legal Requirements

This product uses the TMDB API but is **not endorsed or certified by TMDB**.

TMDB's terms of use require proper attribution. This project includes:

- ✅ Attribution footer on all pages
- ✅ Hover tooltips on movie images saying "Image from TMDB"
- ✅ Links to TMDB's official website
- ✅ Clear disclaimers about lack of endorsement

## TMDB Resources

- **API Documentation**: https://www.themoviedb.org/settings/api
- **Attribution Guidelines**: https://www.themoviedb.org/about/logos-attribution
- **Brand Logos**: https://www.themoviedb.org/about/logos-attribution
- **Terms of Use**: https://www.themoviedb.org/settings/api

## Using Official TMDB Logos

If you want to add official TMDB branding to your deployment:

1. Visit: https://www.themoviedb.org/about/logos-attribution
2. Download the logo files (they provide various formats and sizes)
3. Follow their placement and spacing guidelines
4. Store logos in `/public/tmdb-logos/`
5. Import in the Attribution component

### Example Logo Implementation

```tsx
<Image
  src="/tmdb-logos/tmdb-logo.svg"
  alt="The Movie Database (TMDB) Logo"
  width={100}
  height={50}
/>
```

## Brand Guidelines Summary

- **Minimum Size**: Follow TMDB's minimum size requirements (check their guidelines)
- **Clear Space**: Maintain proper spacing around the logo
- **Color**: Use official brand colors (avoid alterations)
- **Alignment**: Don't skew or rotate the logo
- **Context**: Always use in context with proper attribution text

## Attribution Text Requirements

Always include text like:
- "Images and data from The Movie Database (TMDB)"
- "Powered by TMDB"
- "Data provided by The Movie Database"

Include a link to: https://www.themoviedb.org

## Authentication Note

Use the **API Read Access Token** (Bearer token) from TMDB, not the v3 API key.

## For Commercial Use

If you plan to use this app commercially:

1. Contact TMDB directly at support@themoviedb.org
2. Request a commercial license
3. Follow their commercial terms
4. Increase attribution visibility

## Questions?

- TMDB Support: https://www.themoviedb.org/talk
- API Issues: Check the API documentation
- Brand Questions: See their official guidelines

# Twitter/X Card Implementation for Checkmate

This document provides information about the Twitter/X card implementation for the Checkmate application, following the official X documentation.

## Implementation Details

The Twitter/X card has been implemented using direct meta tags in the `<head>` section of the HTML:

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@maisybrain" />
<meta name="twitter:creator" content="@maisybrain" />
<meta name="twitter:title" content="checkmate * ੈ♡‧₊˚" />
<meta name="twitter:description" content="your own little angel.. care for a game?" />
<meta name="twitter:image" content="https://checkmate.maisybrain.com/images/checkmate-preview.jpg" />
<meta name="twitter:image:alt" content="checkmate aesthetic with cute ASCII character" />
```

## Image Details

The image for the Twitter/X card:

- **Filename**: `checkmate-preview.jpg`
- **Location**: Placed in the `public/images/` directory
- **URL path**: `/images/checkmate-preview.jpg`
- **Full URL**: `https://checkmate.maisybrain.com/images/checkmate-preview.jpg`

## Image Requirements (per X docs)

- **Format**: JPG, PNG, WEBP, or GIF
- **Size**: Less than 5MB
- **Dimensions**: Minimum 300x157, recommended 1200x630 pixels
- **Aspect ratio**: 2:1 (width twice the height)
- **No text**: X recommends avoiding text in the image as it may be cropped

## Testing Your Card

1. **X Card Validator** (official tool):
   - Visit [https://cards-dev.twitter.com/validator](https://cards-dev.twitter.com/validator)
   - Enter your website URL
   - Click "Preview card"

2. **Live Testing**:
   - Once deployed, post your URL on Twitter/X
   - Check that the card displays properly
   - Note: X caches cards, so changes may not appear immediately

## Troubleshooting

If your card doesn't appear correctly:

1. **Verify meta tags**: Use browser dev tools to check that all required meta tags are present
2. **Validate image URL**: Make sure your image URL is absolute and accessible
3. **Check dimensions**: Ensure your image meets X's recommended size (1200x630px)
4. **Clear cache**: X may cache previews; use the validator to request a refresh
5. **Check page access**: Make sure your page is publicly accessible (not localhost)

## References

- [Official X Card Documentation](https://developer.x.com/en/docs/x-for-websites/cards/overview/summary-card-with-large-image)
- [X Card Validator](https://cards-dev.twitter.com/validator) 
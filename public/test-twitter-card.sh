#!/bin/bash

# Test Twitter/X Card implementation
# This script checks if the Twitter meta tags are present on your site

echo "Testing Twitter/X Card implementation for your site"
echo "=================================================="
echo ""

# Check if URL is provided
if [ -z "$1" ]; then
  echo "Please provide your website URL as argument."
  echo "Example: ./test-twitter-card.sh https://checkmate.maisybrain.com"
  exit 1
fi

URL=$1
echo "Testing URL: $URL"
echo ""
echo "Fetching page..."

# Fetch the page and check for Twitter card meta tags
PAGE=$(curl -s "$URL")

# Check for required meta tags
echo "Checking for required Twitter/X card meta tags:"
echo "----------------------------------------------"

check_tag() {
  if echo "$PAGE" | grep -q "$1"; then
    echo "✅ $1 found"
  else
    echo "❌ $1 NOT found"
  fi
}

check_tag "twitter:card"
check_tag "twitter:title"
check_tag "twitter:description"
check_tag "twitter:image"

echo ""
echo "Next steps:"
echo "1. Visit https://cards-dev.twitter.com/validator"
echo "2. Enter your URL: $URL"
echo "3. Click 'Preview card'"
echo ""
echo "Remember: X may cache card previews, so changes might not appear immediately." 
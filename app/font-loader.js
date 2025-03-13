// Font loader for retro terminal fonts
export function loadRetroFonts() {
  // Check if fonts are already loaded
  if (document.getElementById('retro-font-loader')) {
    return;
  }

  // Create a style element for font loading
  const style = document.createElement('style');
  style.id = 'retro-font-loader';
  style.textContent = `
    @font-face {
      font-family: 'VT323';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url(https://fonts.gstatic.com/s/vt323/v17/pxiKyp0ihIEF2isfFJU.woff2) format('woff2');
    }

    body, input, button, textarea, pre, code {
      font-family: 'VT323', monospace !important;
    }
  `;
  
  document.head.appendChild(style);

  // Create a link element for VT323 font
  const vt323Link = document.createElement('link');
  vt323Link.rel = 'stylesheet';
  vt323Link.href = 'https://fonts.googleapis.com/css2?family=VT323&display=swap';
  document.head.appendChild(vt323Link);

  // Force font loading by creating a hidden element
  const fontLoader = document.createElement('div');
  fontLoader.style.fontFamily = 'VT323, monospace';
  fontLoader.style.visibility = 'hidden';
  fontLoader.style.position = 'absolute';
  fontLoader.style.top = '-9999px';
  fontLoader.style.left = '-9999px';
  fontLoader.textContent = 'Font Loader';
  document.body.appendChild(fontLoader);

  // Remove the loader element after fonts are loaded
  setTimeout(() => {
    if (fontLoader.parentNode) {
      fontLoader.parentNode.removeChild(fontLoader);
    }
  }, 3000);
} 
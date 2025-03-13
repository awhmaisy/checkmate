// CRT Effects for cool-retro-term inspired UI

// Random flicker effect for CRT screen
export function applyRandomFlicker() {
  const crtScreen = document.querySelector('.crt-screen');
  if (!crtScreen) return;
  
  // Create a flicker overlay element
  const flickerOverlay = document.createElement('div');
  flickerOverlay.className = 'crt-flicker-overlay';
  flickerOverlay.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.03);
    pointer-events: none;
    z-index: 100;
    opacity: 0;
  `;
  
  crtScreen.appendChild(flickerOverlay);
  
  // Random flicker function
  const randomFlicker = () => {
    // Random chance of flicker
    if (Math.random() < 0.03) {
      flickerOverlay.style.opacity = (Math.random() * 0.2).toString();
      
      // Reset after a short time
      setTimeout(() => {
        flickerOverlay.style.opacity = '0';
      }, Math.random() * 100);
    }
    
    // Schedule next flicker
    requestAnimationFrame(randomFlicker);
  };
  
  // Start the flicker effect
  randomFlicker();
}

// Enhanced glow effect for text
export function applyEnhancedGlow() {
  const textElements = document.querySelectorAll('.crt-text');
  
  textElements.forEach(element => {
    // Add a subtle pulse animation to the text shadow
    element.style.animation = 'textPulse 4s infinite alternate';
  });
  
  // Create the keyframe animation if it doesn't exist
  if (!document.getElementById('crt-glow-keyframes')) {
    const style = document.createElement('style');
    style.id = 'crt-glow-keyframes';
    style.textContent = `
      @keyframes textPulse {
        0% { text-shadow: 0 0 4px var(--crt-shadow), 0 0 8px var(--crt-shadow); }
        50% { text-shadow: 0 0 8px var(--crt-shadow), 0 0 12px var(--crt-shadow), 0 0 20px var(--crt-shadow); }
        100% { text-shadow: 0 0 4px var(--crt-shadow), 0 0 8px var(--crt-shadow); }
      }
    `;
    document.head.appendChild(style);
  }
}

// Chromatic aberration effect for text
export function applyChromaticAberration() {
  const textElements = document.querySelectorAll('.crt-text');
  
  textElements.forEach(element => {
    if (!element.hasAttribute('data-text')) {
      element.setAttribute('data-text', element.textContent);
      element.classList.add('crt-chromatic');
    }
  });
}

// Scan line effect with variable intensity
export function applyScanLines(intensity = 0.15) {
  const crtScreen = document.querySelector('.crt-screen');
  if (!crtScreen) return;
  
  // Create scan lines overlay
  const scanLinesOverlay = document.createElement('div');
  scanLinesOverlay.className = 'crt-scanlines';
  scanLinesOverlay.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      rgba(0, 0, 0, 0) 50%, 
      rgba(0, 0, 0, ${intensity}) 50%
    );
    background-size: 100% 4px;
    pointer-events: none;
    z-index: 99;
  `;
  
  crtScreen.appendChild(scanLinesOverlay);
}

// Add terminal typing effect
export function applyTerminalTypingEffect() {
  // Create a style element for the typing animation
  if (!document.getElementById('terminal-typing-effect')) {
    const style = document.createElement('style');
    style.id = 'terminal-typing-effect';
    style.textContent = `
      @keyframes terminalTyping {
        from { width: 0; }
      }
      
      .terminal-typing {
        overflow: hidden;
        white-space: nowrap;
        animation: terminalTyping 0.5s steps(40, end);
        animation-fill-mode: forwards;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Function to apply typing effect to new messages
  const applyTypingToNewMessages = () => {
    const messages = document.querySelectorAll('.crt-message-ai:not(.typed)');
    
    messages.forEach(message => {
      message.classList.add('typed');
      const textElement = message.querySelector('.crt-text');
      if (textElement) {
        textElement.classList.add('terminal-typing');
      }
    });
  };
  
  // Create an observer to watch for new messages
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        applyTypingToNewMessages();
      }
    });
  });
  
  // Start observing the message container
  const messageContainer = document.getElementById('message-container');
  if (messageContainer) {
    observer.observe(messageContainer, { 
      childList: true, 
      subtree: true 
    });
    
    // Apply to existing messages
    applyTypingToNewMessages();
  }
}

// Apply all CRT effects
export function applyAllCRTEffects() {
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEffects);
  } else {
    initEffects();
  }
  
  function initEffects() {
    applyRandomFlicker();
    applyScanLines(0.15);
    applyEnhancedGlow();
    applyTerminalTypingEffect();
    
    // Apply chromatic aberration to new text elements as they appear
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          applyChromaticAberration();
          applyEnhancedGlow();
        }
      });
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    // Initial application
    applyChromaticAberration();
  }
}

// Change color scheme
export function changeColorScheme(scheme) {
  const crtScreen = document.querySelector('.crt-screen');
  if (!crtScreen) return;
  
  // Remove existing color classes
  crtScreen.classList.remove('crt-amber', 'crt-green', 'crt-white', 'crt-pink');
  
  // Add the selected scheme
  if (scheme === 'amber' || scheme === 'green' || scheme === 'white' || scheme === 'pink') {
    crtScreen.classList.add(`crt-${scheme}`);
  }
} 
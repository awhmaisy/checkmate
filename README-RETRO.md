# Cool Retro Terminal Styling for Checkmate

This project implements a retro terminal styling inspired by [cool-retro-term](https://github.com/Swordfish90/cool-retro-term) for the Checkmate chat application.

## Visual Effects Implemented

The retro terminal styling includes the following visual effects:

### Font and Text Rendering
- Monospaced fonts that resemble old terminals (VT323, IBM VGA)
- Text glow effect to simulate CRT phosphor glow

### CRT Effects
- Scanlines to simulate CRT monitor scan lines
- Flickering effect to simulate CRT instability
- Chromatic aberration (color fringing) for text
- Screen curvature effect to simulate CRT monitor curvature

### Color Schemes
- Amber: Classic amber phosphor (default)
- Green: Classic green phosphor
- White: White phosphor

### Background and Shading
- Dark background with subtle noise
- Glow effects for text and UI elements

## Implementation Details

The retro terminal styling is implemented using:

1. **CSS**: 
   - `retro-terminal.css`: Contains the base styling for the retro terminal look
   - Custom CSS variables for different color schemes

2. **JavaScript**:
   - `crt-effects.js`: Contains JavaScript functions for dynamic effects like flickering and chromatic aberration

3. **Fonts**:
   - VT323: A pixel font that resembles old terminal fonts
   - IBM VGA: A font that resembles the classic IBM VGA font

## Usage

The retro terminal styling can be customized by:

1. Changing the color scheme using the color buttons in the header
2. Adjusting the intensity of effects in the `crt-effects.js` file
3. Modifying the CSS variables in `retro-terminal.css`

## Credits

- Inspired by [cool-retro-term](https://github.com/Swordfish90/cool-retro-term)
- Fonts: VT323 (Google Fonts), IBM VGA (CDN Fonts) 
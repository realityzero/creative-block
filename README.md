# Creative Block

Creative Block is a Chrome extension for quickly editing page content in-place.  
It lets you edit text, replace images, change background/text colors, set background images, and inspect element boundaries on any site.

## Features

- Enable/disable in-page text editing (`document.designMode`) from the popup.
- Show/hide element boundary overlays with tag labels while hovering elements.
- Right-click an image to replace it with a local file.
- Right-click elements/pages to change background color.
- Right-click elements/pages to change background image.
- Right-click text/elements to change text color.

## How It Works

- `background.js` registers context menu items and routes actions to the active tab.
- `content.js` performs all page-level DOM edits and renders the color picker UI.
- `popup.js` controls edit mode and boundary mode via tab messaging/script injection.
- `styles.css` contains shared styles for overlay/picker UI.
- `manifest.json` wires everything together as a Manifest V3 extension.

## Installation (Load Unpacked)

1. Open Chrome and go to `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select this project folder.

## Usage

### Popup Controls

- Click the extension icon.
- Use **Enable Text Editing** to toggle direct text editing on the active page.
- Use **Show Element Boundaries** to visualize hovered element bounds/tags.

### Right-Click Context Menu

- **Replace Image**: Right-click an image and choose this option.
- **Change Background Color**: Right-click an element/page and pick a color.
- **Change Background Image**: Right-click and choose an image file.
- **Change Text Color**: Right-click over text/element and pick a text color.

## Permissions

From `manifest.json`:

- `contextMenus`: Adds custom right-click actions.
- `activeTab`: Works on the currently active tab.
- `scripting`: Checks/toggles design mode in the active page.
- `content_scripts` on `<all_urls>`: Enables editing features on all supported pages.

## Project Structure

```text
creative-block/
├── manifest.json
├── background.js
├── content.js
├── popup.html
├── popup.js
└── styles.css
```

## Notes / Limitations

- Changes are applied only in the current page session (not persisted across reloads).
- Browser-internal pages (for example `chrome://` URLs) may not support content script actions.
- `manifest.json` references `icon16.png`, `icon48.png`, and `icon128.png`; add these files to avoid missing icon warnings when loading the extension.

## Development

- No build step is required.
- Edit files, then reload the extension from `chrome://extensions` to test changes.

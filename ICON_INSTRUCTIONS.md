# App Icon Instructions

You need to create two icon files for the PWA to work properly:

## Required Icons:

1. **icon-192.png** (192x192 pixels)
2. **icon-512.png** (512x512 pixels)

## How to Create Icons:

### Option 1: Use an Online Tool
1. Go to https://www.favicon-generator.org/ or https://realfavicongenerator.net/
2. Upload your logo/image (suggestion: wave emoji 🌊 or wind emoji 💨)
3. Generate icons
4. Download the 192x192 and 512x512 PNG files
5. Rename them to `icon-192.png` and `icon-512.png`
6. Place them in the root of your `dist/` folder

### Option 2: Use an Image Editor
1. Create a square image (512x512 recommended)
2. Use a simple design with your app branding
3. Suggested colors: Blue/teal to match the app theme
4. Save as PNG
5. Resize to 192x192 for the smaller version

### Option 3: Simple Text Icon
1. Use a tool like https://www.canva.com
2. Create a 512x512 square
3. Add text: "WF" or "🌊" or "💨"
4. Background: Gradient blue (#667eea to #764ba2)
5. Export as PNG

## Temporary Solution:

For now, the app will work without icons, but:
- Install prompts may not look as nice
- Home screen icon will be generic
- Some browsers may not show the install prompt

## Once You Have Icons:

Place them in the `dist/` folder:
```
dist/
├── index.html
├── manifest.json
├── icon-192.png  ← Add this
├── icon-512.png  ← Add this
├── css/
└── js/
```

Then the PWA will be fully functional!

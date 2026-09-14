import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// 1. Create the square Logo SVG (512x512)
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#090d16" />
    </linearGradient>

    <!-- Gold Gradients -->
    <linearGradient id="goldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="35%" stop-color="#f59e0b" />
      <stop offset="75%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#92400e" />
    </linearGradient>

    <linearGradient id="goldGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fde68a" />
      <stop offset="40%" stop-color="#fbbf24" />
      <stop offset="85%" stop-color="#b45309" />
      <stop offset="100%" stop-color="#78350f" />
    </linearGradient>

    <!-- Inner Glow Filter -->
    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <radialGradient id="beaconLight" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.35" />
      <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Background with subtle border -->
  <rect width="512" height="512" rx="108" fill="url(#bgGrad)" />
  <rect width="504" height="504" x="4" y="4" rx="104" fill="none" stroke="url(#goldGrad1)" stroke-width="3" stroke-opacity="0.5" />
  
  <!-- Ambient Beacon Light -->
  <circle cx="256" cy="230" r="210" fill="url(#beaconLight)" />

  <!-- Outer Geometric Knowledge Seal -->
  <circle cx="256" cy="256" r="190" fill="none" stroke="url(#goldGrad1)" stroke-width="1.5" stroke-dasharray="4 8" stroke-opacity="0.6" />
  <circle cx="256" cy="256" r="176" fill="none" stroke="url(#goldGrad2)" stroke-width="1" stroke-opacity="0.4" />

  <!-- Main 10-Dimensions Stylized Open Book Symbol -->
  <g transform="translate(0, 10)">
    <!-- Layer 3: Back dimensional wings (Dimensions 9-10: Silk & Dedicated Hardware) -->
    <path d="M 256 310 C 215 285, 140 270, 96 286 C 96 240, 145 220, 256 244 C 367 220, 416 240, 416 286 C 372 270, 297 285, 256 310 Z" 
          fill="url(#goldGrad2)" opacity="0.35" />

    <!-- Layer 2: Middle dimensional wings (Dimensions 5-8: Foil, Hardcover, USB Vault, Musical Score) -->
    <path d="M 256 328 C 210 300, 130 286, 84 306 C 84 256, 140 236, 256 262 C 372 236, 428 256, 428 306 C 382 286, 302 300, 256 328 Z" 
          fill="url(#goldGrad1)" opacity="0.6" />

    <!-- Layer 1: Front primary Book Spread (Dimensions 1-4: Manuscript, eBook, Audiobook, Videobook) -->
    <!-- Left Page -->
    <path d="M 252 355 C 205 320, 120 310, 72 334 C 72 270, 132 245, 252 276 Z" 
          fill="url(#goldGrad1)" filter="url(#goldGlow)" />
    <!-- Left Page Inner Shadow -->
    <path d="M 252 355 C 215 330, 145 322, 90 338 C 105 290, 160 268, 252 285 Z" 
          fill="#d97706" opacity="0.3" />

    <!-- Right Page -->
    <path d="M 260 355 C 307 320, 392 310, 440 334 C 440 270, 380 245, 260 276 Z" 
          fill="url(#goldGrad2)" filter="url(#goldGlow)" />
    <!-- Right Page Inner Shadow -->
    <path d="M 260 355 C 297 330, 367 322, 422 338 C 407 290, 352 268, 260 285 Z" 
          fill="#b45309" opacity="0.3" />

    <!-- Central Spine / Knowledge Beacon Pillar -->
    <path d="M 252 370 L 260 370 L 258 240 L 254 240 Z" fill="url(#goldGrad1)" />

    <!-- The Ascending Knowledge Nib / Beacon -->
    <g transform="translate(256, 175)">
      <!-- Golden Quill Pen & Diamond Beacon Point -->
      <polygon points="0,-65 -22,-15 -14,25 0,38 14,25 22,-15" fill="url(#goldGrad1)" filter="url(#goldGlow)" />
      <polygon points="0,-65 0,38 14,25 22,-15" fill="url(#goldGrad2)" />
      
      <!-- Slit line and breather hole -->
      <line x1="0" y1="-65" x2="0" y2="0" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" />
      <circle cx="0" cy="0" r="4.5" fill="#0f172a" />

      <!-- Radiant Diamond Star on Top of Quill -->
      <path d="M 0 -72 L 6 -82 L 16 -88 L 6 -94 L 0 -104 L -6 -94 L -16 -88 L -6 -82 Z" fill="#ffffff" />
      <circle cx="0" cy="-88" r="14" fill="#fef08a" opacity="0.4" filter="url(#goldGlow)" />
    </g>

    <!-- 10 Dimensional Light Stars (5 on each side representing the 10 Dimensions) -->
    <!-- Left Stars -->
    <circle cx="110" cy="220" r="2.5" fill="#fde68a" />
    <circle cx="145" cy="185" r="3.5" fill="#f59e0b" />
    <circle cx="190" cy="160" r="2.5" fill="#fef08a" />
    <circle cx="160" cy="130" r="2" fill="#ffffff" />
    <circle cx="215" cy="120" r="3" fill="#f59e0b" />

    <!-- Right Stars -->
    <circle cx="402" cy="220" r="2.5" fill="#fde68a" />
    <circle cx="367" cy="185" r="3.5" fill="#f59e0b" />
    <circle cx="322" cy="160" r="2.5" fill="#fef08a" />
    <circle cx="352" cy="130" r="2" fill="#ffffff" />
    <circle cx="297" cy="120" r="3" fill="#f59e0b" />
  </g>

  <!-- Typography: JOHNNYBLUE1 & KNOWLEDGE CENTA -->
  <text x="256" y="420" font-family="'Cinzel', 'Trajan Pro', 'Georgia', serif" font-size="28" font-weight="900" letter-spacing="6" fill="#fef08a" text-anchor="middle" filter="url(#goldGlow)">
    JOHNNYBLUE1
  </text>
  <text x="256" y="445" font-family="'Montserrat', 'Inter', 'Segoe UI', sans-serif" font-size="14" font-weight="700" letter-spacing="7" fill="#fbbf24" text-anchor="middle" opacity="0.9">
    KNOWLEDGE CENTA
  </text>
  <text x="256" y="468" font-family="'Montserrat', 'Inter', 'Segoe UI', sans-serif" font-size="9" font-weight="600" letter-spacing="4" fill="#94a3b8" text-anchor="middle" opacity="0.8">
    10-DIMENSION BOOKSTORE • PUBLISHING
  </text>
</svg>`;

// 2. Create the wide 1200x630 Social Share Banner SVG for Open Graph / Twitter / Facebook / WhatsApp
const ogBannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgOgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16" />
      <stop offset="45%" stop-color="#0f172a" />
      <stop offset="85%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0b1120" />
    </linearGradient>

    <!-- Gold Gradients -->
    <linearGradient id="ogGoldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="35%" stop-color="#f59e0b" />
      <stop offset="75%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#92400e" />
    </linearGradient>

    <linearGradient id="ogGoldGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fde68a" />
      <stop offset="40%" stop-color="#fbbf24" />
      <stop offset="85%" stop-color="#b45309" />
      <stop offset="100%" stop-color="#78350f" />
    </linearGradient>

    <radialGradient id="ogBeaconLight" cx="22%" cy="50%" r="55%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.32" />
      <stop offset="45%" stop-color="#38bdf8" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
    </radialGradient>

    <filter id="ogGoldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Canvas Background -->
  <rect width="1200" height="630" fill="url(#bgOgGrad)" />
  
  <!-- Outer Gold Border -->
  <rect width="1180" height="610" x="10" y="10" rx="20" fill="none" stroke="url(#ogGoldGrad1)" stroke-width="2" stroke-opacity="0.4" />
  <rect width="1164" height="594" x="18" y="18" rx="14" fill="none" stroke="url(#ogGoldGrad2)" stroke-width="1" stroke-opacity="0.2" />

  <!-- Ambient Beacon Light over Emblem -->
  <circle cx="280" cy="315" r="300" fill="url(#ogBeaconLight)" />

  <!-- Grid overlay for digital-physical aesthetic -->
  <g opacity="0.05" stroke="#fef08a" stroke-width="1">
    <line x1="0" y1="105" x2="1200" y2="105" />
    <line x1="0" y1="210" x2="1200" y2="210" />
    <line x1="0" y1="315" x2="1200" y2="315" />
    <line x1="0" y1="420" x2="1200" y2="420" />
    <line x1="0" y1="525" x2="1200" y2="525" />
    <line x1="200" y1="0" x2="200" y2="630" />
    <line x1="400" y1="0" x2="400" y2="630" />
    <line x1="600" y1="0" x2="600" y2="630" />
    <line x1="800" y1="0" x2="800" y2="630" />
    <line x1="1000" y1="0" x2="1000" y2="630" />
  </g>

  <!-- ================= LEFT: EMBLEM LOGO (Centered at x=280, y=315) ================= -->
  <g transform="translate(45, 60) scale(0.92)">
    <!-- Outer Shield Halo -->
    <circle cx="256" cy="256" r="180" fill="none" stroke="url(#ogGoldGrad1)" stroke-width="2" stroke-dasharray="6 10" stroke-opacity="0.6" />
    <circle cx="256" cy="256" r="165" fill="none" stroke="url(#ogGoldGrad2)" stroke-width="1" stroke-opacity="0.4" />

    <!-- 10-Dimensions Stylized Open Book Symbol -->
    <g transform="translate(0, 10)">
      <!-- Layer 3: Back wings -->
      <path d="M 256 310 C 215 285, 140 270, 96 286 C 96 240, 145 220, 256 244 C 367 220, 416 240, 416 286 C 372 270, 297 285, 256 310 Z" 
            fill="url(#ogGoldGrad2)" opacity="0.35" />

      <!-- Layer 2: Middle wings -->
      <path d="M 256 328 C 210 300, 130 286, 84 306 C 84 256, 140 236, 256 262 C 372 236, 428 256, 428 306 C 382 286, 302 300, 256 328 Z" 
            fill="url(#ogGoldGrad1)" opacity="0.6" />

      <!-- Left Page -->
      <path d="M 252 355 C 205 320, 120 310, 72 334 C 72 270, 132 245, 252 276 Z" 
            fill="url(#ogGoldGrad1)" filter="url(#ogGoldGlow)" />
      <!-- Right Page -->
      <path d="M 260 355 C 307 320, 392 310, 440 334 C 440 270, 380 245, 260 276 Z" 
            fill="url(#ogGoldGrad2)" filter="url(#ogGoldGlow)" />

      <!-- Spine Pillar -->
      <path d="M 252 370 L 260 370 L 258 240 L 254 240 Z" fill="url(#ogGoldGrad1)" />

      <!-- Quill Nib Beacon -->
      <g transform="translate(256, 175)">
        <polygon points="0,-65 -22,-15 -14,25 0,38 14,25 22,-15" fill="url(#ogGoldGrad1)" filter="url(#ogGoldGlow)" />
        <polygon points="0,-65 0,38 14,25 22,-15" fill="url(#ogGoldGrad2)" />
        <line x1="0" y1="-65" x2="0" y2="0" stroke="#0f172a" stroke-width="2.5" />
        <circle cx="0" cy="0" r="4.5" fill="#0f172a" />
        <!-- Top Star -->
        <path d="M 0 -72 L 6 -82 L 16 -88 L 6 -94 L 0 -104 L -6 -94 L -16 -88 L -6 -82 Z" fill="#ffffff" />
        <circle cx="0" cy="-88" r="14" fill="#fef08a" opacity="0.4" filter="url(#ogGoldGlow)" />
      </g>
    </g>
  </g>

  <!-- ================= RIGHT: BRAND TYPOGRAPHY & VALUE PROPOSITION ================= -->
  <g transform="translate(560, 0)">
    <!-- Category Pill Badge -->
    <g transform="translate(0, 120)">
      <rect width="360" height="34" rx="17" fill="#f59e0b" fill-opacity="0.15" stroke="#f59e0b" stroke-opacity="0.4" stroke-width="1.5" />
      <circle cx="18" cy="17" r="5" fill="#10b981" />
      <text x="34" y="22" font-family="'Montserrat', 'Inter', sans-serif" font-size="12" font-weight="700" letter-spacing="2.5" fill="#fbbf24">
        10-DIMENSION PUBLISHING HOUSE
      </text>
    </g>

    <!-- Main Headings -->
    <text x="0" y="215" font-family="'Cinzel', 'Trajan Pro', 'Georgia', serif" font-size="52" font-weight="900" letter-spacing="4" fill="#ffffff">
      JOHNNYBLUE1
    </text>
    <text x="0" y="275" font-family="'Cinzel', 'Trajan Pro', 'Georgia', serif" font-size="44" font-weight="800" letter-spacing="5" fill="url(#ogGoldGrad1)" filter="url(#ogGoldGlow)">
      KNOWLEDGE CENTA
    </text>

    <!-- Divider Line -->
    <line x1="0" y1="310" x2="570" y2="310" stroke="url(#ogGoldGrad1)" stroke-width="2" stroke-opacity="0.5" />

    <!-- Subtitle Description -->
    <text x="0" y="352" font-family="'Montserrat', 'Inter', sans-serif" font-size="20" font-weight="400" fill="#e2e8f0">
      The World's 10-Dimension Physical &amp; Digital Bookstore
    </text>

    <!-- Key Feature Badges -->
    <g transform="translate(0, 395)">
      <!-- Badge 1: Gemini AI -->
      <rect x="0" y="0" width="180" height="34" rx="8" fill="#1e293b" stroke="#475569" stroke-width="1" />
      <text x="90" y="22" font-family="'Montserrat', 'Inter', sans-serif" font-size="12" font-weight="600" fill="#38bdf8" text-anchor="middle">
        ✨ Gemini 3.8 AI Scholar
      </text>

      <!-- Badge 2: 10 Dimensions -->
      <rect x="195" y="0" width="175" height="34" rx="8" fill="#1e293b" stroke="#475569" stroke-width="1" />
      <text x="282" y="22" font-family="'Montserrat', 'Inter', sans-serif" font-size="12" font-weight="600" fill="#fbbf24" text-anchor="middle">
        📚 10 Sensory Formats
      </text>

      <!-- Badge 3: Google AdSense & Drive -->
      <rect x="385" y="0" width="175" height="34" rx="8" fill="#1e293b" stroke="#475569" stroke-width="1" />
      <text x="472" y="22" font-family="'Montserrat', 'Inter', sans-serif" font-size="12" font-weight="600" fill="#34d399" text-anchor="middle">
        🛡️ Cloud Drive Vault
      </text>
    </g>

    <!-- Social Proof / URL Box at Bottom Right -->
    <g transform="translate(0, 475)">
      <rect width="560" height="52" rx="12" fill="#0b1120" stroke="url(#ogGoldGrad1)" stroke-width="1.5" stroke-opacity="0.6" />
      
      <!-- Globe Icon -->
      <circle cx="30" cy="26" r="12" fill="#f59e0b" fill-opacity="0.2" />
      <text x="24" y="31" font-size="14" fill="#fbbf24">🌐</text>
      
      <!-- URL Text -->
      <text x="56" y="32" font-family="'Courier New', monospace" font-size="16" font-weight="700" fill="#fef08a" letter-spacing="1">
        johnnyblue1-knowledge-centa.web.app
      </text>

      <text x="535" y="32" font-family="'Montserrat', 'Inter', sans-serif" font-size="12" font-weight="700" fill="#38bdf8" text-anchor="end">
        OFFICIAL PORTAL
      </text>
    </g>
  </g>
</svg>`;

async function generateAssets() {
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Write SVGs
  const logoSvgPath = path.join(publicDir, 'logo.svg');
  const ogBannerSvgPath = path.join(publicDir, 'og-image.svg');
  fs.writeFileSync(logoSvgPath, logoSvg);
  fs.writeFileSync(ogBannerSvgPath, ogBannerSvg);
  console.log('Wrote SVG files');

  // 2. Render PNG files with sharp
  // High-res Logo (512x512)
  await sharp(Buffer.from(logoSvg))
    .resize(512, 512)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'logo.png'));

  // Square Icon for WhatsApp / Twitter / Favicon (512x512)
  await sharp(Buffer.from(logoSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'logo-square.png'));

  // Apple Touch Icon (180x180)
  await sharp(Buffer.from(logoSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // Favicons (32x32 and 16x16)
  await sharp(Buffer.from(logoSvg))
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));

  await sharp(Buffer.from(logoSvg))
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'));

  // Favicon.ico (32x32 PNG renamed to ico for browser compatibility)
  await sharp(Buffer.from(logoSvg))
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));

  // High-res Open Graph / Twitter Banner (1200x630)
  await sharp(Buffer.from(ogBannerSvg))
    .resize(1200, 630)
    .png({ quality: 95 })
    .toFile(path.join(publicDir, 'og-image.png'));

  console.log('Successfully generated all logo and social share images in /public!');
}

generateAssets().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});

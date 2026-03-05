#!/usr/bin/env node
/**
 * Export all slide animations as PNG sequences and GIFs.
 * Usage: node export-animations.js
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const OUTDIR = path.join(__dirname, 'exports');
const HTML_PATH = path.join(__dirname, 'index.html');

if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, { recursive: true });

function findChromium() {
  for (const c of ['chromium', 'chromium-browser', 'google-chrome']) {
    try { execSync(`which ${c}`, { stdio: 'ignore' }); return c; } catch {}
  }
  throw new Error('No chromium found');
}

function main() {
  const chromium = findChromium();
  const htmlContent = fs.readFileSync(HTML_PATH, 'utf8');

  const sections = htmlContent.split(/<section class="slide/);
  const slideData = [];
  for (let i = 1; i < sections.length; i++) {
    const endIdx = sections[i].indexOf('</section>');
    const sectionHtml = sections[i].substring(0, endIdx);
    const stepMatches = sectionHtml.match(/class="anim-step"/g);
    const idMatch = sectionHtml.match(/id="(slide-\d+)"/);
    slideData.push({
      index: i - 1,
      id: idMatch ? idMatch[1] : `slide-${i}`,
      steps: stepMatches ? stepMatches.length : 0
    });
  }

  console.log(`Exporting ${slideData.length} slides...`);
  let totalPNGs = 0;

  for (const slide of slideData) {
    const slideDir = path.join(OUTDIR, slide.id);
    if (!fs.existsSync(slideDir)) fs.mkdirSync(slideDir, { recursive: true });

    for (let step = 0; step <= slide.steps; step++) {
      const outPath = path.join(slideDir, `step-${step}.png`);
      const url = `file://${HTML_PATH}#slide=${slide.index}&step=${step}`;

      try {
        execSync(
          `${chromium} --headless --no-sandbox --disable-gpu --screenshot="${outPath}" --window-size=1920,1080 "${url}"`,
          { timeout: 10000, stdio: 'pipe' }
        );
        totalPNGs++;
      } catch {}
    }

    // Create GIF if ffmpeg available and there are animation steps
    if (slide.steps > 0) {
      try {
        execSync('which ffmpeg', { stdio: 'ignore' });
        const gifPath = path.join(OUTDIR, `${slide.id}.gif`);
        execSync(
          `ffmpeg -y -framerate 1 -i "${slideDir}/step-%d.png" -vf "scale=960:540" -loop 0 "${gifPath}"`,
          { stdio: 'pipe', timeout: 30000 }
        );
      } catch {}
    }

    console.log(`✓ ${slide.id} (${slide.steps + 1} PNGs)`);
  }

  console.log(`\nDone! ${totalPNGs} PNGs exported to ${OUTDIR}/`);
}

main();

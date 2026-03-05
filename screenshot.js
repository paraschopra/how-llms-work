#!/usr/bin/env node
/**
 * Screenshot every animation step of the presentation.
 * Usage: node screenshot.js
 * Uses URL hash navigation: index.html#slide=N&step=M
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const OUTDIR = path.join(__dirname, 'screenshots');
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
  console.log(`Using: ${chromium}`);

  const htmlContent = fs.readFileSync(HTML_PATH, 'utf8');

  // Count slides and steps per slide
  const sections = htmlContent.split(/<section class="slide/);
  const stepCounts = [];
  for (let i = 1; i < sections.length; i++) {
    const endIdx = sections[i].indexOf('</section>');
    const sectionHtml = sections[i].substring(0, endIdx);
    const stepMatches = sectionHtml.match(/class="anim-step"/g);
    stepCounts.push(stepMatches ? stepMatches.length : 0);
  }

  const totalSlides = stepCounts.length;
  console.log(`Found ${totalSlides} slides`);
  console.log('Step counts:', stepCounts);

  let totalScreenshots = 0;

  for (let s = 0; s < totalSlides; s++) {
    for (let step = 0; step <= stepCounts[s]; step++) {
      const name = `slide-${String(s + 1).padStart(2, '0')}-step-${step}.png`;
      const outPath = path.join(OUTDIR, name);
      const url = `file://${HTML_PATH}#slide=${s}&step=${step}`;

      try {
        execSync(
          `${chromium} --headless --no-sandbox --disable-gpu --disable-software-rasterizer --screenshot="${outPath}" --window-size=1920,1080 "${url}"`,
          { timeout: 10000, stdio: 'pipe' }
        );
        totalScreenshots++;
        if (step === 0) process.stdout.write(`✓ slide-${s + 1} `);
      } catch (e) {
        process.stdout.write(`✗`);
      }
    }
    process.stdout.write(`(${stepCounts[s] + 1} shots)\n`);
  }

  console.log(`\nDone! ${totalScreenshots} screenshots in ${OUTDIR}/`);
}

main();

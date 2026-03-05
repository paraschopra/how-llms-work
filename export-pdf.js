#!/usr/bin/env node
/**
 * Export the presentation (index.html) to PDF.
 * Each animation step becomes a separate page in the PDF.
 *
 * Usage: node export-pdf.js [output.pdf]
 */

const puppeteer = require('puppeteer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const HTML_PATH = path.join(__dirname, 'index.html');
const DEFAULT_OUT = path.join(__dirname, 'presentation.pdf');

async function main() {
  const outPath = process.argv[2] || DEFAULT_OUT;

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--disable-software-rasterizer'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // Load the page once and wait for full render
  const url = `file://${HTML_PATH}`;
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait for all images to load
  await page.evaluate(() => {
    return Promise.all(
      Array.from(document.querySelectorAll('img')).map((img) =>
        img.complete ? Promise.resolve() : new Promise((resolve) => {
          img.addEventListener('load', resolve);
          img.addEventListener('error', resolve);
        })
      )
    );
  });

  // Use the presentation's own API to get accurate step counts
  const stepCounts = await page.evaluate(() => window.presentationAPI.getAllStepCounts());
  const totalSlides = stepCounts.length;
  const totalPages = stepCounts.reduce((sum, s) => sum + s + 1, 0);
  console.log(`Found ${totalSlides} slides, ${totalPages} total pages`);
  console.log('Steps per slide:', stepCounts);

  const pdfDoc = await PDFDocument.create();
  const pageWidth = 1920 * 0.75;  // points (1 px ≈ 0.75 pt)
  const pageHeight = 1080 * 0.75;

  let pageNum = 0;

  for (let s = 0; s < totalSlides; s++) {
    for (let step = 0; step <= stepCounts[s]; step++) {
      pageNum++;

      // Use the presentation API to navigate to the exact slide+step
      await page.evaluate((slideIdx, stepIdx) => {
        window.presentationAPI.showSlide(slideIdx, stepIdx);
      }, s, step);

      // Wait for CSS transitions/animations to settle
      await new Promise((r) => setTimeout(r, 600));

      const screenshot = await page.screenshot({ type: 'png' });
      const img = await pdfDoc.embedPng(screenshot);

      const pdfPage = pdfDoc.addPage([pageWidth, pageHeight]);
      pdfPage.drawImage(img, {
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
      });

      process.stdout.write(`\r  Exported page ${pageNum}/${totalPages} (slide ${s + 1}, step ${step})`);
    }
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outPath, pdfBytes);

  await browser.close();
  console.log(`\nDone! ${pageNum} pages saved to ${outPath}`);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});

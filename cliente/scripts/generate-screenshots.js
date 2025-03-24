import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateScreenshots() {
  console.log('Generando capturas de pantalla para PWA...');
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  

  const url = 'http://localhost:5173';
  
  
  const outputDir = path.join(__dirname, '../public');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Captura de pantalla para escritorio
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.screenshot({ 
    path: path.join(outputDir, 'screenshot-wide.png'),
    fullPage: false
  });
  console.log('Captura de pantalla para escritorio generada');
  
  // Captura de pantalla para móvil
  await page.setViewport({ width: 720, height: 1280 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.screenshot({ 
    path: path.join(outputDir, 'screenshot-mobile.png'),
    fullPage: false
  });
  console.log('Captura de pantalla para móvil generada');
  
  await browser.close();
  console.log('Proceso completado');
}

generateScreenshots().catch(console.error);
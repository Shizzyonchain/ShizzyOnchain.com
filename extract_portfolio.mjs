import Tesseract from 'tesseract.js';
import fs from 'fs';

async function main() {
  console.log('Starting OCR...');
  const { data: { text } } = await Tesseract.recognize(
    'PORT.png',
    'eng',
    { logger: m => console.log(m.status + ' ' + Math.round(m.progress * 100) + '%') }
  );
  console.log('--- EXTRACTED TEXT ---');
  console.log(text);
  console.log('----------------------');
  
  fs.writeFileSync('ocr_output.txt', text);
}
main();

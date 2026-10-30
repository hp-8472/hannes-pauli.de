import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const marker = '__FORM_ENDPOINT__';

export function validateFormEndpoint(value) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error('Formspree-Endpoint fehlt: In site.config.json muss formEndpoint auf die echte Formularadresse aus dem Formspree-Konto gesetzt werden.');
  }
  const endpoint = value.trim();
  if (!/^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/.test(endpoint)) {
    throw new Error('Ungültiger Formspree-Endpoint: Erlaubt ist nur https://formspree.io/f/ gefolgt von der tatsächlichen Formular-ID, ohne weitere Pfade, Query oder Fragment.');
  }
  return endpoint;
}

async function build() {
  const config = JSON.parse(await readFile(path.join(root, 'site.config.json'), 'utf8'));
  const endpoint = validateFormEndpoint(config.formEndpoint);
  const source = path.join(root, 'site');
  const files = await readdir(source, { withFileTypes: true });
  const output = [];
  let replacements = 0;
  for (const file of files) {
    if (!file.isFile() || !/\.(html|css|js|svg)$/.test(file.name)) {
      throw new Error(`Unerwartete Quelldatei: ${file.name}`);
    }
    const content = await readFile(path.join(source, file.name), 'utf8');
    replacements += content.split(marker).length - 1;
    const rendered = content.replaceAll(marker, endpoint);
    if (rendered.includes(marker) || rendered.includes('/api/contact') || rendered.includes('.chatgpt.site')) {
      throw new Error(`Nicht veröffentlichbarer Verweis in ${file.name}.`);
    }
    output.push([file.name, rendered]);
  }
  if (replacements !== 1) throw new Error('Das Kontaktformular muss genau eine konfigurierbare Formularadresse enthalten.');
  if (!output.some(([name]) => name === 'index.html')) throw new Error('Die Startseite fehlt.');
  // Erst nach vollständiger Prüfung Dateien für die Veröffentlichung erzeugen.
  const destination = path.join(root, 'dist');
  await mkdir(destination, { recursive: true });
  for (const [name, content] of output) await writeFile(path.join(destination, name), content);
  await writeFile(path.join(destination, 'CNAME'), 'hannes-pauli.de\n');
  await writeFile(path.join(destination, '.nojekyll'), '');
  console.log(`Statische Webseite erstellt: ${output.length} Dateien sowie CNAME und .nojekyll in dist/.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    await build();
  } catch (error) {
    console.error(`Build abgebrochen: ${error.message}`);
    process.exitCode = 1;
  }
}

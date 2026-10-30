import { readFile, readdir, mkdir, writeFile, lstat, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const forbiddenReferences = ['__FORM_ENDPOINT__', '__qa', '/api/contact', '.chatgpt.site', 'formspree.io'];

async function build() {
  const source = path.join(root, 'site');
  const files = await readdir(source, { withFileTypes: true });
  const output = [];
  for (const file of files) {
    if (!file.isFile() || !/\.(html|css|js|svg)$/i.test(file.name)) {
      throw new Error(`Unerwartete Quelldatei: ${file.name}`);
    }
    const content = await readFile(path.join(source, file.name), 'utf8');
    const forbidden = forbiddenReferences.find(value => content.toLowerCase().includes(value.toLowerCase()));
    if (forbidden) {
      throw new Error(`Nicht veröffentlichbare Altlast in ${file.name}: ${forbidden}.`);
    }
    output.push([file.name, content]);
  }
  if (!output.some(([name]) => name === 'index.html')) throw new Error('Die Startseite fehlt.');
  // Erst nach vollständiger Prüfung Dateien für die Veröffentlichung erzeugen.
  const destination = path.resolve(root, 'dist');
  if (path.dirname(destination) !== path.resolve(root) || path.basename(destination) !== 'dist') {
    throw new Error('Ungültiger Ausgabepfad.');
  }
  const existingDestination = await lstat(destination).catch(error => {
    if (error.code !== 'ENOENT') throw error;
    return null;
  });
  if (existingDestination && (existingDestination.isSymbolicLink() || !existingDestination.isDirectory())) {
    throw new Error('dist/ muss ein Verzeichnis sein und darf kein symbolischer Link sein.');
  }
  // Das geprüfte Ausgabeverzeichnis vollständig erneuern, damit keine alten Dateien mitgeliefert werden.
  await rm(destination, { recursive: true, force: true });
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

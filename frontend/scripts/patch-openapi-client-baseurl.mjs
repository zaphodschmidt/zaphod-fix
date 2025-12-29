import fs from 'node:fs';
import path from 'node:path';

/**
 * Patch generated OpenAPI client to default to same-origin requests.
 *
 * Why:
 * - The generated SDK already uses absolute paths like `/api/streaks/`.
 * - If the generated client baseUrl is `http://localhost`, browsers will call
 *   the user's machine instead of your deployed domain.
 *
 * Behavior:
 * - Default baseUrl: '' (same-origin)
 * - Optional override via Vite env: VITE_API_BASE_URL
 */

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const target = path.join(root, 'src', 'api', 'client.gen.ts');

if (!fs.existsSync(target)) {
  console.error(`patch-openapi-client-baseurl: missing file: ${target}`);
  process.exit(1);
}

const contents = fs.readFileSync(target, 'utf8');

const needle = "export const client = createClient(createConfig<ClientOptions2>({ baseUrl: 'http://localhost' }));";

if (!contents.includes(needle)) {
  console.error('patch-openapi-client-baseurl: expected pattern not found (generator output changed).');
  process.exit(1);
}

const replacement =
  `// NOTE:\n` +
  `// - SDK endpoints already include \`/api/...\` in their \`url\` field.\n` +
  `// - Default to same-origin so deployed builds call the current domain.\n` +
  `// - Override if needed (e.g. local dev without nginx): VITE_API_BASE_URL=http://localhost:8002\n` +
  `const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '';\n\n` +
  `export const client = createClient(createConfig<ClientOptions2>({ baseUrl }));`;

const next = contents.replace(needle, replacement);
fs.writeFileSync(target, next);
console.log('patch-openapi-client-baseurl: patched src/api/client.gen.ts');



import { defineConfig } from 'vite';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import react from '@vitejs/plugin-react';

const pdfDirectory = resolve(process.cwd(), 'pdf files');
const availablePdfs = () => existsSync(pdfDirectory) ? readdirSync(pdfDirectory).filter(name => name.toLowerCase().endsWith('.pdf')) : [];

function storyPdfs() {
  let isBuild = false;
  return {
    name: 'missionlens-story-pdfs',
    configResolved(config: { command: string }) { isBuild = config.command === 'build'; },
    resolveId(id: string) { return id === 'virtual:mission-pdfs' ? '\0virtual:mission-pdfs' : null; },
    load(id: string) {
      if (id !== '\0virtual:mission-pdfs') return null;
      return `export const storyPdfs = ${JSON.stringify(Object.fromEntries(availablePdfs().map(name => [name, true])))};`;
    },
    configureServer(server: { middlewares: { use: (handler: (req: { method?: string; url?: string }, res: { statusCode: number; setHeader: (key: string, value: string) => void; end: (body?: string | Uint8Array) => void }, next: () => void) => void) => void } }) {
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') return next();
        let requestPath = '';
        try { requestPath = decodeURIComponent((req.url ?? '').split('?')[0]); } catch { return next(); }
        const name = requestPath.startsWith('/pdf files/') ? requestPath.slice(11) : '';
        if (!name || basename(name) !== name || !name.toLowerCase().endsWith('.pdf')) return next();
        const file = resolve(pdfDirectory, name);
        if (!existsSync(file)) { res.statusCode = 404; res.end('PDF not available'); return; }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
        res.end(req.method === 'HEAD' ? undefined : readFileSync(file));
      });
    },
    buildStart() {
      if (!isBuild) return;
      for (const name of availablePdfs()) {
        const file = resolve(pdfDirectory, name);
        if (existsSync(file)) this.emitFile({ type: 'asset', fileName: `pdf files/${name}`, source: readFileSync(file) });
      }
    },
  };
}

export default defineConfig({ plugins: [react(), storyPdfs()] });

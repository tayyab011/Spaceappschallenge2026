import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import {defineConfig} from 'vite';


function serviceWorkerManifest() {
  return {
    name: 'starbound-sw-manifest',
    apply: 'build' as const,
    closeBundle() {
      const dist = path.resolve(__dirname, 'dist');
      const swPath = path.join(dist, 'sw.js');
      if (!fs.existsSync(swPath)) return;
      const files: string[] = [];
      const walk = (dir: string) => {
        for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, e.name);
          if (e.isDirectory()) walk(full);
          else files.push('/' + path.relative(dist, full).split(path.sep).join('/'));
        }
      };
      walk(dist);
      const shell = files.filter((f) => /\.(js|css|svg)$/.test(f) && f.startsWith('/assets/') && f !== '/sw.js');
      const list = ['/', '/index.html', ...shell].sort();
      const version = crypto.createHash('sha1').update(list.join('\n')).digest('hex').slice(0, 10);
      const src = fs.readFileSync(swPath, 'utf8')
        .replace('__PRECACHE__', JSON.stringify(list))
        .replace('__VERSION__', version);
      fs.writeFileSync(swPath, src);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), serviceWorkerManifest()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});

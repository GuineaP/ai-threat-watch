import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import readingLayout from './scripts/reading-layout.mjs';
import { unified } from '@astrojs/markdown-remark';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const presentationRevision=createHash('sha256')
  .update(readFileSync(new URL('./scripts/reading-layout.mjs',import.meta.url)))
  .update(readFileSync(new URL('./scripts/reading-presentation.json',import.meta.url)))
  .digest('hex');

// GitHub Actions supplies the actual owner/repository; local builds do not invent an origin.
const repository = process.env.GITHUB_REPOSITORY;
const [owner, name] = repository?.split('/') || [];
const site = process.env.SITE_URL || (owner ? `https://${owner.toLowerCase()}.github.io` : undefined);
const base = process.env.BASE_PATH || (name ? `/${name}/` : '/');

export default defineConfig({
  output: 'static',
  outDir: process.env.OUTPUT_DIR,
  integrations: [mdx()],
  markdown: { processor: unified({ rehypePlugins: [[readingLayout,{revision:presentationRevision}]], smartypants: false }) },
  trailingSlash: 'always',
  site,
  base,
  devToolbar: { enabled: false },
});

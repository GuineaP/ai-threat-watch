import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const text = z.string().nullable().optional();
const list = z.array(z.string()).nullable().optional();
const flag = z.union([z.boolean(), z.literal('unknown')]).nullable().optional();
const confidence = z.enum(['high', 'medium', 'low', 'unknown']).nullable().optional();
const assessment = z.object({ assessment: text, evidence: list }).nullable().optional();
const source = z.object({
  id: z.string(), title: z.string(), url: z.url().nullable().optional(),
  pages: z.array(z.number().int().positive()).nullable().optional(), note: text,
});

const cases = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/cases' }),
  schema: z.object({
    id: z.string(), slug: z.string().regex(/^[a-z0-9-]+$/),
    title_zh: text, title_en: text, source_id: text,
    case_unit: z.enum(['main', 'embedded']), source_group: text,
    status: z.enum(['index-only', 'placeholder', 'draft', 'published']),
    selected_for_deep_dive: z.boolean().default(false), deep_dive: z.boolean().default(false),
    summary_zh: text, updated_at: text, actor_type: text, topics: z.array(z.string()).default([]),
    report: z.object({
      publisher: z.string(), report_id: z.string(), section: z.string(),
      pages: z.array(z.number().int().positive()).nullable().optional(),
    }),
    actors: z.object({ operator: text, commissioner: text, beneficiary: text }).nullable().optional(),
    regions: list, targets: list,
    relationships: z.object({
      attribution_country: list, content_source_country: list,
      operator_location: list, target_country: list,
    }).nullable().optional(),
    attribution: z.object({ observed: list, assessed: list, confidence, not_established: list }).nullable().optional(),
    ai_scope: z.object({ performed: list, not_performed: list }).nullable().optional(),
    autonomy: z.object({ level: text, human_roles: list }).nullable().optional(),
    uplift: z.object({ speed: assessment, scale: assessment, depth: assessment }).nullable().optional(),
    safeguards: z.object({
      refusals_observed: flag, refused_tasks: list, circumvention_observed: flag, residual_capability: text,
    }).nullable().optional(),
    outcome: z.object({ confirmed: list, attempted: list, unknown: list }).nullable().optional(),
    reach: z.object({
      observed: text, claimed: text, independently_verified: flag,
      breakout_scale: z.union([z.number().int().min(1).max(6), z.literal('unknown')]).nullable().optional(),
    }).nullable().optional(),
    taiwan_relevance: z.object({ direct: flag, analogous: text, editorial_analysis: text }).nullable().optional(),
    evidence_boundary: z.object({
      known: list, report_assessment: list, reasonable_questions: list, not_established: list,
    }).nullable().optional(),
    terms: z.array(z.string()).default([]), sources: z.array(source).default([]),
  }).superRefine((data, ctx) => {
    if (data.deep_dive && data.status !== 'published') {
      ctx.addIssue({ code: 'custom', message: 'deep_dive=true 僅能用於已發布的完整導讀。' });
    }
  }),
});

const reports = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/reports' }),
  schema: z.object({
    report_id: z.string(), publisher: z.string(), title_zh: z.string(), title_en: z.string(),
    published_at: z.string(), pdf_page_count: z.number().int().positive(),
    main_case_count: z.number().int().nonnegative(), embedded_case_count: z.number().int().nonnegative(),
    source: z.object({ title: z.string(), url: z.url().nullable(), note: text }),
    sections: z.array(z.object({ id: z.string(), title_zh: z.string(), title_en: z.string(), main_case_count: z.number().int() })),
  }),
});

const glossary = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/glossary' }),
  schema: z.object({ slug: z.string(), title_zh: text, title_en: z.string(), status: z.enum(['placeholder', 'published']), sources: z.array(source).default([]) }),
});
const topics = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/topics' }),
  schema: z.object({ slug: z.string(), title: z.string(), status: z.enum(['placeholder', 'published']) }),
});
const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({ title: z.string(), status: z.enum(['placeholder', 'published']) }),
});

const guides = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/guides' }),
  schema: z.object({ slug: z.string(), title: z.string(), summary: z.string(), order: z.number(), cases: z.array(z.string()).min(1), updated_at: z.string() }),
});
export const collections = { reports, cases, glossary, topics, pages, guides };

# Engineering Standards

## Required Checks

Run before opening a PR:

```bash
npm run lint
npm run typecheck
npm run build
cd strapi && npm run build
```

## Pull Request Checklist

- No secrets or tokens are committed.
- New CMS fields have matching TypeScript types or mappers.
- Public API routes return safe error messages.
- Pages define loading, empty, and error behavior where applicable.
- Images use `next/image` or a documented exception.
- Content changes include SEO metadata and image alt text.

## Branches

- Feature branches should be short-lived.
- Keep CMS schema changes separate from large visual redesigns when possible.
- Include migration or content-backfill notes in PR descriptions.

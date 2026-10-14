# recent-posts

Custom "آخرین نوشته‌ها" component — like `@quartz-community/recent-notes` but filtered to the real content folders so folder index pages, tag pages, the 404 page, and stray root files never appear in the list.

## Files
- `components.tsx` — the component source
- `dist/components.js` — built output (committed)
- `package.json` — plugin manifest + esbuild script

## What counts as a "post"

Only slugs starting with one of these folders are listed:

```
notes/  satrcin/  translations/  lists/  offers/
```

Plus filters: `unlisted !== true`, slug is not `404`, not `tags/…`, and not an `index`/folder page.

## Usage in `quartz.config.yaml`

```yaml
- source: ./quartz/plugins/recent-posts
  enabled: true
  options:
    title: "آخرین نوشته‌ها"
    limit: 5
    # optional:
    # showTags: true
    # folders: ["notes/", "satrcin/"]
```

## Rebuild after editing `components.tsx`

```sh
cd quartz/plugins/recent-posts
npm run build
```

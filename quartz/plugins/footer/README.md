# footer

Custom site footer for this blog — renders only the links list, with no Quartz version string or copyright year.

## Files
- `components.tsx` — the component source
- `dist/components.js` — built output (committed)
- `package.json` — plugin manifest + esbuild script

## Usage in `quartz.config.yaml`

```yaml
- source: ./quartz/plugins/footer
  enabled: true
  options:
    links:
      GitHub: https://github.com/mmehdishafiee/mmehdi_blog
      # add more links here
```

`options.links` is a `{ label: url }` map rendered as a row of links.

## Rebuild after editing `components.tsx`

```sh
cd quartz/plugins/footer
npm run build
```

This regenerates `dist/components.js`.

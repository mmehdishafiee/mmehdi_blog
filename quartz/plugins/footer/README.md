# footer

Site footer: a row of social icons plus a link to the about page.

Ported from the reference site (`github.com/eledah/quartz_blog`). The layout is
icon-only, so each configured link needs a matching brand SVG in `ICONS`; a
label with no icon is skipped.

## Files

- `components.tsx` — the component source
- `dist/components.js` — built output (committed)
- `package.json` — plugin manifest + esbuild script

## Usage in `quartz.config.yaml`

```yaml
# No layout block: the manifest declares defaultPosition "footer".
- source: ./quartz/plugins/footer
  enabled: true
  options:
    links:
      Telegram: https://t.me/Mmehdi_ir
      GitHub: https://github.com/mmehdishafiee/mmehdi_blog
    aboutUrl: برگهها/about
```

`options.links` is a `{ label: url }` map. Icons ship for `Telegram` and
`GitHub`; render order is fixed by `ORDER`, not by key order.

`options.aboutUrl` is the about page path relative to the site root, without a
leading slash. It points into a Persian (ZWNJ-bearing) folder, so copy it from
disk rather than retyping it.

## Rebuild after editing `components.tsx`

```sh
cd quartz/plugins/footer
npm run build
```

This regenerates `dist/components.js`.

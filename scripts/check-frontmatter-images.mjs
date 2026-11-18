// Guards the two image fields in post frontmatter. Run with `node scripts/check-frontmatter-images.mjs`
// and before every build (see the `check:images` npm script).
//
//   image:       hero image of the article (featured-image plugin). Local path under content/.
//   socialImage: og:image override. The og-image plugin builds `https://<baseUrl>/static/<value>`,
//                so anything that is not an absolute URL ends up as /static//... and 404s.
//
// Fails on: a missing local file, a non-absolute socialImage, and the same `image` reused by
// two published posts (the copy-pasted-frontmatter bug).
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const contentDir = path.join(root, "content")

const IMAGE_FIELDS = ["image", "socialImage"]

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith(".")) return []
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : full.endsWith(".md") ? [full] : []
  })
}

// Only the handful of scalar keys we care about, so no YAML dependency is needed.
function readFrontmatter(file) {
  const text = fs.readFileSync(file, "utf8")
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  const data = {}
  if (!match) return data
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/)
    if (!kv) continue
    let value = kv[2].trim()
    if (/^".*"$/.test(value) || /^'.*'$/.test(value)) value = value.slice(1, -1)
    data[kv[1]] = value
  }
  return data
}

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(value)

const errors = []
const warnings = []
const heroUsage = new Map()

for (const file of walk(contentDir)) {
  const rel = path.relative(root, file).replace(/\\/g, "/")
  const frontmatter = readFrontmatter(file)
  const published = frontmatter.draft !== "true"
  const inline = fs.readFileSync(file, "utf8").match(/!\[\[([^\]]+)\]\]/g) ?? []

  for (const field of IMAGE_FIELDS) {
    const value = frontmatter[field]
    if (!value) continue

    if (field === "socialImage" || isAbsoluteUrl(value)) {
      if (!isAbsoluteUrl(value)) {
        errors.push(
          `${rel}: socialImage must be an absolute URL (got "${value}"); ` +
            `the og-image plugin prefixes /static/, so a leading "/" produces a 404.`,
        )
      }
      continue
    }

    const target = path.join(contentDir, value.replace(/^\//, ""))
    if (!fs.existsSync(target)) {
      errors.push(`${rel}: ${field} points to a missing file: content/${value.replace(/^\//, "")}`)
    }

    if (field === "image" && published) {
      heroUsage.set(value, [...(heroUsage.get(value) ?? []), rel])
    }

    const basename = path.basename(value, path.extname(value))
    if (field === "image" && published && inline.some((embed) => embed.includes(basename))) {
      warnings.push(`${rel}: "${basename}" is the hero image and is also embedded in the body`)
    }
  }
}

for (const [value, files] of heroUsage) {
  if (files.length > 1) {
    errors.push(
      `image "${value}" is used as the hero of ${files.length} posts ` +
        `(${files.join(", ")}); each post needs its own hero, or an empty image: ""`,
    )
  }
}

for (const message of warnings) console.warn(`warn  ${message}`)
for (const message of errors) console.error(`error ${message}`)
if (errors.length > 0) {
  console.error(`\n${errors.length} frontmatter image problem(s) found.`)
  process.exit(1)
}
console.log(`frontmatter images ok (${heroUsage.size} hero image(s) across published posts)`)

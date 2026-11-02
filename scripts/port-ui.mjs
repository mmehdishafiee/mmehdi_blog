// One-off scaffolding for the ported UI components. Run with `node scripts/port-ui.mjs`.
// Kept in the repo so the plugin manifests/dist can be regenerated.
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const plugins = [
  {
    dir: "featured-cards",
    exportName: "FeaturedCards",
    displayName: "Featured Cards",
    description: "Bento-style featured note cards for the site homepage.",
    position: "beforeBody",
    priority: 7,
  },
  {
    dir: "featured-image",
    exportName: "FeaturedImage",
    displayName: "Featured Image",
    description: "Hero image at the top of an article, from the `image` frontmatter field.",
    position: "beforeBody",
    priority: 15,
  },
  {
    dir: "page-title",
    exportName: "PageTitle",
    displayName: "Page Title",
    description: "Sidebar header with site logo icon and title.",
    position: "left",
    priority: 5,
  },
  {
    dir: "print-button",
    exportName: "PrintButton",
    displayName: "Print Button",
    description: "Print / save-as-PDF button shown next to the breadcrumbs.",
    position: "beforeBody",
    priority: 8,
  },
  {
    dir: "print-source",
    exportName: "PrintSource",
    displayName: "Print Source",
    description: "Canonical page URL printed at the foot of printed pages.",
    position: "afterBody",
    priority: 90,
  },
  {
    dir: "footer",
    exportName: "Footer",
    displayName: "Footer",
    description: "Site footer with social icons and an about link.",
    position: "footer",
    priority: 10,
  },
]

const buildScript =
  "esbuild components.tsx --bundle --format=esm --platform=node --target=es2022 " +
  "--jsx=automatic --jsx-import-source=preact --external:preact --external:preact/* " +
  "--external:@quartz-community/* --outfile=dist/components.js"

for (const plugin of plugins) {
  const dir = path.join(root, "quartz", "plugins", plugin.dir)
  if (!fs.existsSync(path.join(dir, "components.tsx"))) {
    throw new Error(`missing source: quartz/plugins/${plugin.dir}/components.tsx`)
  }

  const manifest = {
    name: plugin.dir,
    version: "1.0.0",
    private: true,
    type: "module",
    scripts: { build: buildScript },
    exports: { ".": "./dist/components.js", "./components": "./dist/components.js" },
    peerDependencies: { preact: "*" },
    devDependencies: { esbuild: "^0.28.2" },
    quartz: {
      name: plugin.dir,
      displayName: plugin.displayName,
      description: plugin.description,
      version: "1.0.0",
      category: "component",
      defaultEnabled: true,
      components: {
        [plugin.exportName]: {
          name: plugin.dir,
          displayName: plugin.displayName,
          description: plugin.description,
          version: "1.0.0",
          defaultPosition: plugin.position,
          defaultPriority: plugin.priority,
        },
      },
    },
  }
  fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8")
  fs.mkdirSync(path.join(dir, "dist"), { recursive: true })

  const bin = path.join(
    root,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "esbuild.cmd" : "esbuild",
  )
  execFileSync(bin, buildScript.split(" ").slice(1), {
    cwd: dir,
    stdio: "inherit",
    shell: process.platform === "win32",
  })
  console.log(`built quartz/plugins/${plugin.dir}`)

  // The loader installs local plugins as links under .quartz/plugins. Windows
  // needs a junction (fs.symlinkSync's default file symlink needs Developer Mode).
  const linkDir = path.join(root, ".quartz", "plugins")
  fs.mkdirSync(linkDir, { recursive: true })
  const link = path.join(linkDir, plugin.dir)
  if (fs.existsSync(link)) fs.rmSync(link, { recursive: true, force: true })
  fs.symlinkSync(dir, link, "junction")
  console.log(`linked .quartz/plugins/${plugin.dir}`)
}

// The about page lives in a Persian (ZWNJ-bearing) folder: read the real name
// from disk so it is never retyped by hand.
const contentDir = path.join(root, "content")
const aboutDir = fs
  .readdirSync(contentDir, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .find((name) => fs.existsSync(path.join(contentDir, name, "about.md")))

if (!aboutDir) {
  throw new Error("could not find the folder holding about.md under content/")
}

const configPath = path.join(root, "quartz.config.yaml")
const config = fs.readFileSync(configPath, "utf8")
if (!config.includes("PLACEHOLDER_ABOUT")) {
  console.warn("config has no PLACEHOLDER_ABOUT left; skipping aboutUrl injection")
} else {
  fs.writeFileSync(configPath, config.replaceAll("PLACEHOLDER_ABOUT", `${aboutDir}/about`), "utf8")
  console.log(`aboutUrl set to "${aboutDir}/about"`)
}

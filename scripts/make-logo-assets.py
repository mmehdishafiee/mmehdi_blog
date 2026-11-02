#!/usr/bin/env python3
"""Regenerate the blog logo assets from a square source logo.

Usage:  python scripts/make-logo-assets.py <source-logo.png>

The source is expected to be a square logo sitting on a flat background field.
The mark is located by looking for pixels clearly brighter than that field, so
every output keeps the mark optically centred no matter how much empty margin
the source has.

Writes:
  quartz/static/icon.png         favicon
  quartz/static/icon-header.png  sidebar header tile
  quartz/static/og-image.png     social preview (1200x630)
  content/attachments/<logo>     the logo shown on the brand page

Requires Pillow (``pip install pillow``).
"""

import os
import re
import sys

from PIL import Image

# How much of the output's shorter side the mark should occupy.
HEADER_FILL = 0.74
FAVICON_FILL = 0.74
OG_FILL = 0.65
BRAND_FILL = 0.72

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC = os.path.join(ROOT, "quartz", "static")


def luminance(pixel):
    r, g, b = pixel[:3]
    return (r * 299 + g * 587 + b * 114) // 1000


def find_mark(src, threshold=55):
    """Bounding box of everything clearly brighter than the flat background."""
    background = luminance(src.getpixel((2, 2)))
    pixels = src.load()
    width, height = src.size
    min_x, min_y, max_x, max_y = width, height, -1, -1
    for y in range(height):
        for x in range(width):
            if luminance(pixels[x, y]) - background > threshold:
                if x < min_x:
                    min_x = x
                if y < min_y:
                    min_y = y
                if x > max_x:
                    max_x = x
                if y > max_y:
                    max_y = y
    if max_x < 0:
        raise SystemExit("could not find the mark: is the background flat?")
    return (min_x, min_y, max_x + 1, max_y + 1)


def render(src, box, size, fill):
    """Scale so the mark fills `fill` of the shorter side, then crop to size.

    A wide tile (the social preview) cannot be filled by cropping a square
    source unless the source is scaled up to cover the tile first, so the fill
    target is a floor, not a hard size: `fill` wins when the source is large
    enough, otherwise the mark ends up a little larger. Either way the result is
    cropped straight out of the scaled source, so there is never a seam between
    a pasted image and a flat backdrop.
    """
    tile_w, tile_h = size
    mark = max(box[2] - box[0], box[3] - box[1])
    scale = max(
        (min(tile_w, tile_h) * fill) / mark,  # hit the fill target
        max(tile_w / src.width, tile_h / src.height),  # or cover the tile
    )

    scaled = src.resize(
        (round(src.width * scale), round(src.height * scale)), Image.LANCZOS
    )
    centre_x = (box[0] + box[2]) / 2 * scale
    centre_y = (box[1] + box[3]) / 2 * scale
    left = round(centre_x - tile_w / 2)
    top = round(centre_y - tile_h / 2)

    return scaled.crop((left, top, left + tile_w, top + tile_h))


def main():
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)

    src = Image.open(sys.argv[1]).convert("RGB")
    if src.width != src.height:
        print(f"warning: source is {src.width}x{src.height}, not square")

    box = find_mark(src)
    print(f"mark bounding box: {box} in {src.width}x{src.height}")

    outputs = [
        (os.path.join(STATIC, "icon.png"), (512, 512), FAVICON_FILL),
        (os.path.join(STATIC, "icon-header.png"), (512, 512), HEADER_FILL),
        (os.path.join(STATIC, "og-image.png"), (1200, 630), OG_FILL),
    ]

    # The brand page shows the logo inside a Persian (ZWNJ-bearing) filename, so
    # take the path from the page that embeds it instead of typing the name here.
    attachments = os.path.join(ROOT, "content", "attachments")
    brand_path = None
    for name in os.listdir(os.path.join(ROOT, "content")):
        page = os.path.join(ROOT, "content", name, "wblog.md")
        if os.path.exists(page):
            with open(page, encoding="utf-8") as handle:
                for line in handle:
                    match = re.search(r"!\[[^\]]*\]\(/attachments/([^)]+)\)", line)
                    if match:
                        brand_path = os.path.join(attachments, match.group(1))
                        break
    if brand_path and os.path.exists(brand_path):
        outputs.append((brand_path, (1200, 1200), BRAND_FILL))
    else:
        print("warning: could not resolve the logo used by the brand page")

    for path, size, fill in outputs:
        render(src, box, size, fill).save(path, "PNG", optimize=True)
        print(
            f"wrote {os.path.relpath(path, ROOT)}  {size[0]}x{size[1]}  ({fill:.2f} fill)"
        )


if __name__ == "__main__":
    main()

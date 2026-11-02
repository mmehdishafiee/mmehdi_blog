// components.tsx
import { jsx } from "preact/jsx-runtime";
var FeaturedImage = () => {
  const Component = ({ fileData }) => {
    if (fileData.slug === "index") {
      return null;
    }
    const image = fileData.frontmatter?.image;
    if (!image) {
      return null;
    }
    return /* @__PURE__ */ jsx("div", { class: "featured-image-container", children: /* @__PURE__ */ jsx("img", { src: image, alt: fileData.frontmatter?.title ?? "Featured image" }) });
  };
  Component.css = `
.featured-image-container {
  width: 100%;
  aspect-ratio: 16 / 9;
  margin-bottom: 2rem;
  overflow: hidden;
  border-radius: 12px;
}

.featured-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}
`;
  return Component;
};
export {
  FeaturedImage
};

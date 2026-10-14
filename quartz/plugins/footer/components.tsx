import type { QuartzComponentConstructor, QuartzComponentProps } from "../../components/types"
import { classNames } from "../../util/lang"

interface Options {
  links: Record<string, string>
}

export const Footer: QuartzComponentConstructor<Partial<Options> | undefined> = (opts) => {
  const Component = ({ displayClass }: QuartzComponentProps) => {
    const links = opts?.links ?? {}
    return (
      <footer class={classNames(displayClass)}>
        <ul>
          {Object.entries(links).map(([text, link]) => (
            <li>
              <a href={link}>{text}</a>
            </li>
          ))}
        </ul>
      </footer>
    )
  }

  Component.css = `
  footer {
    text-align: left;
    margin-bottom: 4rem;
    opacity: 0.7;
  }
  footer ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }
  `

  return Component
}

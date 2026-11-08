import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "../../components/types"

interface Options {
  /**
   * Social links rendered as icons. Keys select the built-in brand icon
   * (`Telegram`, `GitHub`); unknown keys are skipped.
   */
  links?: Record<string, string>
}

const ICONS: Record<string, string> = {
  telegram:
    "M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM12.43 8.85893C11.2629 9.3444 8.93015 10.3492 5.43191 11.8733C4.86385 12.0992 4.56628 12.3202 4.53919 12.5363C4.4934 12.9015 4.95073 13.0453 5.57349 13.2411C5.6582 13.2678 5.74598 13.2954 5.83596 13.3246C6.44866 13.5238 7.27284 13.7568 7.70131 13.766C8.08996 13.7744 8.52375 13.6142 9.00266 13.2853C12.2712 11.079 13.9584 9.96381 14.0643 9.93977C14.1391 9.92281 14.2426 9.90148 14.3128 9.96385C14.3829 10.0262 14.3761 10.1443 14.3686 10.176C14.3233 10.3691 12.5281 12.0381 11.5991 12.9018C11.3095 13.171 11.1041 13.362 11.0621 13.4056C10.968 13.5034 10.8721 13.5958 10.78 13.6846C10.2108 14.2333 9.78393 14.6448 10.8036 15.3168C11.2937 15.6397 11.6858 15.9067 12.077 16.1731C12.5042 16.4641 12.9303 16.7543 13.4816 17.1157C13.6221 17.2078 13.7562 17.3034 13.8869 17.3965C14.3841 17.751 14.8308 18.0694 15.3826 18.0186C15.7033 17.9891 16.0345 17.6876 16.2027 16.7884C16.6002 14.6632 17.3816 10.0585 17.5622 8.16098C17.5781 7.99473 17.5582 7.78197 17.5422 7.68858C17.5262 7.59518 17.4928 7.46211 17.3714 7.3636C17.2276 7.24694 17.0057 7.22234 16.9064 7.22408C16.455 7.23204 15.7626 7.47282 12.43 8.85893Z",
  github:
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
}

const ORDER = ["Telegram", "GitHub"]

/** Site footer: a row of social icons. */
export const Footer: QuartzComponentConstructor<Options | undefined> = (opts) => {
  const Component: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    const links = opts?.links ?? {}
    const entries = ORDER.filter((label) => links[label]).map(
      (label) => [label, links[label]] as const,
    )

    return (
      <footer class={displayClass ?? ""}>
        {entries.length > 0 && (
          <nav class="socials" aria-label="پیوندهای من">
            {entries.map(([label, href]) => (
              <a
                href={href}
                class="social-link"
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  class="social-icon"
                  viewBox="0 0 24 24"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path fill="currentColor" d={ICONS[label.toLowerCase()]} />
                </svg>
              </a>
            ))}
          </nav>
        )}
      </footer>
    )
  }

  Component.css = `
footer {
  text-align: center;
  margin-bottom: 4rem;
  margin-top: 2rem;
}

.socials {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  color: var(--gray);
  background: transparent;
  border: 1px solid transparent;
  text-decoration: none;
  transition:
    color 0.25s ease,
    background-color 0.25s ease,
    border-color 0.25s ease,
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.social-link .social-icon {
  width: 1.25rem;
  height: 1.25rem;
  fill: currentColor;
  transition: transform 0.25s ease;
}

.social-link::after,
.social-link:hover::after,
.social-link:focus::after,
.social-link:focus-visible::after {
  content: none !important;
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}

.social-link:hover {
  color: var(--secondary);
  background-color: color-mix(in srgb, var(--secondary) 10%, transparent);
  border-color: color-mix(in srgb, var(--secondary) 25%, transparent);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px -4px color-mix(in srgb, var(--secondary) 40%, transparent);
}

.social-link:hover .social-icon {
  transform: scale(1.08);
}

.social-link:active {
  transform: translateY(0);
}

.social-link:focus-visible {
  outline: 2px solid var(--secondary);
  outline-offset: 2px;
}
`

  return Component as QuartzComponent
}

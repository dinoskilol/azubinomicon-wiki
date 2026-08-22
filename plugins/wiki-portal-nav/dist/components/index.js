import { h } from "preact"

const style = `
.wiki-portal-nav {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 0 0 1rem;
}

.wiki-portal-nav__brand {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-width: 0;
  color: var(--dark);
  text-decoration: none;
}

.wiki-portal-nav__logo {
  width: 2rem;
  height: 2rem;
  flex: 0 0 2rem;
}

.wiki-portal-nav__logo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.wiki-portal-nav__text {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.05rem;
  line-height: 1.1;
}

.wiki-portal-nav__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0;
}

.wiki-portal-nav__label {
  color: var(--darkgray);
  font-size: 0.78rem;
  font-weight: 500;
}

.wiki-portal-nav__dashboard {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  min-height: 2.15rem;
  border: 1px solid var(--lightgray);
  border-radius: 0.5rem;
  background: var(--light);
  color: var(--dark);
  font-size: 0.875rem;
  font-weight: 650;
  line-height: 1;
  text-decoration: none;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease,
    color 0.15s ease;
}

.wiki-portal-nav__dashboard:hover {
  border-color: var(--secondary);
  background: color-mix(in srgb, var(--secondary) 8%, var(--light));
  color: var(--secondary);
}

.wiki-portal-nav__dashboard-icon {
  font-size: 1rem;
  line-height: 1;
}
`

export function WikiPortalNav() {
  function Component() {
    return h(
      "nav",
      { class: "wiki-portal-nav", "aria-label": "Azubinomicon Wiki" },
      h(
        "a",
        { class: "wiki-portal-nav__brand", href: "/wiki/" },
        h(
          "span",
          { class: "wiki-portal-nav__logo", "aria-hidden": "true" },
          h("img", {
            src: "/wiki/static/icon.svg",
            alt: "",
            loading: "eager",
            decoding: "async",
          }),
        ),
        h(
          "span",
          { class: "wiki-portal-nav__text" },
          h("span", { class: "wiki-portal-nav__name" }, "Azubinomicon"),
          h("span", { class: "wiki-portal-nav__label" }, "Wiki"),
        ),
      ),
      h(
        "a",
        { class: "wiki-portal-nav__dashboard", href: "/dashboard" },
        h("span", { class: "wiki-portal-nav__dashboard-icon", "aria-hidden": "true" }, "←"),
        h("span", null, "Zur\u00fcck zum Dashboard"),
      ),
    )
  }

  Component.css = style
  return Component
}

export default WikiPortalNav

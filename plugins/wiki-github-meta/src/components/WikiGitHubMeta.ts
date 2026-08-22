import { h } from "preact"

type Contributor = {
  name: string
  githubLogin?: string
  profileUrl?: string
  avatarUrl?: string
  commits: number
}

type WikiMeta = {
  repo: string
  sourcePath: string
  editUrl: string
  historyUrl: string
  lastCommit?: {
    sha: string
    date: string
    authorName: string
  }
  contributors: Contributor[]
}

const style = `
.wiki-github-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin: 0.35rem 0 1.25rem;
  color: var(--darkgray);
  font-size: 0.875rem;
}

.wiki-github-meta__label {
  font-weight: 600;
  color: var(--dark);
}

.wiki-github-meta__contributors {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.3rem;
}

.wiki-github-meta__chip,
.wiki-github-meta__link {
  border: 1px solid var(--lightgray);
  border-radius: 999px;
  padding: 0.16rem 0.5rem;
  color: var(--darkgray);
  text-decoration: none;
  line-height: 1.5;
}

.wiki-github-meta__avatar {
  display: inline-grid;
  place-items: center;
  width: 1.75rem;
  height: 1.75rem;
  overflow: hidden;
  border: 1px solid var(--lightgray);
  border-radius: 999px;
  background: var(--light);
  color: var(--darkgray);
  text-decoration: none;
}

.wiki-github-meta__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wiki-github-meta__chip:hover,
.wiki-github-meta__link:hover,
.wiki-github-meta__avatar:hover {
  border-color: var(--secondary);
  color: var(--secondary);
}

.wiki-github-meta__separator {
  color: var(--gray);
}
`

function classNames(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ")
}

function formatDate(value: string | undefined, locale: string) {
  if (!value) {
    return undefined
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return undefined
  }

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

function contributorChip(contributor: Contributor) {
  const label =
    contributor.commits === 1
      ? `${contributor.name} (1 Commit)`
      : `${contributor.name} (${contributor.commits} Commits)`

  if (contributor.profileUrl && contributor.avatarUrl) {
    return h(
      "a",
      {
        class: "wiki-github-meta__avatar",
        href: contributor.profileUrl,
        "aria-label": label,
        title: label,
      },
      h("img", {
        src: contributor.avatarUrl,
        alt: contributor.name,
        loading: "lazy",
        decoding: "async",
      }),
    )
  }

  return h(
    "span",
    {
      class: "wiki-github-meta__chip",
      title: label,
    },
    contributor.name,
  )
}

export default function WikiGitHubMeta() {
  function Component({
    fileData,
    cfg,
    displayClass,
  }: {
    fileData: { wikiGitHubMeta?: WikiMeta }
    cfg: { locale?: string }
    displayClass?: string
  }) {
    const meta = fileData.wikiGitHubMeta
    if (!meta) {
      return null
    }

    const contributors = meta.contributors ?? []
    const visibleContributors = contributors.slice(0, 8)
    const hiddenCount = contributors.length - visibleContributors.length
    const lastEdited = formatDate(meta.lastCommit?.date, cfg.locale || "de-DE")
    const hasContributors = contributors.length > 0
    const needsFirstSeparator = Boolean(lastEdited && hasContributors)
    const needsLinkSeparator = Boolean(lastEdited || hasContributors)

    return h(
      "section",
      { class: classNames(displayClass, "wiki-github-meta") },
      lastEdited &&
        h(
          "span",
          { class: "wiki-github-meta__updated" },
          `Zuletzt bearbeitet am ${lastEdited}`,
          meta.lastCommit?.authorName ? ` von ${meta.lastCommit.authorName}` : "",
        ),
      needsFirstSeparator && h("span", { class: "wiki-github-meta__separator" }, "|"),
      hasContributors &&
        h("span", { class: "wiki-github-meta__label" }, "Mitwirkende"),
      hasContributors &&
        h(
          "span",
          { class: "wiki-github-meta__contributors" },
          ...visibleContributors.map(contributorChip),
          hiddenCount > 0 &&
            h("span", { class: "wiki-github-meta__chip" }, `+${hiddenCount}`),
        ),
      needsLinkSeparator && h("span", { class: "wiki-github-meta__separator" }, "|"),
      h(
        "a",
        { class: "wiki-github-meta__link", href: meta.editUrl },
        "Auf GitHub bearbeiten",
      ),
      h(
        "a",
        { class: "wiki-github-meta__link", href: meta.historyUrl },
        "Verlauf ansehen",
      ),
    )
  }

  Component.css = style
  return Component
}

import { execFileSync } from "node:child_process"
import path from "node:path"

const defaultOptions = {
  repo: process.env.WIKI_PUBLIC_REPO || "dinoskilol/azubinomicon-wiki",
  branch: process.env.WIKI_CONTENT_REF || "main",
}

function toPosixPath(value) {
  return value.split(path.sep).join("/")
}

function runGit(cwd, args) {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim()
}

function getRepositoryRoot(directory) {
  try {
    return runGit(directory, ["rev-parse", "--show-toplevel"])
  } catch {
    return undefined
  }
}

function parseGithubLogin(email) {
  const match = email.match(/^(?:\d+\+)?([^@]+)@users\.noreply\.github\.com$/i)
  return match?.[1]
}

function getFileCommits(repoRoot, sourcePath) {
  try {
    const output = runGit(repoRoot, [
      "log",
      "--follow",
      "--format=%H%x1f%aI%x1f%an%x1f%ae",
      "--",
      sourcePath,
    ])

    if (!output) {
      return []
    }

    return output
      .split("\n")
      .map((line) => {
        const [sha, date, authorName, authorEmail] = line.split("\x1f")
        return { sha, date, authorName, authorEmail }
      })
      .filter((commit) => commit.sha && commit.date && commit.authorName)
  } catch {
    return []
  }
}

function contributorsFromCommits(commits) {
  const contributors = new Map()

  for (const commit of commits) {
    const githubLogin = parseGithubLogin(commit.authorEmail)
    const key = githubLogin ?? commit.authorEmail ?? commit.authorName
    const existing = contributors.get(key)

    if (existing) {
      existing.commits += 1
      continue
    }

    contributors.set(key, {
      name: githubLogin ?? commit.authorName,
      githubLogin,
      profileUrl: githubLogin ? `https://github.com/${githubLogin}` : undefined,
      avatarUrl: githubLogin ? `https://github.com/${githubLogin}.png?size=64` : undefined,
      commits: 1,
    })
  }

  return [...contributors.values()].sort((a, b) => {
    if (b.commits !== a.commits) {
      return b.commits - a.commits
    }
    return a.name.localeCompare(b.name)
  })
}

export default function WikiGitHubMeta(userOptions) {
  const options = { ...defaultOptions, ...userOptions }

  return {
    name: "WikiGitHubMeta",
    markdownPlugins(ctx) {
      const repoRoot = getRepositoryRoot(ctx.argv.directory)

      return [
        () => async (_tree, file) => {
          const data = file.data

          if (!data.relativePath || !data.filePath) {
            return
          }

          const sourcePath = repoRoot
            ? toPosixPath(path.relative(repoRoot, data.filePath))
            : `content/${toPosixPath(data.relativePath)}`
          const commits = repoRoot ? getFileCommits(repoRoot, sourcePath) : []
          const lastCommit = commits[0]
          const encodedPath = sourcePath
            .split("/")
            .map((part) => encodeURIComponent(part))
            .join("/")

          data.wikiGitHubMeta = {
            repo: options.repo,
            sourcePath,
            editUrl: `https://github.com/${options.repo}/edit/${options.branch}/${encodedPath}`,
            historyUrl: `https://github.com/${options.repo}/commits/${options.branch}/${encodedPath}`,
            lastCommit: lastCommit
              ? {
                  sha: lastCommit.sha,
                  date: lastCommit.date,
                  authorName: lastCommit.authorName,
                }
              : undefined,
            contributors: contributorsFromCommits(commits),
          }
        },
      ]
    },
  }
}

export { default as WikiGitHubMeta } from "./components/index.js"

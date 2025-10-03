"use client"

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from 'react'

const themes = [
  "default",
  "dark",
  "radical",
  "merko",
  "gruvbox",
  "tokyonight",
  "onedark",
  "cobalt",
  "synthwave",
  "highcontrast",
  "dracula",
  "prussian",
  "monokai",
  "vue",
  "vue-dark",
  "shades-of-purple",
  "nightowl",
  "buefy",
  "blue-green",
  "algolia",
  "great-gatsby",
  "darcula",
  "bear",
  "solarized-dark",
  "solarized-light",
  "chartreuse-dark",
  "nord",
  "gotham",
  "material-palenight",
  "graywhite",
  "vision-friendly-dark",
  "ayu-mirage",
  "midnight-purple",
  "calm",
  "flag-india",
  "omni",
  "react",
  "jolly",
  "maroongold",
  "yeblu",
  "blueberry",
  "slateorange",
  "kacho_ga",
];

export default function Home() {
  // Persisted selections (localStorage) for a nicer demo experience
  const [username, setUsername] = useState(() => {
    try {
      return localStorage.getItem('leet_username') || 'NinePiece2'
    } catch {
      return 'NinePiece2'
    }
  })

  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('leet_theme') || 'default' } catch { return 'default' }
  })

  const [showGraph, setShowGraph] = useState(() => {
    try { return JSON.parse(localStorage.getItem('leet_showGraph') || 'true') } catch { return true }
  })

  const [showRecent, setShowRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem('leet_showRecent') || 'true') } catch { return true }
  })

  useEffect(() => {
    try {
      localStorage.setItem('leet_username', username)
      localStorage.setItem('leet_theme', theme)
      localStorage.setItem('leet_showGraph', JSON.stringify(showGraph))
      localStorage.setItem('leet_showRecent', JSON.stringify(showRecent))
    } catch {
      // ignore
    }
  }, [username, theme, showGraph, showRecent])

  const getQuery = () => {
    const params: string[] = []
    if (theme && theme !== 'default') params.push(`theme=${encodeURIComponent(theme)}`)
    const shows: string[] = []
    if (showGraph) shows.push('graph')
    if (showRecent) shows.push('recent')
    if (shows.length) params.push(`show=${shows.join(',')}`)
    return params.length ? `?${params.join('&')}` : ''
  }

  const openCard = () => {
    const q = getQuery()
    const url = `/${encodeURIComponent(username)}${q}`
    window.open(url, '_blank')
  }

  const copyMarkdown = async () => {
    const q = getQuery()
    const url = `${window.location.origin}/${encodeURIComponent(username)}${q}`
    const md = `![LeetCode Stats](${url})`
    try {
      await navigator.clipboard.writeText(md)
      // lightweight feedback
      // use a non-blocking UI feedback in the future; alert is fine for the demo
      alert('Markdown snippet copied to clipboard!')
    } catch {
      alert('Unable to copy automatically — select and copy this:\n' + md)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            LeetCode Stats Card
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Generate beautiful, customizable LeetCode statistics cards for your
            GitHub README. Showcase your coding journey with style!
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="#demo"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Try Demo
            </Link>
            <Link
              href="#themes"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Themes
            </Link>
            <a
              href="https://github.com/NinePiece2/github-readme-leetcode"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              ⭐ GitHub
            </a>
          </div>
        </header>

        <section id="demo" className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              📊 Live Demo
            </h2>

            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <label className="sr-only" htmlFor="username">GitHub username</label>
                  <input
                    id="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="px-3 py-2 rounded border w-48"
                    placeholder="username"
                    aria-label="GitHub username"
                  />

                  <label className="sr-only" htmlFor="theme">Theme</label>
                  <select id="theme" value={theme} onChange={e => setTheme(e.target.value)} className="px-3 py-2 rounded border">
                    {themes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={showGraph} onChange={e => setShowGraph(e.target.checked)} />
                    <span className="text-sm">Graph</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={showRecent} onChange={e => setShowRecent(e.target.checked)} />
                    <span className="text-sm">Recent</span>
                  </label>
                </div>

                <div className="ml-auto flex gap-2">
                  <button onClick={openCard} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Open</button>
                  <button onClick={copyMarkdown} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded">Copy Markdown</button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <input className="flex-1 px-3 py-2 rounded border bg-gray-50 dark:bg-gray-700" readOnly value={`${typeof window !== 'undefined' ? window.location.origin : ''}/${encodeURIComponent(username)}${getQuery()}`} />
                <code className="px-3 py-2 bg-gray-900 text-gray-100 rounded break-all">{`![LeetCode Stats](${typeof window !== 'undefined' ? window.location.origin : ''}/${encodeURIComponent(username)}${getQuery()})`}</code>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex justify-center">
                <Image
                  src={`/${encodeURIComponent(username)}${getQuery()}`}
                  alt="LeetCode Stats preview"
                  width={560}
                  height={210}
                  className="max-w-full h-auto"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              🛠️ How to Use
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  Basic Usage
                </h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <code className="break-words">{`![LeetCode Stats](https://cloudflare_URL/username)`}</code>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  With Theme
                </h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <code className="break-words">{`![LeetCode Stats](https://cloudflare_URL/username?theme=dark)`}</code>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  With Additional Data
                </h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <code className="break-words">{`![LeetCode Stats](https://cloudflare_URL/username?theme=radical&show=graph,recent)`}</code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Parameters Section */}
        <section className="mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              ⚙️ Customization Options
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b dark:border-gray-600">
                    <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Parameter
                    </th>
                    <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Description
                    </th>
                    <th className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      Options
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b dark:border-gray-700">
                    <td className="py-3 px-4">
                      <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        theme
                      </code>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      Card theme
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      See theme gallery below
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="py-3 px-4">
                      <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        show
                      </code>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      Additional sections
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      graph, recent (comma-separated)
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="py-3 px-4">
                      <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        hide_rank
                      </code>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      Hide ranking badge
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      true, false
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-700">
                    <td className="py-3 px-4">
                      <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        hide_border
                      </code>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      Hide card border
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      true, false
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">
                      <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        card_width
                      </code>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      Card width in pixels
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      Default: 495
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="themes">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              🎨 Theme Gallery
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {themes.map((t) => (
                <div key={t} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 capitalize">
                    {t.replace("-", " ")}
                  </h3>
                  <div className="w-full rounded border overflow-hidden">
                    <Image
                      src={`/${encodeURIComponent(username)}?theme=${encodeURIComponent(t)}`}
                      alt={`${t} theme`}
                      width={400}
                      height={160}
                      className="w-full h-auto"
                      loading="lazy"
                      unoptimized
                    />
                  </div>
                  <div className="mt-2">
                    <code className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
                      ?theme={t}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="text-center mt-16 py-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            By developers, for developers.
            <a
              href="https://github.com/NinePiece2/github-readme-leetcode"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 ml-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contribute on GitHub
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

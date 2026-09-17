#!/usr/bin/env node
//
// Copyright © 2026 Caspel PM contributors.
//
// Licensed under the Eclipse Public License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License. You may
// obtain a copy of the License at https://www.eclipse.org/legal/epl-2.0
//
// Residual-brand guard for the Caspel PM fork.
//
// Fails when a NEW user-facing upstream identity appears:
//   1. `Huly` inside a localization *value* (keys are internal identifiers).
//   2. An upstream Huly web destination in runtime source.
//   3. First-paint HTML title / manifest that is not Caspel PM.
//   4. Bare product-name string literals such as 'HULY' in runtime TS/Svelte.
//
// Internal identifiers (@hcengineering/*, plugin ids, env names, protocol headers)
// are deliberately NOT checked. Known exceptions live in residual-brand-allowlist.json
// and must also be recorded in docs/caspel-pm/IDENTIFIER_EXCEPTION_REGISTER.md.
//
// Usage: node scripts/caspel-pm/check-residual-brand.js [--json]
// No dependencies; run from the repository root.

const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const root = path.resolve(__dirname, '..', '..')
const allowlist = JSON.parse(fs.readFileSync(path.join(__dirname, 'residual-brand-allowlist.json'), 'utf8'))

function gitFiles (patterns) {
  const out = execFileSync('git', ['ls-files', '-z', '--', ...patterns], { cwd: root, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 })
  return out.split('\0').filter((it) => it.length > 0)
}

function isAllowed (rule, file, detail) {
  return (allowlist[rule] ?? []).some((entry) => {
    const fileOk = entry.file === undefined || new RegExp(entry.file).test(file)
    const detailOk = entry.detail === undefined || new RegExp(entry.detail).test(detail)
    return fileOk && detailOk
  })
}

const findings = []
function report (rule, file, line, detail) {
  if (!isAllowed(rule, file, detail)) findings.push({ rule, file, line, detail })
}

// Rule 1: localization values
for (const file of gitFiles(['*/lang/*.json'])) {
  const lines = fs.readFileSync(path.join(root, file), 'utf8').split(/\r?\n/)
  lines.forEach((text, idx) => {
    const m = /^\s*"([^"]+)":\s*"(.*)"\s*,?\s*$/.exec(text)
    if (m !== null && /huly/i.test(m[2])) report('locale-value', file, idx + 1, m[1])
  })
}

// Rule 2: upstream destinations (Huly domains, upstream GitHub org) in runtime source (tests excluded)
const upstreamUrl =
  /https?:\/\/(?:(?:[a-z0-9-]+\.)*(?:huly\.io|huly\.app|hulylabs\.com|hardcoreeng\.com|anticrm\.org)\b|github\.com\/hcengineering\/)[^\s'"`<)]*/gi
const sourceFiles = gitFiles([
  'dev/prod/src/*', 'dev/prod/public/*', 'dev/branding.json',
  'plugins/*/src/*', 'packages/*/src/*', 'server/*/src/*', 'server-plugins/*/src/*',
  'services/*/src/*', 'pods/*/src/*', 'models/*/src/*'
]).filter((f) => !/(__tests__|__mocks__|\.test\.|\.spec\.|\/tests?\/)/.test(f) && /\.(ts|js|svelte|json|ejs|html)$/.test(f))
for (const file of sourceFiles) {
  const lines = fs.readFileSync(path.join(root, file), 'utf8').split(/\r?\n/)
  lines.forEach((text, idx) => {
    for (const m of text.matchAll(upstreamUrl)) report('upstream-url', file, idx + 1, m[0])
  })
}

// Rule 4: bare product-name string literals ('Huly', "HULY", `Huly`) in runtime TS/Svelte,
// typically display names or fallbacks (calendar names, titles, app names).
const bareLiteral = /(['"`])(?:Huly|HULY|Huly Desktop|Huly Platform)\1/g
for (const file of sourceFiles.filter((f) => /\.(ts|svelte)$/.test(f))) {
  const lines = fs.readFileSync(path.join(root, file), 'utf8').split(/\r?\n/)
  lines.forEach((text, idx) => {
    for (const m of text.matchAll(bareLiteral)) report('bare-literal', file, idx + 1, m[0])
  })
}

// Rule 3: first-paint identity
const ejs = fs.readFileSync(path.join(root, 'dev/prod/src/index.ejs'), 'utf8')
if (!/<title>Caspel PM<\/title>/.test(ejs)) report('first-paint', 'dev/prod/src/index.ejs', 0, 'title is not Caspel PM')
if (/\/huly\//.test(ejs)) report('first-paint', 'dev/prod/src/index.ejs', 0, 'references /huly/ assets')
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'dev/prod/public/caspel-pm/site.webmanifest'), 'utf8'))
if (manifest.name !== 'Caspel PM') report('first-paint', 'dev/prod/public/caspel-pm/site.webmanifest', 0, 'manifest name is not Caspel PM')

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(findings, null, 2))
} else {
  for (const f of findings) console.log(`${f.rule}\t${f.file}:${f.line}\t${f.detail}`)
  console.log(`Caspel PM residual-brand check: ${findings.length} unclassified finding(s)`)
}
process.exit(findings.length > 0 ? 1 : 0)

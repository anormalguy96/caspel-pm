#!/usr/bin/env node
//
// Copyright © 2026 Caspel PM contributors.
//
// Licensed under the Eclipse Public License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License. You may
// obtain a copy of the License at https://www.eclipse.org/legal/epl-2.0
//
// Renders the Caspel PM raster icon set from a square SVG master using the
// repository's installed puppeteer (headless Chrome).
//
// Usage: node scripts/caspel-pm/render-icons.js [master.svg] [outDir]
// Defaults: dev/prod/public/caspel-pm/favicon.svg -> dev/prod/public/caspel-pm

const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..', '..')
const master = path.resolve(process.argv[2] ?? path.join(root, 'dev/prod/public/caspel-pm/favicon.svg'))
const outDir = path.resolve(process.argv[3] ?? path.join(root, 'dev/prod/public/caspel-pm'))

function loadPuppeteer () {
  const candidates = [root, path.join(root, 'tests/sanity'), path.join(root, 'plugins/print-resources'), path.join(root, 'services/print/pod-print')]
  for (const dir of candidates) {
    try {
      return require(require.resolve('puppeteer', { paths: [dir] }))
    } catch {}
  }
  const temp = path.join(root, 'common/temp/node_modules/.pnpm')
  const entry = fs.readdirSync(temp).find((d) => d.startsWith('puppeteer@'))
  if (entry === undefined) throw new Error('puppeteer not found; run rush install first')
  return require(path.join(temp, entry, 'node_modules/puppeteer'))
}

// ICO container holding PNG images (supported by all current browsers and Windows Vista+).
function buildIco (pngs) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(pngs.length, 4)
  const entries = []
  let offset = 6 + 16 * pngs.length
  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16)
    e.writeUInt8(size >= 256 ? 0 : size, 0)
    e.writeUInt8(size >= 256 ? 0 : size, 1)
    e.writeUInt8(0, 2)
    e.writeUInt8(0, 3)
    e.writeUInt16LE(1, 4)
    e.writeUInt16LE(32, 6)
    e.writeUInt32LE(data.length, 8)
    e.writeUInt32LE(offset, 12)
    offset += data.length
    entries.push(e)
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)])
}

async function main () {
  const svg = fs.readFileSync(master, 'utf8')
  const svgUrl = 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64')
  const puppeteer = loadPuppeteer()
  const browser = await puppeteer.launch({ headless: true })
  try {
    const page = await browser.newPage()
    const render = async (size, { scale = 1, background = 'transparent' } = {}) => {
      await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 })
      const inner = Math.round(size * scale)
      await page.setContent(
        `<html><body style="margin:0;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;background:${background}">` +
          `<img src="${svgUrl}" width="${inner}" height="${inner}"></body></html>`
      )
      await page.waitForFunction(() => document.images[0]?.complete === true)
      return await page.screenshot({ type: 'png', omitBackground: background === 'transparent' })
    }
    const write = (name, data) => {
      fs.writeFileSync(path.join(outDir, name), data)
      console.log('wrote', name, data.length, 'bytes')
    }
    write('icon-192.png', await render(192))
    write('icon-512.png', await render(512))
    write('icon-1024.png', await render(1024))
    write('apple-touch-icon.png', await render(180, { background: '#0A2A3D' }))
    write('icon-maskable-512.png', await render(512, { scale: 0.8, background: '#0A2A3D' }))
    const icoSizes = [16, 32, 48]
    const pngs = []
    for (const size of icoSizes) pngs.push({ size, data: Buffer.from(await render(size)) })
    write('favicon.ico', buildIco(pngs))
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

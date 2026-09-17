//
// Copyright © 2026 Caspel PM contributors.
//
// Licensed under the Eclipse Public License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License. You may
// obtain a copy of the License at https://www.eclipse.org/legal/epl-2.0
//

import { docsLink, privacyPolicyLink, reportBugLink, safeExternalLink, supportLink } from '../index'

describe('support links', () => {
  it('has no upstream default destinations', () => {
    expect([supportLink, reportBugLink, docsLink, privacyPolicyLink]).toEqual(['', '', '', ''])
  })

  it('accepts absolute http(s) links', () => {
    expect(safeExternalLink('https://support.example.com/pm')).toBe('https://support.example.com/pm')
    expect(safeExternalLink('  HTTP://docs.example.com ')).toBe('HTTP://docs.example.com')
  })

  it('rejects empty, relative and non-http schemes', () => {
    expect(safeExternalLink(undefined)).toBe('')
    expect(safeExternalLink('')).toBe('')
    expect(safeExternalLink('/help')).toBe('')
    expect(safeExternalLink('javascript:alert(1)')).toBe('')
    expect(safeExternalLink('data:text/html,<b>x</b>')).toBe('')
    expect(safeExternalLink('mailto:support@example.com')).toBe('')
  })
})

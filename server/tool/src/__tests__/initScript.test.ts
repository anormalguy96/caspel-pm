//
// Copyright © 2026 Caspel PM contributors.
//
// Licensed under the Eclipse Public License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License. You may
// obtain a copy of the License at https://www.eclipse.org/legal/epl-2.0
//

import { selectInitScript } from '../initScript'

describe('selectInitScript', () => {
  const scripts = [
    { name: 'onboarding', default: true },
    { name: 'caspel-pm', default: false }
  ]

  it('does not fall back to the default script when no name is configured', () => {
    expect(selectInitScript(scripts, undefined)).toBeUndefined()
    expect(selectInitScript(scripts, '')).toBeUndefined()
    expect(selectInitScript(scripts, '   ')).toBeUndefined()
  })

  it('selects an explicitly named script', () => {
    expect(selectInitScript(scripts, 'caspel-pm')?.name).toBe('caspel-pm')
    expect(selectInitScript(scripts, ' onboarding ')?.name).toBe('onboarding')
  })

  it('returns nothing for an unknown name instead of the default script', () => {
    expect(selectInitScript(scripts, 'missing')).toBeUndefined()
  })
})

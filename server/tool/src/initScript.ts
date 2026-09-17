//
// Copyright © 2026 Caspel PM contributors.
//
// Licensed under the Eclipse Public License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License. You may
// obtain a copy of the License at https://www.eclipse.org/legal/epl-2.0
//

/**
 * Minimal shape needed to choose an init script (see `InitScript` in ./initializer).
 * @public
 */
export interface NamedInitScript {
  name: string
  default: boolean
}

/**
 * Caspel PM: seed content only when a script is explicitly named via branding
 * `initWorkspace` or `INIT_WORKSPACE`. Upstream fell back to the script marked
 * `default: true`, which silently seeded upstream Huly onboarding content into
 * every new workspace whenever an init repository was present in the image.
 *
 * @public
 */
export function selectInitScript<T extends NamedInitScript> (scripts: T[], initWS: string | undefined): T | undefined {
  const name = initWS?.trim() ?? ''
  if (name === '') {
    return undefined
  }
  return scripts.find((it) => it.name === name)
}

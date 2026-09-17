<!--
// Copyright © 2020, 2021 Anticrm Platform Contributors.
//
// Licensed under the Eclipse Public License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License. You may
// obtain a copy of the License at https://www.eclipse.org/legal/epl-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//
// See the License for the specific language governing permissions and
// limitations under the License.
-->
<script lang="ts">
  import { Analytics } from '@hcengineering/analytics'
  import platform, { loadPluginStrings, setMetadata } from '@hcengineering/platform'
  import { onMount, setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { ThemeVariant } from './variants'
  import {
    ThemeOptions,
    getCurrentFontSize,
    getCurrentLanguage,
    getCurrentTheme,
    getCurrentDensity,
    getCurrentMotion,
    isSystemThemeDark,
    isThemeDark,
    themeStore as themeOptions,
    getCurrentEmoji
  } from './'

  const currentTheme = writable<string>(getCurrentTheme())
  const currentFontSize = writable<string>(getCurrentFontSize())
  const currentDensity = writable<string>(getCurrentDensity())
  const currentMotion = writable<string>(getCurrentMotion())
  const currentLanguage = writable<string>(getCurrentLanguage())
  const currentEmoji = writable<string>(getCurrentEmoji())

  const setOptions = (currentFont: string, theme: string, language: string, emoji: string) => {
    themeOptions.set(new ThemeOptions(currentFont === 'compact-font' ? 13 : currentFont === 'comfortable-font' ? 16 : currentFont === 'large-font' ? 18 : 15, isThemeDark(theme), language, emoji))
  }

  const getRealTheme = (theme: string): string => (isThemeDark(theme) ? ThemeVariant.Dark : ThemeVariant.Light)

  const updateDocumentClasses = (theme: string, font: string, density: string, motion: string, emoji: string) => {
    document.documentElement.setAttribute(
      'class',
      `${getRealTheme(theme)} ${font} ${density} ${motion} ${emoji}`
    )
  }

  const setRootColors = (theme: string, set = true) => {
    currentTheme.set(theme)
    if (set) {
      localStorage.setItem('theme', theme)
    }
    updateDocumentClasses(theme, $currentFontSize, $currentDensity, $currentMotion, $currentEmoji)
    setOptions($currentFontSize, theme, $currentLanguage, $currentEmoji)
  }

  const setRootFontSize = (fontsize: string, set = true) => {
    currentFontSize.set(fontsize)
    if (set) {
      localStorage.setItem('fontsize', fontsize)
    }
    updateDocumentClasses($currentTheme, fontsize, $currentDensity, $currentMotion, $currentEmoji)
    setOptions(fontsize, $currentTheme, $currentLanguage, $currentEmoji)
  }

  const setRootDensity = (density: string, set = true) => {
    currentDensity.set(density)
    if (set) {
      localStorage.setItem('density', density)
    }
    updateDocumentClasses($currentTheme, $currentFontSize, density, $currentMotion, $currentEmoji)
  }

  const setRootMotion = (motion: string, set = true) => {
    currentMotion.set(motion)
    if (set) {
      localStorage.setItem('motion', motion)
    }
    updateDocumentClasses($currentTheme, $currentFontSize, $currentDensity, motion, $currentEmoji)
  }

  const setLanguage = async (language: string, set: boolean = true) => {
    currentLanguage.set(language)
    if (set) {
      localStorage.setItem('lang', language)
    }
    Analytics.setTag('language', language)
    setMetadata(platform.metadata.locale, $currentLanguage)
    await loadPluginStrings($currentLanguage, set)
    setOptions($currentFontSize, $currentTheme, language, $currentEmoji)
  }

  const setEmoji = (emoji: string, set = true) => {
    currentEmoji.set(emoji)
    if (set) {
      localStorage.setItem('emoji', emoji)
    }
    updateDocumentClasses($currentTheme, $currentFontSize, $currentDensity, $currentMotion, emoji)
    setOptions($currentFontSize, $currentTheme, $currentLanguage, emoji)
  }

  setContext('theme', {
    currentTheme,
    setTheme: setRootColors
  })
  setContext('fontsize', {
    currentFontSize,
    setFontSize: setRootFontSize
  })
  setContext('density', {
    currentDensity,
    setDensity: setRootDensity
  })
  setContext('motion', {
    currentMotion,
    setMotion: setRootMotion
  })
  setContext('lang', {
    currentLanguage,
    setLanguage
  })
  setContext('emoji', {
    currentEmoji,
    setEmoji
  })

  let remove: any = null

  function checkSystemTheme (): void {
    const theme = $currentTheme
    if (remove !== null || theme !== 'theme-system') {
      remove?.()
      remove = null
    }

    const isDark = isSystemThemeDark()
    const media = matchMedia(`(prefers-color-scheme: ${isDark ? 'light' : 'dark'})`)
    setRootColors(theme)
    media.addEventListener('change', checkSystemTheme)
    remove = () => {
      media.removeEventListener('change', checkSystemTheme)
    }
  }

  $: if ($currentTheme === 'theme-system') {
    checkSystemTheme()
  }

  const setDocumentLanguage = (): void => {
    document.documentElement.lang = $currentLanguage
  }

  onMount(() => {
    setRootColors($currentTheme, false)
    setRootFontSize($currentFontSize, false)
    setRootDensity($currentDensity, false)
    setRootMotion($currentMotion, false)
    void setLanguage($currentLanguage, false)
    void loadPluginStrings($currentLanguage)
    setDocumentLanguage()
  })
</script>

<slot />

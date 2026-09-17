<!--
// Copyright © 2024 Caspel PM Contributors.
//
// Licensed under the Eclipse Public License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License. You may
// obtain a copy of the License at https://www.eclipse.org/legal/epl-2.0
-->
<script lang="ts">
  import { getContext } from 'svelte'
  import type { Writable } from 'svelte/store'
  import {
    Breadcrumb,
    Button,
    Header,
    Label,
    Scroller,
    showPopup,
    MessageBox,
    IconCheckmark
  } from '@hcengineering/ui'
  import setting from '../plugin'
  import {
    getCurrentTheme,
    getCurrentFontSize,
    getCurrentDensity,
    getCurrentMotion
  } from '@hcengineering/theme'

  const themeContext = getContext<{ currentTheme: Writable<string>, setTheme: (theme: string) => void }>('theme')
  const fontContext = getContext<{ currentFontSize: Writable<string>, setFontSize: (size: string) => void }>('fontsize')
  const densityContext = getContext<{ currentDensity: Writable<string>, setDensity: (density: string) => void }>('density')
  const motionContext = getContext<{ currentMotion: Writable<string>, setMotion: (motion: string) => void }>('motion')

  $: currentThemeVal = themeContext?.currentTheme ? $themeContext.currentTheme : getCurrentTheme()
  $: currentFontVal = fontContext?.currentFontSize ? $fontContext.currentFontSize : getCurrentFontSize()
  $: currentDensityVal = densityContext?.currentDensity ? $densityContext.currentDensity : getCurrentDensity()
  $: currentMotionVal = motionContext?.currentMotion ? $motionContext.currentMotion : getCurrentMotion()

  const themes = [
    {
      id: 'theme-system',
      title: 'System',
      description: 'Matches your operating system color scheme automatically'
    },
    {
      id: 'theme-light',
      title: 'Light',
      description: 'Crisp light interface with high legibility for day work'
    },
    {
      id: 'theme-dark',
      title: 'Dark',
      description: 'Deep navy-tinted dark interface for low-light focus'
    }
  ]

  const fontSizes = [
    { id: 'compact-font', label: 'Compact', px: '13px', scale: '81%' },
    { id: 'normal-font', label: 'Default', px: '15px', scale: '87%' },
    { id: 'comfortable-font', label: 'Comfortable', px: '16px', scale: '94%' },
    { id: 'large-font', label: 'Large', px: '18px', scale: '100%' }
  ]

  const densities = [
    {
      id: 'density-comfortable',
      title: 'Comfortable',
      description: 'Standard layout with comfortable breathing room between elements'
    },
    {
      id: 'density-compact',
      title: 'Compact',
      description: 'Reduced vertical padding and spacing for high-density workflows'
    }
  ]

  const motionOptions = [
    {
      id: 'motion-system',
      title: 'System Default',
      description: 'Respect operating system animation preferences'
    },
    {
      id: 'motion-reduced',
      title: 'Reduced Motion',
      description: 'Minimize transitions, drawers, and motion effects'
    },
    {
      id: 'motion-full',
      title: 'Full Motion',
      description: 'Enable smooth animations throughout the workspace'
    }
  ]

  function selectTheme (id: string): void {
    if (themeContext?.setTheme) {
      themeContext.setTheme(id)
    } else {
      localStorage.setItem('theme', id)
    }
  }

  function selectFontSize (id: string): void {
    if (fontContext?.setFontSize) {
      fontContext.setFontSize(id)
    } else {
      localStorage.setItem('fontsize', id)
    }
  }

  function selectDensity (id: string): void {
    if (densityContext?.setDensity) {
      densityContext.setDensity(id)
    } else {
      localStorage.setItem('density', id)
    }
  }

  function selectMotion (id: string): void {
    if (motionContext?.setMotion) {
      motionContext.setMotion(id)
    } else {
      localStorage.setItem('motion', id)
    }
  }

  function resetPreferences (): void {
    showPopup(MessageBox, {
      label: setting.string.ResetAppearance,
      message: setting.string.ResetAppearanceConfirm,
      action: async () => {
        selectTheme('theme-system')
        selectFontSize('normal-font')
        selectDensity('density-comfortable')
        selectMotion('motion-system')
      }
    })
  }

  function handleKey (e: KeyboardEvent, fn: () => void): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      fn()
    }
  }
</script>

<div class="hulyComponent">
  <Header adaptive={'disabled'}>
    <Breadcrumb icon={setting.icon.Setting} label={setting.string.Appearance} size="large" isCurrent />
  </Header>

  <Scroller align="center" padding="var(--spacing-3)" bottomPadding="var(--spacing-4)">
    <div class="appearance-container flex-col flex-gap-6 max-w-3xl">
      <!-- Intro description -->
      <div class="section-intro">
        <Label label={setting.string.AppearanceDescription} />
      </div>

      <!-- Theme Section -->
      <div class="preference-section flex-col flex-gap-3">
        <div class="section-title">
          <Label label={setting.string.Theme} />
        </div>
        <div class="grid-3col">
          {#each themes as item}
            {@const isSelected = currentThemeVal === item.id}
            <div
              class="card-option theme-card"
              class:selected={isSelected}
              role="button"
              tabindex="0"
              aria-pressed={isSelected}
              on:click={() => selectTheme(item.id)}
              on:keydown={(e) => handleKey(e, () => selectTheme(item.id))}
            >
              <div class="theme-swatch {item.id}">
                <div class="swatch-sidebar" />
                <div class="swatch-content">
                  <div class="swatch-line swatch-line-short" />
                  <div class="swatch-line swatch-line-long" />
                </div>
              </div>
              <div class="card-meta">
                <div class="card-title flex flex-between items-center">
                  <span>{item.title}</span>
                  {#if isSelected}
                    <span class="checkmark"><IconCheckmark size="small" /></span>
                  {/if}
                </div>
                <div class="card-desc">{item.description}</div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Font Size Section -->
      <div class="preference-section flex-col flex-gap-3">
        <div class="section-title">
          <Label label={setting.string.FontSize} />
        </div>
        <div class="segmented-grid">
          {#each fontSizes as item}
            {@const isSelected = currentFontVal === item.id}
            <button
              type="button"
              class="segmented-option"
              class:selected={isSelected}
              aria-pressed={isSelected}
              on:click={() => selectFontSize(item.id)}
            >
              <span class="seg-label">{item.label}</span>
              <span class="seg-sub">{item.px}</span>
            </button>
          {/each}
        </div>

        <!-- Live Typography Preview Card -->
        <div class="preview-card mt-2">
          <div class="preview-tag">Live Interface Typography Preview</div>
          <div class="preview-header"># CPM-1024 — Engineering Delivery Roadmap</div>
          <div class="preview-body">
            Caspel PM adapts typography seamlessly across navigation, task details, Kanban boards, and data tables with proportional scaling.
          </div>
          <div class="preview-meta">
            <span class="meta-pill">Priority: High</span>
            <span class="meta-pill">Assigned: Engineering Team</span>
            <span class="meta-pill">Scale: {fontSizes.find(f => f.id === currentFontVal)?.scale ?? '87%'}</span>
          </div>
        </div>
      </div>

      <!-- Density Section -->
      <div class="preference-section flex-col flex-gap-3">
        <div class="section-title">
          <Label label={setting.string.Density} />
        </div>
        <div class="grid-2col">
          {#each densities as item}
            {@const isSelected = currentDensityVal === item.id}
            <div
              class="card-option density-card"
              class:selected={isSelected}
              role="button"
              tabindex="0"
              aria-pressed={isSelected}
              on:click={() => selectDensity(item.id)}
              on:keydown={(e) => handleKey(e, () => selectDensity(item.id))}
            >
              <div class="density-preview {item.id}">
                <div class="density-row" />
                <div class="density-row" />
                <div class="density-row" />
              </div>
              <div class="card-meta">
                <div class="card-title flex flex-between items-center">
                  <span>{item.title}</span>
                  {#if isSelected}
                    <span class="checkmark"><IconCheckmark size="small" /></span>
                  {/if}
                </div>
                <div class="card-desc">{item.description}</div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Reduced Motion Section -->
      <div class="preference-section flex-col flex-gap-3">
        <div class="section-title">
          <Label label={setting.string.Motion} />
        </div>
        <div class="grid-3col">
          {#each motionOptions as item}
            {@const isSelected = currentMotionVal === item.id}
            <div
              class="card-option motion-card"
              class:selected={isSelected}
              role="button"
              tabindex="0"
              aria-pressed={isSelected}
              on:click={() => selectMotion(item.id)}
              on:keydown={(e) => handleKey(e, () => selectMotion(item.id))}
            >
              <div class="card-meta">
                <div class="card-title flex flex-between items-center">
                  <span>{item.title}</span>
                  {#if isSelected}
                    <span class="checkmark"><IconCheckmark size="small" /></span>
                  {/if}
                </div>
                <div class="card-desc">{item.description}</div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Reset Section -->
      <div class="reset-section pt-4 flex flex-between items-center border-top">
        <div class="reset-info">
          <div class="reset-title">Reset to Default</div>
          <div class="reset-desc">Restore theme, font size, density, and animation settings to default state.</div>
        </div>
        <Button
          label={setting.string.ResetAppearance}
          kind="regular"
          on:click={resetPreferences}
        />
      </div>
    </div>
  </Scroller>
</div>

<style lang="scss">
  .appearance-container {
    width: 100%;
    margin: 0 auto;
  }

  .section-intro {
    font-size: 0.875rem;
    color: var(--secondary-text-color);
  }

  .section-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--content-color);
  }

  .grid-3col {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-1_5);

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .grid-2col {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-1_5);

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .card-option {
    display: flex;
    flex-direction: column;
    padding: var(--spacing-1_5);
    background-color: var(--theme-card-bg-color);
    border: 1px solid var(--theme-button-border, rgba(128, 128, 128, 0.2));
    border-radius: 0.5rem;
    cursor: pointer;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    user-select: none;

    &:hover {
      border-color: var(--cpm-ui-accent, #236B8E);
    }

    &:focus-visible {
      outline: 2px solid var(--cpm-ui-accent, #236B8E);
      outline-offset: 2px;
    }

    &.selected {
      border-color: var(--cpm-ui-accent, #236B8E);
      background-color: var(--cpm-ui-accent-subtle, rgba(35, 107, 142, 0.08));
      box-shadow: 0 0 0 1px var(--cpm-ui-accent, #236B8E);
    }
  }

  .card-meta {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex-grow: 1;
  }

  .card-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--content-color);
  }

  .card-desc {
    font-size: 0.75rem;
    color: var(--secondary-text-color);
    line-height: 1.35;
  }

  .checkmark {
    color: var(--cpm-ui-accent, #236B8E);
    display: flex;
    align-items: center;
  }

  .theme-swatch {
    height: 60px;
    border-radius: 0.375rem;
    display: flex;
    margin-bottom: var(--spacing-1);
    overflow: hidden;
    border: 1px solid rgba(128, 128, 128, 0.2);

    .swatch-sidebar {
      width: 25%;
      height: 100%;
    }

    .swatch-content {
      width: 75%;
      height: 100%;
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .swatch-line {
      height: 6px;
      border-radius: 3px;
    }

    .swatch-line-short { width: 45%; }
    .swatch-line-long { width: 85%; }

    &.theme-light {
      background: #FFFFFF;
      .swatch-sidebar { background: #F1F3F5; }
      .swatch-line { background: #CFD8DC; }
    }

    &.theme-dark {
      background: #0B1D28;
      .swatch-sidebar { background: #07151E; }
      .swatch-line { background: #1C3342; }
    }

    &.theme-system {
      background: linear-gradient(135deg, #FFFFFF 50%, #0B1D28 50%);
      .swatch-sidebar { background: linear-gradient(135deg, #F1F3F5 50%, #07151E 50%); }
      .swatch-line { background: rgba(128, 128, 128, 0.4); }
    }
  }

  .segmented-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-1);

    @media (max-width: 600px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .segmented-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    padding: var(--spacing-1_5) var(--spacing-1);
    background-color: var(--theme-card-bg-color);
    border: 1px solid var(--theme-button-border, rgba(128, 128, 128, 0.2));
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      border-color: var(--cpm-ui-accent, #236B8E);
    }

    &.selected {
      border-color: var(--cpm-ui-accent, #236B8E);
      background-color: var(--cpm-ui-accent-subtle, rgba(35, 107, 142, 0.08));
      box-shadow: 0 0 0 1px var(--cpm-ui-accent, #236B8E);
    }

    .seg-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--content-color);
    }

    .seg-sub {
      font-size: 0.75rem;
      color: var(--secondary-text-color);
    }
  }

  .preview-card {
    padding: var(--spacing-2);
    border-radius: 0.5rem;
    background-color: var(--theme-card-bg-color);
    border: 1px solid var(--theme-button-border, rgba(128, 128, 128, 0.2));
    display: flex;
    flex-direction: column;
    gap: var(--spacing-1);

    .preview-tag {
      font-size: 0.6875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--cpm-ui-accent, #236B8E);
      font-weight: 600;
    }

    .preview-header {
      font-size: 1.0625rem;
      font-weight: 600;
      color: var(--content-color);
    }

    .preview-body {
      font-size: var(--body-font-size, 0.875rem);
      color: var(--secondary-text-color);
      line-height: 1.45;
    }

    .preview-meta {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-1);
      margin-top: 4px;
    }

    .meta-pill {
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 4px;
      background: rgba(128, 128, 128, 0.1);
      color: var(--content-color);
    }
  }

  .density-preview {
    height: 48px;
    border-radius: 0.375rem;
    background: rgba(128, 128, 128, 0.05);
    border: 1px solid rgba(128, 128, 128, 0.15);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 6px 12px;
    margin-bottom: var(--spacing-1);

    &.density-comfortable {
      gap: 7px;
      .density-row {
        height: 6px;
        border-radius: 3px;
        background: rgba(128, 128, 128, 0.3);
      }
    }

    &.density-compact {
      gap: 3px;
      .density-row {
        height: 5px;
        border-radius: 2px;
        background: rgba(128, 128, 128, 0.3);
      }
    }
  }

  .reset-section {
    border-top: 1px solid var(--theme-button-border, rgba(128, 128, 128, 0.15));

    .reset-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--content-color);
    }

    .reset-desc {
      font-size: 0.75rem;
      color: var(--secondary-text-color);
    }
  }
</style>

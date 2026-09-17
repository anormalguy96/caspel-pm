const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..', '..');

const navyBuf = fs.readFileSync(path.join(root, 'dev/prod/public/caspel-pm/mark-navy.png'));
const whiteBuf = fs.readFileSync(path.join(root, 'dev/prod/public/caspel-pm/mark-white.png'));
const navyBase64 = 'data:image/png;base64,' + navyBuf.toString('base64');
const whiteBase64 = 'data:image/png;base64,' + whiteBuf.toString('base64');

const svelteContent = `<script lang="ts">
  import { themeStore } from '@hcengineering/ui'
</script>

<!-- Authentic Caspel PM mark derived directly from official Caspel logo master (logos/1705927011_caspel.png and logos/footer_logo_*.png) -->
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 64 64" aria-hidden="true">
  {#if $themeStore?.dark === false}
    <image href="${navyBase64}" width="64" height="64" preserveAspectRatio="xMidYMid meet" />
  {:else}
    <image href="${whiteBase64}" width="64" height="64" preserveAspectRatio="xMidYMid meet" />
  {/if}
</svg>
`;

fs.writeFileSync(path.join(root, 'plugins/login-resources/src/components/icons/LoginIcon.svelte'), svelteContent);
fs.writeFileSync(path.join(root, 'plugins/onboard-resources/src/components/icons/OnboardIcon.svelte'), svelteContent);
console.log('Successfully updated LoginIcon.svelte and OnboardIcon.svelte with authentic Caspel mark');

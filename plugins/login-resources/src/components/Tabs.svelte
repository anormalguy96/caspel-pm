<!--
// Copyright © 2024 Hardcore Engineering Inc.
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
  import { getCurrentLocation, Label, navigate } from '@hcengineering/ui'

  import login from '../plugin'

  export let loginState: 'login' | 'signup' | 'none' = 'none'
  export let signUpDisabled = false

  const goTab = (path: string): void => {
    const loc = getCurrentLocation()
    loc.path[1] = path
    loc.path.length = 2
    navigate(loc)
  }
</script>

<div class="caption">
  <h2 class="title"><Label label={login.string.LogIn} /></h2>
</div>

<style>
  .caption {
    margin-bottom: 0.75rem;
  }
  .title {
    margin: 0;
    font-weight: 600;
    font-size: 1.5rem;
    line-height: 2rem;
    color: var(--theme-caption-color);
    letter-spacing: -0.01em;
  }
</style>

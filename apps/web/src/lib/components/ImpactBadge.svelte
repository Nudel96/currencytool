<script lang="ts">
  import type { Impact } from '$lib/shared';
  
  export let impact: Impact;
</script>

<span class="impact-badge {impact === 'High' ? 'impact-high' : 'impact-medium'}">
  {impact}
</span>

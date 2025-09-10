<script lang="ts">
  import type { Impact } from 'shared/types';
  
  export let impact: Impact;
</script>

<span class="impact-badge {impact === 'High' ? 'impact-high' : 'impact-medium'}">
  {impact}
</span>

<script lang="ts">
  import type { EventRow } from '$lib/shared';
  import { calculateSurprise } from '$lib/shared';
  import ImpactBadge from './ImpactBadge.svelte';
  import SentimentPill from './SentimentPill.svelte';
  import SkeletonRow from './SkeletonRow.svelte';
  
  export let events: EventRow[] = [];
  export let loading = false;
  
  function formatDateTime(dateTime: string): string {
    return new Date(dateTime).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  function formatValue(value?: number | null, units?: string | null): string {
    if (value == null) return '—';
    const formatted = value.toString();
    return units ? `${formatted}${units}` : formatted;
  }
  
  function formatSurprise(actual?: number | null, forecast?: number | null, units?: string | null): string {
    const surprise = calculateSurprise(actual, forecast);
    if (surprise == null) return '—';
    const sign = surprise >= 0 ? '+' : '';
    const formatted = `${sign}${surprise}`;
    return units ? `${formatted}${units}` : formatted;
  }
  
  function getSurpriseColor(actual?: number | null, forecast?: number | null): string {
    const surprise = calculateSurprise(actual, forecast);
    if (surprise == null) return 'text-gray-400';
    return surprise >= 0 ? 'text-green-400' : 'text-red-400';
  }
  
  function getEventName(event: EventRow): string {
    return event.canonical_indicator || event.report_name;
  }

  function getEventCategory(event: EventRow): string {
    const canonical = event.canonical_indicator;
    if (!canonical) return '';

    // Categorize USD events
    if (canonical.includes('Federal Funds') || canonical.includes('FOMC') || canonical.includes('Fed')) {
      return '🏦 Central Bank';
    }
    if (canonical.includes('CPI') || canonical.includes('PCE') || canonical.includes('PPI')) {
      return '📈 Inflation';
    }
    if (canonical.includes('Payrolls') || canonical.includes('Unemployment') || canonical.includes('Claims') || canonical.includes('Employment')) {
      return '👥 Employment';
    }
    if (canonical.includes('GDP')) {
      return '🏭 GDP';
    }
    if (canonical.includes('PMI') || canonical.includes('Manufacturing') || canonical.includes('Fed Index')) {
      return '🏭 Manufacturing';
    }
    if (canonical.includes('Retail') || canonical.includes('Consumer') || canonical.includes('Trade')) {
      return '🛒 Consumer/Trade';
    }
    return '';
  }

  function isHighPriorityEvent(event: EventRow): boolean {
    const canonical = event.canonical_indicator;
    if (!canonical) return false;

    const highPriorityEvents = [
      'Federal Funds Rate Decision',
      'Non-Farm Payrolls (NFP)',
      'CPI YoY',
      'Core CPI YoY',
      'Core PCE YoY',
      'GDP QoQ',
      'GDP Annualized QoQ',
      'Unemployment Rate',
      'ISM Manufacturing PMI',
      'ISM Services PMI'
    ];

    return highPriorityEvents.includes(canonical);
  }
</script>

<div class="pat-card">
  <div class="p-4 border-b border-pat-border">
    <h2 class="text-lg font-semibold text-pat-text">Economic Events</h2>
  </div>
  
  <div class="overflow-x-auto">
    <table class="pat-table">
      <thead>
        <tr>
          <th>Date/Time</th>
          <th>Event</th>
          <th>Surprise</th>
          <th>Actual</th>
          <th>Forecast</th>
          <th>Previous</th>
          <th>Impact</th>
          <th>Sentiment</th>
        </tr>
      </thead>
      <tbody>
        {#if loading}
          {#each Array(5) as _}
            <SkeletonRow />
          {/each}
        {:else if events.length === 0}
          <tr>
            <td colspan="8" class="text-center text-gray-400 py-8">
              No economic events found
            </td>
          </tr>
        {:else}
          {#each events as event}
            <tr>
              <td class="font-mono text-sm">
                {formatDateTime(event.event_datetime)}
              </td>
              <td class="font-medium">
                <div class="flex items-center gap-2">
                  {#if isHighPriorityEvent(event)}
                    <span class="text-yellow-400 text-xs">⭐</span>
                  {/if}
                  <span class="{isHighPriorityEvent(event) ? 'font-semibold' : ''}">{getEventName(event)}</span>
                </div>
                <div class="flex items-center gap-2 mt-1">
                  {#if getEventCategory(event)}
                    <span class="text-xs text-blue-400">{getEventCategory(event)}</span>
                  {/if}
                  {#if event.country}
                    <span class="text-xs text-gray-400">{event.country}</span>
                  {/if}
                </div>
              </td>
              <td class="font-mono {getSurpriseColor(event.actual, event.forecast)}">
                {formatSurprise(event.actual, event.forecast, event.units)}
              </td>
              <td class="font-mono">
                {formatValue(event.actual, event.units)}
              </td>
              <td class="font-mono">
                {formatValue(event.forecast, event.units)}
              </td>
              <td class="font-mono">
                {formatValue(event.previous, event.units)}
              </td>
              <td>
                <ImpactBadge impact={event.impact} />
              </td>
              <td>
                <SentimentPill sentiment={event.sentiment} />
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</div>

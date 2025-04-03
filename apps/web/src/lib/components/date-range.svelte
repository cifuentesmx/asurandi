<script lang="ts">
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import type { DateRange } from 'bits-ui';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';

	const df = new DateFormatter('es-MX', {
		dateStyle: 'medium'
	});

	let {
		dateRange = $bindable(),
		value = dateRange && dateRange.start && dateRange.end
			? {
					start: new CalendarDate(dateRange.start.year, dateRange.start.month, dateRange.start.day),
					end: new CalendarDate(dateRange.end.year, dateRange.end.month, dateRange.end.day)
				}
			: undefined
	}: {
		dateRange?: DateRange;
		value?: DateRange;
	} = $props();

	let startValue: DateValue | undefined = $state(undefined);
	let endValue: DateValue | undefined = $state(undefined);

	$effect(() => {
		dateRange = value;
		startValue = value?.start ?? undefined;
		endValue = value?.end ?? undefined;
	});
</script>

<div class="grid gap-2">
	<Popover.Root>
		<Popover.Trigger
			class={cn(
				buttonVariants({ variant: 'outline' }),
				!value && 'text-muted-foreground',
				'text-left'
			)}
		>
			<CalendarIcon class="mr-2 size-4" />
			{#if startValue && endValue}
				{df.format(startValue.toDate(getLocalTimeZone()))} - {df.format(
					endValue?.toDate(getLocalTimeZone())
				)}
			{:else if startValue && !endValue}
				{df.format(startValue.toDate(getLocalTimeZone()))}
			{:else if !startValue}
				Selecciona un rango de fechas
			{/if}
		</Popover.Trigger>
		<Popover.Content class="w-auto p-0" align="start">
			<RangeCalendar
				bind:value
				onStartValueChange={(v) => {
					startValue = v;
				}}
				onEndValueChange={(v) => {
					endValue = v;
				}}
				numberOfMonths={2}
			/>
		</Popover.Content>
	</Popover.Root>
</div>

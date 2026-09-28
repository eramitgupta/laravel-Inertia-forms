<script lang="ts">
    import { tick } from 'svelte';
    import {
        classes,
        cleanOtp,
        fillOtp,
        otpSeparatorAfter,
        removeOtp,
        typedOtp,
        type OtpInputSchema,
    } from '../core';
    import type { FieldComponentProps } from '../types';

    /**
     * A one-time code, one box per character. Typing moves to the next box,
     * Backspace goes back, paste and browser autofill fill several boxes at once.
     */
    let {
        field,
        id,
        value = $bindable(),
        error,
        disabled,
        describedBy,
        onChange,
    }: FieldComponentProps<OtpInputSchema> = $props();

    const length = $derived(field.length);
    const code = $derived(cleanOtp(value, field.alphanumeric).slice(0, length));
    const locked = $derived(disabled || field.readonly);
    const noun = $derived(field.alphanumeric ? 'Character' : 'Digit');
    let boxes: HTMLInputElement[] = $state([]);

    function focusBox(index: number) {
        const box = boxes[Math.min(Math.max(index, 0), length - 1)];
        box?.focus();
        box?.select();
    }

    function update(next: string) {
        if (next === code) return;
        const submit = field.autoSubmit && code.length < length && next.length === length;
        value = next;
        onChange?.(next);
        if (submit) tick().then(() => boxes[0]?.form?.requestSubmit?.());
    }

    function fill(index: number, text: string) {
        const next = fillOtp(code, index, text, length);
        update(next.code);
        focusBox(next.focus);
    }

    function input(index: number, event: Event & { currentTarget: HTMLInputElement }) {
        const raw = event.currentTarget.value;
        const previous = code[index] ?? '';
        event.currentTarget.value = previous;
        if (locked) return;
        const typed = typedOtp(raw, previous, field.alphanumeric);
        if (typed) fill(index, typed);
        else if (raw === '') update(removeOtp(code, index));
    }

    function keydown(index: number, event: KeyboardEvent) {
        if (locked) return;
        if (event.key === 'Backspace') {
            event.preventDefault();
            const position = code[index] ? index : index - 1;
            if (position < 0) return;
            update(removeOtp(code, position));
            focusBox(position);
        } else if (event.key === 'Delete') {
            event.preventDefault();
            update(removeOtp(code, index));
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            focusBox(index - 1);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            focusBox(Math.min(index + 1, code.length));
        } else if (event.key === 'Home') {
            event.preventDefault();
            focusBox(0);
        } else if (event.key === 'End') {
            event.preventDefault();
            focusBox(code.length);
        }
    }

    function paste(index: number, event: ClipboardEvent) {
        event.preventDefault();
        if (locked) return;
        const pasted = cleanOtp(event.clipboardData?.getData('text') ?? '', field.alphanumeric);
        if (pasted) fill(index, pasted);
    }
</script>

<div role="group" aria-label={field.label} aria-describedby={describedBy} class={classes.otp}>
    {#each Array.from({ length }, (_, index) => index) as index (index)}
        <!-- svelte-ignore a11y_autofocus -->
        <input
            bind:this={boxes[index]}
            id={index === 0 ? id : `${id}-${index}`}
            type={field.masked ? 'password' : 'text'}
            inputmode={field.alphanumeric ? 'text' : 'numeric'}
            autocomplete={index === 0 ? 'one-time-code' : 'off'}
            autocapitalize={field.alphanumeric ? 'characters' : 'off'}
            spellcheck={false}
            value={code[index] ?? ''}
            required={field.required && index === 0}
            {disabled}
            readonly={field.readonly}
            autofocus={field.autofocus && index === 0}
            aria-label={`${noun} ${index + 1} of ${length}`}
            aria-invalid={error ? true : undefined}
            class={classes.otpBox}
            onfocus={() => index > code.length && focusBox(code.length)}
            oninput={(event) => input(index, event)}
            onkeydown={(event) => keydown(index, event)}
            onpaste={(event) => paste(index, event)}
        />
        {#if otpSeparatorAfter(index, length, field.groupSize)}
            <span aria-hidden="true" class={classes.otpSeparator}></span>
        {/if}
    {/each}
</div>

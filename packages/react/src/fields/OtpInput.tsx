import { Fragment, useEffect, useRef, type ClipboardEvent, type KeyboardEvent } from 'react';
import {
    classes,
    cleanOtp,
    fillOtp,
    otpSeparatorAfter,
    removeOtp,
    typedOtp,
    type OtpInputSchema,
} from '../../../core/src';
import type { FieldComponentProps } from '../types';

/**
 * A one-time code, one box per character. Typing moves to the next box,
 * Backspace goes back, paste and browser autofill fill several boxes at once.
 */
export function OtpInput({
    field,
    id,
    value,
    error,
    disabled,
    describedBy,
    onChange,
}: FieldComponentProps<OtpInputSchema>) {
    const length = field.length;
    const code = cleanOtp(value, field.alphanumeric).slice(0, length);
    const locked = disabled || field.readonly;
    const boxes = useRef<Array<HTMLInputElement | null>>([]);
    const submitWhenComplete = useRef(false);
    // The code as last typed, so focus handlers see it before the parent re-renders.
    const latest = useRef(code);
    latest.current = code;
    const noun = field.alphanumeric ? 'Character' : 'Digit';

    useEffect(() => {
        if (!submitWhenComplete.current || code.length < length) return;
        submitWhenComplete.current = false;
        boxes.current[0]?.form?.requestSubmit?.();
    }, [code, length]);

    function focusBox(index: number) {
        const box = boxes.current[Math.min(Math.max(index, 0), length - 1)];
        box?.focus();
        box?.select();
    }

    function update(next: string) {
        if (next === code) return;
        submitWhenComplete.current =
            field.autoSubmit && code.length < length && next.length === length;
        latest.current = next;
        onChange(next);
    }

    function fill(index: number, text: string) {
        const next = fillOtp(code, index, text, length);
        update(next.code);
        focusBox(next.focus);
    }

    function input(index: number, raw: string) {
        const typed = typedOtp(raw, code[index] ?? '', field.alphanumeric);
        if (typed) fill(index, typed);
        else if (raw === '') update(removeOtp(code, index));
    }

    function keydown(index: number, event: KeyboardEvent<HTMLInputElement>) {
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

    function paste(index: number, event: ClipboardEvent<HTMLInputElement>) {
        event.preventDefault();
        const pasted = cleanOtp(event.clipboardData.getData('text'), field.alphanumeric);
        if (pasted) fill(index, pasted);
    }

    return (
        <div
            role="group"
            aria-label={field.label}
            aria-describedby={describedBy}
            className={classes.otp}
        >
            {Array.from({ length }, (_, index) => (
                <Fragment key={index}>
                    <input
                        ref={(element) => {
                            boxes.current[index] = element;
                        }}
                        id={index === 0 ? id : `${id}-${index}`}
                        type={field.masked ? 'password' : 'text'}
                        inputMode={field.alphanumeric ? 'text' : 'numeric'}
                        autoComplete={index === 0 ? 'one-time-code' : 'off'}
                        autoCapitalize={field.alphanumeric ? 'characters' : 'off'}
                        spellCheck={false}
                        value={code[index] ?? ''}
                        required={field.required && index === 0}
                        disabled={disabled}
                        readOnly={field.readonly}
                        autoFocus={field.autofocus && index === 0}
                        aria-label={`${noun} ${index + 1} of ${length}`}
                        aria-invalid={error ? true : undefined}
                        className={classes.otpBox}
                        onFocus={() =>
                            index > latest.current.length
                                ? focusBox(latest.current.length)
                                : undefined
                        }
                        onChange={(event) => !locked && input(index, event.target.value)}
                        onKeyDown={(event) => !locked && keydown(index, event)}
                        onPaste={(event) => !locked && paste(index, event)}
                    />
                    {otpSeparatorAfter(index, length, field.groupSize) && (
                        <span aria-hidden="true" className={classes.otpSeparator} />
                    )}
                </Fragment>
            ))}
        </div>
    );
}

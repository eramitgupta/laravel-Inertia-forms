import { describe, expect, it } from 'vitest';
import {
    addComposerAttachments,
    composerAccept,
    composerHasRoom,
    composerValue,
    dragHasFiles,
} from '../src';

describe('composer', () => {
    const file = (name: string) => ({ name });

    it('normalizes the value', () => {
        expect(composerValue('Hi')).toEqual({ message: 'Hi', attachments: [] });
        expect(composerValue(null)).toEqual({ message: '', attachments: [] });
        expect(composerValue({ message: 5, attachments: ['x'] })).toEqual({
            message: '',
            attachments: [],
        });
        const real = new File(['x'], 'a.pdf');
        expect(composerValue({ message: 'Yo', attachments: [real, 'x'] })).toEqual({
            message: 'Yo',
            attachments: [real],
        });
    });

    it('builds the accept attribute', () => {
        expect(composerAccept(['pdf', 'png'])).toBe('.pdf,.png');
        expect(composerAccept([])).toBeUndefined();
    });

    it('adds attachments up to maxFiles with allowed extensions', () => {
        const field = { accept: ['pdf', 'PNG'], maxFiles: 2 };
        expect(
            addComposerAttachments(
                [file('a.pdf')],
                [file('b.exe'), file('c.png'), file('d.pdf')],
                field,
            ),
        ).toEqual([file('a.pdf'), file('c.png')]);
        expect(
            addComposerAttachments([], [file('x'), file('y.txt')], { accept: [], maxFiles: null }),
        ).toEqual([file('x'), file('y.txt')]);
        expect(composerHasRoom(field, 1)).toBe(true);
        expect(composerHasRoom(field, 2)).toBe(false);
        expect(composerHasRoom({ maxFiles: null }, 99)).toBe(true);
    });

    it('detects file drags', () => {
        expect(dragHasFiles({ types: ['text/plain', 'Files'] })).toBe(true);
        expect(dragHasFiles({ types: ['text/plain'] })).toBe(false);
        expect(dragHasFiles(null)).toBe(false);
    });
});

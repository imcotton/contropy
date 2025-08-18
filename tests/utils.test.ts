import c from './common.ts';

import {

    assert_TrimmedNonEmptyString,
    mk_TrimmedNonEmptyString,
    safe_int,
    http_get,
    text,
    json,

} from '#src/utils.ts';





c.describe('http_get', function () {

    const url = 'http://localhost';

    c.it('reject on abort', async function () {

        const agent = 'test';
        const msg = 'fail';
        const signal = AbortSignal.abort(new Error(msg));
        const task = () => http_get(url, agent, signal);

        await c.ast.assertRejects(task, Error, msg);

    });

    c.it('reject on non existed localhost', async function () {

        await c.ast.assertRejects(() => http_get(url), Error);

    });

});





c.describe('response utils', function () {

    const statusText = 'not ok';

    const dummy = () => Promise.resolve(new Response(new ReadableStream({
        async pull () {
            throw new Error();
        },
    }), { status: 400, statusText }));

    c.describe('text', function () {

        c.it('reject on not ok', async function () {
            await c.ast.assertRejects(() => text(dummy()), Error, statusText);
        });

    });

    c.describe('json', function () {

        c.it('reject on not ok', async function () {
            await c.ast.assertRejects(() => json(dummy()), Error, statusText);
        });

    });

});





c.describe('mk_TrimmedNonEmptyString', function () {

    const num = 42;
    const fn = mk_TrimmedNonEmptyString;

    c.it('return undefined on number', function () {
        c.ast.assertStrictEquals(fn(num), undefined);
    });

});





c.describe('assert_TrimmedNonEmptyString', function () {

    const num = 42;
    const fn = assert_TrimmedNonEmptyString;

    c.it('throw with cause of original param', function () {
        const err = c.ast.assertThrows(() => fn(num), Error);
        c.ast.assertStrictEquals(err.cause, num);
    });

    c.it('throw with cause of specified', function () {
        const err = c.ast.assertThrows(() => fn(num, 'wat'), Error);
        c.ast.assertStrictEquals(err.cause, 'wat');
    });

    c.it('throw on trimmed empty string', function () {
        c.ast.assertThrows(() => fn(''));
        c.ast.assertThrows(() => fn(' '));
        c.ast.assertThrows(() => fn('\n'));
    });

    c.it('does not throw on foobar', function () {
        assert_TrimmedNonEmptyString(   'foobar');
        assert_TrimmedNonEmptyString(   'foobar    ');
        assert_TrimmedNonEmptyString('   foobar    ');
    });

});





c.describe('safe_int', function () {

    const port_verify = safe_int({ min: 0, max: 65535 });

    c.it('drops invalid port', function () {

        const sample = [

            '',
            ' ',
            'a',
            NaN,
            -1,
            4.2,
            65536,
            Number.MAX_VALUE,

        ];

        for (const n of sample) {

            const m = port_verify(n);
            c.ast.assert(m == null, `${ n } should NOT valid, but got ${ m }`);

        }

    });

    c.it('passing good port', function () {

        const sample = [

            0,
            1,
            1024,
            65535,

        ];

        for (const n of sample) {
            c.ast.assertStrictEquals(port_verify(n), n);
        }

    });

});


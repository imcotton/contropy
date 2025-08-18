import c from './common.ts';

import { pi } from '#src/pi.js';





c.describe('pi', function () {

    const digits = [
        9,
        100,
        1000,
    ];

    for (const n of digits) {

        const m = n.toString().padStart(7, ' ');

        c.it(`produce first ${ m } digits of Pi`, async function (t) {

            await c.assertSnapshot(t, pi(n));

        });

    }

});


import { pi } from '../pi.js';

import {

    reverse, traverse, sort_by_slice, join, mul, radix,
    hmac, buf_to_bigint, hex_to_bigint,
    btc, drand, jsr, npm, crate,

} from './common.ts';





export async function vol02 (pepper: string, n = 2048): Promise<ArrayBuffer> {

    const grind = hmac('SHA-512', pi(n).toString(16));

    const seed = await grind(reverse(pepper)).then(buf_to_bigint);

    const plant = traverse([

        btc({ tip: 910_342 }),
        drand({ network: 'default',  tip:  5_331_405 }),
        drand({ network: 'quicknet', tip: 20_856_618 }),

    ]);

    const queue = plant(seed).concat([

        crate(       'deno', '2.4.3'),
        npm(       'svelte', '5.6.1'),
        jsr(   '@hono/hono', '4.9.0'),

    ]);

    return Promise.all(queue)
        .then(sort_by_slice(3, 5))
        .then(join)
        .then(reverse)
        .then(hex_to_bigint)
        .then(mul(seed))
        .then(radix(18))
        .then(reverse)
        .then(grind)
    ;

}


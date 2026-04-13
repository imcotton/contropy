import { pi } from '../pi.js';

import {

    reverse, traverse, sort_by_slice, join, mul, radix,
    hmac, buf_to_bigint, hex_to_bigint,
    btc, drand, jsr, npm, crate,

} from './common.ts';





export async function vol04 (pepper: string, n = 8192): Promise<ArrayBuffer> {

    const grind = hmac('SHA-512', pi(n).toString(20));

    const seed = await grind(reverse(pepper)).then(buf_to_bigint);

    const plant = traverse([

        btc({ tip: 944_896 }),
        drand({ network: 'default',  tip:  6_021_817 }),
        drand({ network: 'quicknet', tip: 27_760_736 }),

    ]);

    const queue = plant(seed).concat([

        crate(      'servo', '0.1.0'),
        npm(       'openai', '6.9.1'),
        jsr(     '@zod/zod', '4.3.6'),

    ]);

    return Promise.all(queue)
        .then(sort_by_slice(5, 7))
        .then(join)
        .then(reverse)
        .then(hex_to_bigint)
        .then(mul(seed))
        .then(radix(22))
        .then(reverse)
        .then(grind)
    ;

}


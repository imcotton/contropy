import { pi } from '../pi.js';

import {

    reverse, traverse, sort_by_slice, join, mul, radix,
    hmac, buf_to_bigint, hex_to_bigint,
    btc, drand, jsr, npm, crate,

} from './common.ts';





export async function vol03 (pepper: string, n = 4096): Promise<ArrayBuffer> {

    const grind = hmac('SHA-512', pi(n).toString(18));

    const seed = await grind(reverse(pepper)).then(buf_to_bigint);

    const plant = traverse([

        btc({ tip: 914_094 }),
        drand({ network: 'default',  tip:  5_403_066 }),
        drand({ network: 'quicknet', tip: 21_573_223 }),

    ]);

    const queue = plant(seed).concat([

        crate(      'bytes', '1.7.2'),
        npm(      'esbuild', '0.2.9'),
        jsr(  '@fresh/core', '2.0.0'),

    ]);

    return Promise.all(queue)
        .then(sort_by_slice(4, 6))
        .then(join)
        .then(reverse)
        .then(hex_to_bigint)
        .then(mul(seed))
        .then(radix(20))
        .then(reverse)
        .then(grind)
    ;

}


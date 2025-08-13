import { pi } from '../pi.js';

import {

    reverse, traverse, sort_by_slice, join, truncate_hex, mul, radix,
    sha512, decode_hex, hmac, buf_to_bigint, hex_to_bigint,
    btc, drand, jsr, npm, crate,

} from './common.ts';





export async function vol01 (pepper: string, n = 1024): Promise<ArrayBuffer> {

    const grind = hmac('SHA-512', pi(n).toString(16));

    const seed = await grind(reverse(pepper)).then(buf_to_bigint);

    const plant = traverse([

        btc({ tip: 909_694 }),
        drand({ network: 'default',  tip:  5_319_100 }),
        drand({ network: 'quicknet', tip: 20_733_559 }),

    ]);

    const queue = plant(seed).concat([

        crate(      'tokio', '1.8.4'),
        npm(   'typescript', '5.9.2'),
        jsr('@std/encoding', '1.0.7'),

    ]);

    return Promise.all(queue)
        .then(sort_by_slice(2, 4))
        .then(join)
        .then(hex_to_bigint)
        .then(mul(seed))
        .then(radix(16))
        .then(truncate_hex)
        .then(decode_hex)
        .then(sha512)
    ;

}


import { pi } from '../pi.js';

import {

    grind, traverse, sort_by_slice, join, hex_truncate,
    sha512, decode_hex,
    btc, drand, jsr, npm, crate,

} from './common.ts';





export async function vol01 (pepper: string, n = 1024): Promise<ArrayBuffer> {

    const seed = grind(pepper) * pi(n);

    const plant = traverse([

        btc({ tip: 909_590 }),

        drand({ network: 'default',  tip:  5_316_827 }),
        drand({ network: 'quicknet', tip: 20_710_829 }),

        crate(      'tokio', '1.8.4'),
        npm(   'typescript', '5.9.2'),
        jsr('@std/encoding', '1.0.7'),

    ]);

    const shasum = await Promise.all(plant(seed))
        .then(sort_by_slice(2, 4))
        .then(join())
        .then(hex_truncate)
        .then(decode_hex)
        .then(sha512)
    ;

    return shasum;

}


/* @ts-self-types="./pi.d.ts" */

/**
 * PI computation in Javascript using the BigInt type
 *
 * MIT License (c) 2017-2021 Fabrice Bellard
 */

// from https://bellard.org/quickjs/pi_bigint.js
//      https://github.com/bellard/quickjs/blob/master/examples/pi_bigint.js

// deno-lint-ignore-file
// @ts-nocheck

/* return floor(log2(a)) for a > 0 and 0 for a = 0 */
function floor_log2(a)
{
    var k_max, a1, k, i;
    k_max = 0n;
    while ((a >> (2n ** k_max)) != 0n) {
        k_max++;
    }
    k = 0n;
    a1 = a;
    for(i = k_max - 1n; i >= 0n; i--) {
        a1 = a >> (2n ** i);
        if (a1 != 0n) {
            a = a1;
            k |= (1n << i);
        }
    }
    return k;
}

/* return ceil(log2(a)) for a > 0 */
function ceil_log2(a)
{
    return floor_log2(a - 1n) + 1n;
}

/* return floor(sqrt(a)) (not efficient but simple) */
function int_sqrt(a)
{
    var l, u, s;
    if (a == 0n)
        return a;
    l = ceil_log2(a);
    u = 1n << ((l + 1n) / 2n);
    /* u >= floor(sqrt(a)) */
    for(;;) {
        s = u;
        u = ((a / s) + s) / 2n;
        if (u >= s)
            break;
    }
    return s;
}

/* return pi * 2**prec */
function calc_pi(prec) {
    const CHUD_A = 13591409n;
    const CHUD_B = 545140134n;
    const CHUD_C = 640320n;
    const CHUD_C3 = 10939058860032000n; /* C^3/24 */
    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
    const CHUD_BITS_PER_TERM = 47.11041313821584202247; /* log2(C/12)*3 */

    /* return [P, Q, G] */
    function chud_bs(a, b, need_G) {
        var c, P, Q, G, P1, Q1, G1, P2, Q2, G2;
        if (a == (b - 1n)) {
            G = (2n * b - 1n) * (6n * b - 1n) * (6n * b - 5n);
            P = G * (CHUD_B * b + CHUD_A);
            if (b & 1n)
                P = -P;
            Q = b * b * b * CHUD_C3;
        } else {
            c = (a + b) >> 1n;
            [P1, Q1, G1] = chud_bs(a, c, true);
            [P2, Q2, G2] = chud_bs(c, b, need_G);
            P = P1 * Q2 + P2 * G1;
            Q = Q1 * Q2;
            if (need_G)
                G = G1 * G2;
            else
                G = 0n;
        }
        return [P, Q, G];
    }

    var n, P, Q, G;
    /* number of serie terms */
    n = BigInt(Math.ceil(Number(prec) / CHUD_BITS_PER_TERM)) + 10n;
    [P, Q, G] = chud_bs(0n, n, false);
    Q = (CHUD_C / 12n) * (Q << prec) / (P + Q * CHUD_A);
    G = int_sqrt(CHUD_C << (2n * prec));
    return (Q * G) >> prec;
}

/**
 * @param {number} n_digits
 * @returns {bigint}
 */
export function pi (n_digits) {
    /* we add more bits to reduce the probability of bad rounding for
      the last digits */
    const n_bits = BigInt(Math.ceil(n_digits * Math.log2(10))) + 32n;
    const r = calc_pi(n_bits);
    return ((10n ** BigInt(n_digits)) * r) >> n_bits;
}


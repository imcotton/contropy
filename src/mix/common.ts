import * as mod from '../index.ts';

export * from '../utils.ts';





function _0x (hex: string) {

    return '0x'.concat(hex);

}





export function grind (pepper: string) {

    if (/^[0-9]+$/.test(pepper) !== true) {
        throw new Error('invalid digit', { cause: pepper });
    }

    const mirror = Array.from(pepper).toReversed().join('');

    return BigInt(mirror) ** BigInt(2);

}





export function btc ({ tip }: { tip: number }) {

    return async function btc (seed: bigint) {

        const height = Number(seed % BigInt(tip));

        const { root } = await mod.btc(height);

        return root;

    };

}





export function drand ({ network, tip }: {

        network: Parameters<typeof mod.drand>[0],
        tip: number,

}) {

    return async function (seed: bigint) {

        const height = Number(seed % BigInt(tip));

        const { sign } = await mod.drand(network, height);

        return sign;

    };

}





export function npm (pkg: string, ver: string) {

    return async function (seed: bigint, task = () => mod.npm(pkg, ver)) {

        const { shasum, sha512 } = await task();

        const hex = BigInt(_0x(sha512 ?? shasum));

        const res = seed % hex;

        return res.toString(16);

    };

}





export function jsr (pkg: string, ver: string) {

    return async function (seed: bigint) {

        const integrity = await mod.jsr(pkg, ver);

        const hex = BigInt(_0x(integrity));

        const res = seed % hex;

        return res.toString(16);

    };

}





export function crate (pkg: string, ver: string) {

    return async function (seed: bigint) {

        const { checksum } = await mod.crate(pkg, ver);

        const hex = BigInt(_0x(checksum));

        const res = seed % hex;

        return res.toString(16);

    };

}





export function traverse <A, B> (xs: ReadonlyArray<(a: A) => B>) {

    return (a: A) => xs.map(f => f(a));

}





export function join (x = '') {

    return function (xs: ReadonlyArray<string>) {

        return xs.reduce((a, b) => a.concat(b), x);

    };

}





export function hex_truncate (hex: string) {

    return hex.slice(hex.length % 2);

}





export function sort_by_slice (i: number, j: number) {

    return function (arr: ReadonlyArray<string>) {

        return arr.toSorted(function (a, b) {

            return a.slice(i, j).localeCompare(b.slice(i, j));

        });

    };

}


import * as mod from '../index.ts';

export * from '../utils.ts';





export function mul (a: bigint) {

    return function (b: bigint) {

        return a * b;

    };

}





export function radix (base: number) {

    return function (n: bigint) {

        return n.toString(base);

    };

}





export function reverse (str: string) {

    return join(Array.from(str).toReversed());

}





export function btc ({ tip }: {

        tip: number,

}) {

    return async function (seed: bigint) {

        const height = Number(seed % BigInt(tip));

        const { root } = await mod.btc(height);

        return root;

    };

}





export function drand ({ tip, network }: {

        tip: number,
        network: Parameters<typeof mod.drand>[0],

}) {

    return async function (seed: bigint) {

        const round = Number(seed % BigInt(tip));

        const { sign } = await mod.drand(network, round);

        return sign;

    };

}





export async function npm (

        pkg: string,
        ver: string,
        task = () => mod.npm(pkg, ver),

) {

    const { sha512, shasum } = await task();

    return sha512 ?? shasum;

}





export async function jsr (pkg: string, ver: string) {

    const integrity = await mod.jsr(pkg, ver);

    return integrity;

}





export async function crate (pkg: string, ver: string) {

    const { checksum } = await mod.crate(pkg, ver);

    return checksum;

}





export function traverse <A, B> (xs: ReadonlyArray<(a: A) => B>) {

    return (a: A) => xs.map(f => f(a));

}





export const join = join_by('');

export function join_by (by: string) {

    return function (xs: Iterable<string>) {

        return Array.from(xs).join(by);

    };

}





export function truncate_hex (hex: string) {

    return hex.slice(hex.length % 2);

}





export function sort_by_slice (i: number, j: number) {

    return function (arr: ReadonlyArray<string>) {

        return arr.toSorted(function (a, b) {

            return a.slice(i, j).localeCompare(b.slice(i, j));

        });

    };

}


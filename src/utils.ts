import { encodeHex, decodeHex } from '@std/encoding/hex';
import { decodeBase64 } from '@std/encoding/base64';





export const { crypto: webcrypto } = globalThis;





export const sha256 = shasum('SHA-256');

export const sha512 = shasum('SHA-512');

export function shasum (algo: `SHA-${ '256' | '384' | '512' }`) {

    return function (data: BufferSource) {

        return webcrypto.subtle.digest(algo, data);

    };

}





const txt = new TextEncoder();

export function hmac (

        hash: `SHA-${ '256' | '384' | '512' }`,
        key: string,

) {

    const name = 'HMAC';

    return async function (data: string) {

        const crypto_key = await webcrypto.subtle.importKey(
            'raw',
            txt.encode(key),
            { name, hash },
            false,
            [ 'sign' ],
        );

        return webcrypto.subtle.sign(name, crypto_key, txt.encode(data));

    };

}





export function encode_hex (data: Uint8Array | ArrayBuffer) {

    // @ts-ignore polyfill
    const result = data.toHex?.();

    if (typeof result === 'string') {
        return result;
    }

    return encodeHex(data);

}





export function decode_base64 (data: string): Uint8Array<ArrayBuffer> {

    // @ts-ignore polyfill
    const result = Uint8Array.fromBase64?.(data);

    if (result instanceof Uint8Array) {
        return result as never;
    }

    return decodeBase64(data);

}





export function decode_hex (data: string): Uint8Array<ArrayBuffer> {

    // @ts-ignore polyfill
    const result = Uint8Array.fromHex?.(data);

    if (result instanceof Uint8Array) {
        return result as never;
    }

    return decodeHex(data);

}





export async function json (task: Promise<Response>): Promise<object> {

    const res = await task;

    if (res.ok !== true) {
        await res.body?.cancel();
        throw new Error(res.statusText);
    }

    return res.json() as never;

}





export async function text (task: Promise<Response>): Promise<string> {

    const res = await task;

    if (res.ok !== true) {
        await res.body?.cancel();
        throw new Error(res.statusText);
    }

    return res.text();

}





export async function http_get (

        url: string,
        agent = 'contropy',
        signal = AbortSignal?.timeout(5_000),

) {

    return await fetch(url, {
        signal,
        headers: { 'User-Agent': agent },
    });

}





export function use_signal_abort_controller () {

    const controller = new AbortController();

    return [
        controller.signal,
        controller.abort.bind(controller),
        controller,
    ] as const;

}





export type TrimmedNonEmptyString = string & { readonly brand: unique symbol };

export function is_TrimmedNonEmptyString (

        str: unknown,

): str is TrimmedNonEmptyString {

    return typeof str === 'string' && str.trim() !== '';

}

export function assert_TrimmedNonEmptyString (

        str: unknown,
        cause = str,

): asserts str is TrimmedNonEmptyString {

    if (is_TrimmedNonEmptyString(str) !== true) {
        throw new Error('null or empty string', { cause });
    }

}

export function mk_TrimmedNonEmptyString (

        str: unknown,

): TrimmedNonEmptyString | undefined {

    if (typeof str === 'string') {

        const trimmed = str.trim();

        if (is_TrimmedNonEmptyString(trimmed)) {
            return trimmed;
        }

    }

    return void 0;

}





export function nmap <A, B> (

        f: (a: A) => B,
        a: A | undefined | null,

): B | undefined {

    if (a != null) {
        return f(a);
    }

    return void 0;

}





export function unwrap (line: string) {

    return line.trim().replaceAll(/\W+/g, '');

}





export function safe_int ({

        min = Number.MIN_SAFE_INTEGER,
        max = Number.MAX_SAFE_INTEGER,

}) {

    return function (n: unknown): number | undefined {

        if (   typeof n === 'number'
            && Number.isSafeInteger(n)
            && n >= min
            && n <= max
        ) {
            return n;
        }

        return void 0;

    };

}


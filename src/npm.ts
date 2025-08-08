import {
    json,
    http_get,
    mk_TrimmedNonEmptyString,
    assert_TrimmedNonEmptyString,
    encode_hex as to_hex,
    decode_base64 as from_b64,
} from './utils.ts';





export function gen (pkg: string, ver: string, {

        agent = 'contropy' as string,
        signal = AbortSignal?.timeout(5_000),
        endpoint = 'https://registry.npmjs.org',

} = {}): Promise<Response> {

    const url = `${ endpoint }/${ pkg }/${ ver }`;

    return http_get(url, agent, signal);

}





export type Result = Readonly<{
    name: string,
    version: string,
    shasum: string,
    sha512?: string,
}>;





export function npm (

        pkg: string,
        ver: string,
        endpoint?: string,

): Promise<Result> {

    return npm_task(() => gen(pkg, ver, { endpoint }));

}





export async function npm_task (

        task: () => Promise<Response>,

): Promise<Result> {

    const res = await json(task());

    const {
                 name,         version
    } = res as { name: string, version: string };

    const {
                 dist: { shasum,         integrity          }
    } = res as { dist: { shasum: string, integrity?: string } };

    assert_TrimmedNonEmptyString(name);
    assert_TrimmedNonEmptyString(version);

    assert_TrimmedNonEmptyString(shasum);

    const checksum = mk_TrimmedNonEmptyString(integrity);

    if (checksum != null && checksum.includes('-')) {

        const [ sha, sum ] = checksum.split('-', 2);

        assert_TrimmedNonEmptyString(sha);
        assert_TrimmedNonEmptyString(sum);

        return { name, version, shasum, [sha]: to_hex(from_b64(sum)) };

    }

    return { name, version, shasum };

}


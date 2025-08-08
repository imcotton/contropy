import {
    sha256,
    http_get,
    encode_hex as to_hex,
} from './utils.ts';





export function gen (pkg: string, ver: string, {

        agent = 'contropy' as string,
        signal = AbortSignal?.timeout(5_000),
        endpoint = 'https://jsr.io',

} = {}): Promise<Response> {

    const url = `${ endpoint }/${ pkg }/${ ver }_meta.json`;

    return http_get(url, agent, signal);

}





export type Result = string;





export function jsr (

        pkg: string,
        ver: string,
        endpoint?: string,

): Promise<Result> {

    return jsr_task(() => gen(pkg, ver, { endpoint }));

}





export async function jsr_task (

        task: () => Promise<Response>,

): Promise<Result> {

    const hash = await task()
        .then(res => res.arrayBuffer())
        .then(sha256)
        .then(to_hex)
    ;

    return hash;

}


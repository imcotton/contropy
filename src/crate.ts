import {
    json,
    http_get,
    assert_TrimmedNonEmptyString,
} from './utils.ts';





export function gen (pkg: string, ver: string, {

        agent = 'contropy' as string,
        signal = AbortSignal?.timeout(5_000),

} = {}): Promise<Response> {

    const url = `https://crates.io/api/v1/crates/${ pkg }/${ ver }`;

    return http_get(url, agent, signal);

}





export type Result = Readonly<{
    num: string,
    crate: string,
    checksum: string,
}>;





export function crate (

        pkg: string,
        ver: string,

): Promise<Result> {

    return crate_task(() => gen(pkg, ver));

}





export async function crate_task (

        task: () => Promise<Response>,

): Promise<Result> {

    const res = await json(task()) as {
        version: {
            num: string,
            crate: string,
            checksum: string,
        },
    };

    const { version: { num, crate: crate_, checksum } } = res;

    assert_TrimmedNonEmptyString(num);
    assert_TrimmedNonEmptyString(crate_);
    assert_TrimmedNonEmptyString(checksum);

    return { num, crate: crate_, checksum };

};



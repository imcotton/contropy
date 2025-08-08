import {
    json,
    http_get,
    sha256,
    encode_hex,
    decode_hex,
    assert_TrimmedNonEmptyString,
} from './utils.ts';





const address = {

     default: '8990e7a9aaed2ffed73dbd7092123d6f289930540d7651336225dc172e51b2ce',
    quicknet: '52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971',

};





export function gen (network: 'default' | 'quicknet', round?: number | bigint, {

        agent = 'contropy' as string,
        signal = AbortSignal?.timeout(5_000),
        endpoint = 'https://api.drand.sh',

} = {}): Promise<Response> {

    const hash = address[network];

    assert_TrimmedNonEmptyString(hash, `unknown network: ${ network }`);

    const url = `${ endpoint }/v2/chains/${ hash }/rounds/${ round ?? 'latest' }`;

    return http_get(url, agent, signal);

}





export type Result = Readonly<{
    round: string,
    random: string,
    sign: string,
    prev?: string,
}>;





export function drand (

        network: 'default' | 'quicknet',
        round?: number | bigint,
        endpoint?: string,

): Promise<Result> {

    return drand_task(() => gen(network, round, { endpoint }));

}





export async function drand_task (

        task: () => Promise<Response>,

): Promise<Result> {

    const res = await json(task());

    const {

        round: round_num,
        signature: sign,
        previous_signature: prev,

    } = res as Record<string, unknown>;

    const round = `${ round_num }`;

    assert_TrimmedNonEmptyString(round);
    assert_TrimmedNonEmptyString(sign);

    const random = await sha256(decode_hex(sign)).then(encode_hex);

    if (prev != null) {

        assert_TrimmedNonEmptyString(prev);

        return { round, sign, random, prev };

    }

    return { round, sign, random };

};


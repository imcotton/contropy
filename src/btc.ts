import {
    text,
    json,
    http_get,
    assert_TrimmedNonEmptyString,
} from './utils.ts';





export async function gen (height?: number | string, {

        agent = 'contropy' as string,
        signal = AbortSignal?.timeout(5_000),

} = {}): Promise<Response> {

    const url_hash = height == null
        ? 'https://mempool.space/api/blocks/tip/hash'
        : `https://mempool.space/api/block-height/${ height }`
    ;

    const hash = await text(http_get(url_hash, agent, signal));

    const url_block = `https://mempool.space/api/block/${ hash }`;

    return http_get(url_block, agent, signal);

}





type Keys = 'hash' | 'height' | 'nonce' | 'prev' | 'root';
export type Result = Readonly<Record<Keys, string>>;





export function btc (

        height?: string | number

): Promise<Result> {

    return btc_task(() => gen(height));

}





export async function btc_task (

        task: () => Promise<Response>,

): Promise<Result> {

    const res = await json(task());

    const {
        id: hash,
        nonce: nonce_num,
        height: height_num,
        previousblockhash: prev,
        merkle_root: root,
    } = res as Record<string, unknown>;

    const nonce = `${ nonce_num }`;
    const height = `${ height_num }`;

    assert_TrimmedNonEmptyString(hash);
    assert_TrimmedNonEmptyString(height);
    assert_TrimmedNonEmptyString(nonce);
    assert_TrimmedNonEmptyString(prev);
    assert_TrimmedNonEmptyString(root);

    return { hash, height, nonce, prev, root };

};


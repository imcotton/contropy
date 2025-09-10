import * as mod from '../index.ts';
import * as mix from '../mix/index.ts';

import {
    nmap, safe_int, assert_TrimmedNonEmptyString, encode_hex,
} from '../utils.ts';





type  Commands = typeof commands[number];
const commands = [ 'pi', 'btc', 'crate', 'jsr', 'npm', 'cnpm', 'drand', 'mix' ] as const;
const            [  PI ,  BTC ,  CRATE ,  JSR ,  NPM ,  CNPM ,  DRAND ,  MIX  ] = commands;





export async function main (

        args = [] as Iterable<string>,
        print = (() => { }) as typeof console.log,

): Promise<void> {

    const [ cmd, fst, snd, trd ] = args;

    if (cmd == null || [ '-h', '--help', 'help' ].includes(cmd)) {
        return print(HELP);
    }

    if (is_valid(cmd)) {

        if (cmd === PI) {

            const size = parse_int_or_throw('invalid size', fst || '9');
            const offsite = parse_int_or_throw('invalid offsite', snd || '0');
            const total = size + offsite;

            const res = mod.pi(total);

            return print(res.toString().slice(offsite, total));

        }

        if (cmd === BTC) {
            const res = await mod.btc(fst);
            return print(pick(res, snd) ?? to_json(res));
        }

        assert_TrimmedNonEmptyString(fst);

        if (cmd === DRAND) {

            if (fst === 'default' || fst === 'quicknet') {

                const round = nmap(parse_int_or_throw_c('invalid round'), snd);
                const res = await mod.drand(fst as never, round);

                return print(pick(res, trd) ?? to_json(res));

            }

            throw new Error('unknown drand network', { cause: fst });

        }

        assert_TrimmedNonEmptyString(snd);

        if (cmd === CRATE) {
            const res = await mod.crate(fst, snd);
            return print(pick(res, trd) ?? to_json(res));
        }

        if (cmd === JSR) {

            const res = await mod.jsr(fst, snd);

            return print(res);

        }

        if (cmd === NPM || cmd === CNPM) {

            const res = await (cmd === CNPM
                ? mod.npm(fst, snd, 'https://registry.npmmirror.com')
                : mod.npm(fst, snd)
            );

            return print(pick(res, trd) ?? to_json(res));

        }

        if (cmd === MIX) {

            const album = new Map([
                [ 'vol01', mix.vol01 ],
                [ 'vol02', mix.vol02 ],
                [ 'vol03', mix.vol03 ],
            ]);

            const tape = album.get(fst);

            if (tape != null) {

                const pi = nmap(parse_int_or_throw_c('invalid pi'), trd);
                const res = await tape(snd, pi).then(encode_hex);

                return print(res);

            }

            throw new Error('unknown vol.', { cause: fst });

        }

    }

    throw new Error('unknown cmd', { cause: cmd });

}

export function main_async (args: Iterable<string>): Promise<string> {

    return new Promise(function (resolve, reject) {

        main(args, resolve).then(String, reject);

    });

}





export const HELP: string = `
contropy

       pi [digits] [offsite]

      btc [height]                 { hash, nonce, prev, root }

      jsr <pkg> <ver>

      npm <pkg> <ver>              { shasum, sha512? }
     cnpm <pkg> <ver>              { shasum, sha512? }

    crate <pkg> <ver>              { checksum }

    drand <network> [round]        { random, sign, prev? }
           network: default | quicknet

      mix <tape>
           tape: vol01 <passphrase> [pi=1024]
           tape: vol02 <passphrase> [pi=2048]

`;





const is_valid
= (cmd: unknown): cmd is Commands => commands.includes(cmd as never);





const to_json = (obj: object) => JSON.stringify(obj, null, 2);





const parse_int_or_throw_c: (msg: string) => (str: string) => number
= msg => str => parse_int_or_throw(msg, str);

function parse_int_or_throw (msg: string, str: string) {

    const m = Number.parseInt(str);
    const parse = safe_int({ min: 0 });

    if (parse(m) == null) {
        throw new Error(msg);
    }

    return m;

}





function pick (record: Record<string, unknown>, key?: string) {

    if (key == null) {
        return;
    }

    if (key in record) {
        return record[key];
    }

    const valid = Object.keys(record).join(', ');

    throw new Error(`invalid key: ${ key }, available in: ${ valid }`);

}


import c, { agent } from './common.ts';

import { jsr_task as task, gen } from '../src/jsr.ts';





c.describe('jsr', function () {

    const pkgs = [

        [ '@std/bytes', '1.0.6' ],
        [ '@std/encoding', '1.0.10' ],

        [ '@hono/hono', '4.9.0' ],
        [ '@hono/standard-validator', '0.1.4' ],

        [ '@scure/base', '1.2.6' ],
        [ '@noble/ed25519', '2.2.3' ],

    ] satisfies Array<[ string, string ]>;

    for (const [ pkg, ver ] of pkgs) {

        c.it_on_ci_and(`has pkg ${ pkg }@${ ver }`, async function (t) {

            const [ signal, abort ] = c.use_signal_abort_controller();

            const res = await task(() => gen(pkg, ver, { agent, signal }));

            await c.assertSnapshot(t, res);

            abort();

        });

    }

});


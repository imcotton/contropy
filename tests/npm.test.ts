import c, { agent } from './common.ts';

import { npm_task as task, gen } from '../src/npm.ts';





c.describe('npm', function () {

    const pkgs = [

        [ 'npm', '10.4.0' ],
        [ 'npm', '9.9.2' ],

        [ 'typescript', '5.3.3' ],
        [ 'typescript', '5.2.2' ],

        [ 'rollup', '4.12.0' ],
        [ 'rollup', '3.29.4' ],

        [ '@types/node', '20.11.20' ],
        [ '@types/node', '18.11.9' ],

    ] satisfies Array<[ string, string ]>;

    for (const [ pkg, ver ] of pkgs) {

        c.it_on_ci_and(`has pkg ${ pkg }@${ ver }`, async function (t) {

            const [ signal, abort ] = c.use_signal_abort_controller();

            const res = await task(() => gen(pkg, ver, { agent, signal }));

            await c.assertSnapshot(t, res);

            abort();

        });

    }





    c.it(`returns shasum only`, async function () {

        const name = 'foobar';
        const version = '0.0.0';
        const shasum = '0xff00';

        const json = JSON.stringify({
            name,
            version,
            dist: { shasum },
        });

        const dummy = ReadableStream.from([ json ])
            .pipeThrough(new TextEncoderStream())
        ;

        const res = await task(() => Promise.resolve(new Response(dummy)));

        c.ast.assertEquals(res, { name, version, shasum });

    });

});


import c, { agent } from './common.ts';

import { crate_task as task, gen } from '#src/crate.ts';





c.describe('crate', function () {

    const pkgs = [

        [ 'rand', '0.8.5' ],
        [ 'libc', '0.2.153' ],
        [ 'hyper', '1.2.0' ],
        [ 'tokio', '1.36.0' ],
        [ 'regex-syntax', '0.8.2' ],

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


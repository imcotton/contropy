import c, { agent } from './common.ts';

import { drand_task as task, gen } from '../src/drand.ts';





c.describe('drand', function () {

    const network = [
        'default',
        'quicknet',
    ] as const;

    const round = [
             42,
          1_024,
         65_535,
    ];

    for (const n of network) {

        for (const r of round) {

            c.it_on_ci_and(`has network ${ n } at round ${ r }`, async function (t) {

                const [ signal, abort ] = c.use_signal_abort_controller();

                const res = await task(() => gen(n, r, { agent, signal }));

                await c.assertSnapshot(t, res);

                abort();

            });

        }

    }

});


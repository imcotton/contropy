import c, { agent } from './common.ts';

import { btc_task as task, gen } from '#src/btc.ts';





c.describe('btc', function () {

    const hights = [
             42,
          1_024,
         65_535,
        314_159,
        831_947,
    ];

    for (const n of hights) {

        c.it_on_ci_and(`has height at ${ n }`, async function (t) {

            const [ signal, abort ] = c.use_signal_abort_controller();

            const res = await task(() => gen(n, { agent, signal }));

            await c.assertSnapshot(t, res);

            abort();

        });

    }

});


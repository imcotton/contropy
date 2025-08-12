import c from '../common.ts';

import {

    npm

} from '../../src/mix/common.ts';





c.describe('mix / common.npm', function () {

    c.it('reads shasum when sha512 not existed', async function () {

        const seed = 42n;
        const name = 'foobar';
        const version = '0.0.0';
        const shasum = 'ff112233';

        const task = () => Promise.resolve({ name, version, shasum });

        const gen = npm('foo', 'bar');

        const res = await gen(seed, task);
        const num = seed % BigInt('0x'.concat(shasum));

        c.ast.assertStrictEquals(res, num.toString(16));

    });

});


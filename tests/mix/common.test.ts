import c from '../common.ts';

import {

    npm

} from '../../src/mix/common.ts';





c.describe('mix / common.npm', function () {

    c.it('reads shasum when sha512 not existed', async function () {

        const name = 'foobar';
        const version = '0.0.0';
        const shasum = 'ff112233';

        const task = () => Promise.resolve({ name, version, shasum });

        const res = await npm('foo', 'bar', task);

        c.ast.assertStrictEquals(res, shasum);

    });

});


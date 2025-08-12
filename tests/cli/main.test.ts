import c from '../common.ts';

import {

    HELP,
    main_async,
    main,

} from '../../src/cli/main.ts';





c.describe('cli / main', function () {

    c.describe('helps', function () {

        const args = [
            [          ],
            [  '-h'    ],
            [ '--help' ],
            [   'help' ],
        ];

        for (const x of args) {

            c.it(`print help message for ${ x }`, async function () {

                c.ast.assertStrictEquals(await main_async(x), HELP);

            });

        }

    });





    c.describe('pi', function () {

        const spec = [

            [ '314159265'       ],
            [ '314159265', 9    ],
            [ '314159   ', 6    ],
            [ '   159265', 6, 3 ],

            [ '    1    ', 1, 40_000 ], // Apu was right

        ] satisfies Array<[ string, number?, number? ]>;

        for (const arr of spec) {

            const [ result, size, offsite ] = arr;

            const msg = offsite != null
                ? `in ${ size ?? '[9]' } digits by offsite ${ offsite }`
                : `in ${ size ?? '[9]' } digits`
            ;

            c.it(msg.replace('1 digits', '1 digit '), async function () {

                const args = arr.map(String).with(0, 'pi');

                c.ast.assertStrictEquals(
                    await main_async(args),
                    result.trim(),
                );

            });

        }

        c.it('throw on invalid size', async function () {

            await c.ast.assertRejects(
                () => main_async([ 'pi', 'a' ]),
                Error,
                'invalid size',
            );

        });

        c.it('throw on invalid offsite', async function () {

            await c.ast.assertRejects(
                () => main_async([ 'pi', '1', 'b' ]),
                Error,
                'invalid offsite',
            );

        });

    });





    c.it('throws on unknown cmd', async function () {

        await c.ast.assertRejects(

            () => main([ 'wat' ]),
            Error,
            'unknown cmd',

        );

    });

});





c.it_on_ci_and('cli > jsr', async function (t) {

    await t.step('return integrity in hex', async function () {

        const cmd = 'jsr';
        const pkg = '@key/gen-ssh-ed25519';
        const ver = '0.8.0';
        const hash = c.unwrap(`
            5a987acc4a67454c046c32b98a2accb0
            73c1dd85e2f1e6c0e6fb2b18a5b3eac7
        `);

        const res = await main_async([ cmd, pkg, ver ]) ;

        c.ast.assertStrictEquals(res, hash);

    });

});





c.test_on_ci('cli > npm', async function (t) {

    await t.step('return json or field individually', async function () {

        const cmd = 'npm';
        const pkg = 'rollup';
        const ver = '4.12.0';
        const shasum = '0b6d1e5f3d46bbcf244deec41a7421dc54cc45b5';

        const [ json, value ] = await Promise.all([

            main_async([ cmd, pkg, ver,          ]),

            main_async([ cmd, pkg, ver, 'shasum' ]),

            c.ast.assertRejects(
                () => main_async([ cmd, pkg, ver, 'waaaaaat' ]),
                Error,
                'invalid key: waaaaaat',
            ),

        ]);

        c.ast.assertStrictEquals(value, shasum);

        c.ast.assertObjectMatch(JSON.parse(json), { shasum });

    });

});





c.test_on_ci('cli > crate', async function (t) {

    await t.step('return json or field individually', async function () {

        const cmd = 'crate';
        const pkg = 'hyper';
        const ver = '1.2.0';
        const checksum = c.unwrap(`
            186548d73ac615b32a73aafe38fb4f56
            c0d340e110e5a200bcadbaf2e199263a
        `);

        const [ json, value ] = await Promise.all([

            main_async([ cmd, pkg, ver,          ]),

            main_async([ cmd, pkg, ver, 'checksum' ]),

            c.ast.assertRejects(
                () => main_async([ cmd, pkg, ver, 'waaaaaat' ]),
                Error,
                'invalid key: waaaaaat',
            ),

        ]);

        c.ast.assertStrictEquals(value, checksum);

        c.ast.assertObjectMatch(JSON.parse(json), { checksum });

    });

});





c.test_on_ci('cli > drand', async function (t) {

    await t.step('return json or field individually', async function () {

        const cmd = 'drand';
        const network = 'quicknet';
        const round = '16240013';
        const random = c.unwrap(`
            b43c7985c814f21f939d0b5e73430c5d
            608e4c8dd782a35ae87fa382a4669aa1
        `);

        const [ latest, json, value ] = await Promise.all([

            main_async([ cmd, network                  ]),

            main_async([ cmd, network, round,          ]),

            main_async([ cmd, network, round, 'random' ]),

            c.ast.assertRejects(
                () => main_async([ cmd, 'testnet', round ]),
                Error,
                'unknown drand network',
            ),

        ]);

        c.ast.assertStrictEquals(value, random);

        c.ast.assertObjectMatch(JSON.parse(json), { random });

        c.ast.assertExists(JSON.parse(latest)['round']);

    });

});





c.describe('cli > mix', function () {

    const mix = 'mix';

    c.describe('tape vol.01', function () {

        const tape = 'vol01';

        const spec = [

            [ '01189998819991197253', '65535' ],
            [ 'correct horse battery staple', '7355608' ],

        ] satisfies Array<[ string, string ]>;

        for (const [ pepper, pi ] of spec) {

            c.it_on_ci_and(`${ pepper } - ${ pi }`, async function (t) {

                const res = await main_async([ mix, tape, pepper, pi ]);

                await c.assertSnapshot(t, res);

            });

        }

        c.it('throw on unknown vol.', async function () {

            await c.ast.assertRejects(
                () => main_async([ mix, 'vol.wat', '42' ]),
                Error,
                'unknown vol.',
            );

        });

    });

});


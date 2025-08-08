import { it } from '@std/testing/bdd';
export { describe, it } from '@std/testing/bdd';

export * as ast from '@std/assert';

export { assertSnapshot } from '@std/testing/snapshot';

import * as u from '../src/utils.ts';
export * from '../src/utils.ts';





const CI = u.mk_TrimmedNonEmptyString(Deno.env.get('CI'));

export const it_on_ci_and = (CI && CI !== '0') ? it : it.skip as typeof it;

export const test_on_ci = (CI && CI !== '0') ? Deno.test : Deno.test.ignore;





export const agent = 'contropy-dev-ci';





export * as default from './common.ts';


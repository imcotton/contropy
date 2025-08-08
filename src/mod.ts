export * from './index.ts';





// @ts-ignore not typed yet outside of Deno
if (import.meta.main) {

    await import('./cli/bin.ts');

}


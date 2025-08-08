#!/usr/bin/env node

import { argv } from 'node:process';
import { main } from './main.ts';





await main(argv.slice(2), console.log);


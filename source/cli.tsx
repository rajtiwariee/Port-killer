#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './ui.js';

const cli = meow(
	`
	Usage
	  $ port-killer

	Examples
	  $ port-killer
`,
	{
		importMeta: import.meta,
	},
);

render(<App />);

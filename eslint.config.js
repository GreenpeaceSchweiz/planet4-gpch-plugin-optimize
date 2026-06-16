const wordpress = require( '@wordpress/eslint-plugin' );

module.exports = [
	{
		ignores: [
			'node_modules/**',
			'vendor/**',
			'build/**',
			'eslint.config.js',
			'src/icons/**',
		],
	},

	...wordpress.configs.recommended,
	{
		rules: {
			'max-len': [ 'error', { code: 160 } ],
		},
	},
];


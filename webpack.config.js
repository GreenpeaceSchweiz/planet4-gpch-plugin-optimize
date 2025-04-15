const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const { getWebpackEntryPoints } = require( '@wordpress/scripts/utils' );

const getEntryPoints = () => {
	// Get entry points from the default config
	const wpScriptsEntryPoints = getWebpackEntryPoints( 'script' );
	const entryPoints = wpScriptsEntryPoints();

	const additionalEntryPoints = {
		'editor/document-setting-panel':
			'./src/editor/document-setting-panel/index.js',
		'frontend/split-url-test': './src/frontend/split-url-test.js',
		'css/wp-admin-pages': './src/css/wp-admin-pages.scss',
	};

	return { ...entryPoints, ...additionalEntryPoints };
};

module.exports = {
	...defaultConfig,
	entry: getEntryPoints(),
};

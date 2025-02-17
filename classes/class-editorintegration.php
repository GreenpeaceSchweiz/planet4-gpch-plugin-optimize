<?php
/**
 * Gutenberg Editor Integration: Manages all aspects that need to be configured for the plugin to work correctly with the Gutenberg editor
 *
 * @package Planet4GPCHPluginOptimize
 */

namespace Planet4GpchPluginOptimize;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Singleton class to manage allowed block types.
 */
final class EditorIntegration {
	/**
	 * The single instance of the class.
	 *
	 * @var EditorIntegration
	 */
	private static $instance = null;

	/**
	 * Gets the single instance of the class.
	 *
	 * @return EditorIntegration
	 */
	public static function get_instance(): EditorIntegration {
		if ( self::$instance === null ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Set up the hooks.
	 */
	private function __construct() {
		add_filter( 'allowed_block_types_all', array( $this, 'filter_allowed_block_types' ), 50, 2 );
		add_action( 'init', array( $this, 'register_editor_assets' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_editor_assets' ) );
	}

	/**
	 * Filters the allowed block types and adds the plugin's blocks to the allowlist.
	 *
	 * @param array|string|bool $allowed_block_types Array of block type slugs, or true/false for all/none.
	 */
	public function filter_allowed_block_types( $allowed_block_types ) {
		// Define the block slugs to add to the allowlist.
		$plugin_blocks = array(
			'planet4-gpch-plugin-optimize/content-optimization',
			'planet4-gpch-plugin-optimize/variant',
		);

		// If allowed_block_types is set to an array, merge with our own custom blocks.
		if ( is_array( $allowed_block_types ) ) {
			return array_merge( $allowed_block_types, $plugin_blocks );
		}

		// In all other cases, return as is.
		// Most common case is that $allowed_block_types is true (allow all). In that case, we don't need to add anything.
		return $allowed_block_types;
	}

	/**
	 * Registers scripts for integration with the WordPress editor.
	 *
	 * @return void
	 */
	public function register_editor_assets() {

		wp_register_script(
			'gpch-optimize-plugin-sidebar-js',
			plugins_url( 'build/editor/document-setting-panel.js', PLANET4_GPCH_PLUGIN_OPTIMIZE_NAME ),
			array( 'wp-plugins', 'wp-editor', 'react', 'wp-components', 'wp-data' ),
			filemtime( dirname( __DIR__, 1 ) . '/build/editor/document-setting-panel.js' ),
			true,
		);
	}

	/**
	 * Enqueues the necessary JavaScript and CSS assets for the editor.
	 *
	 * @return void
	 */
	public function enqueue_editor_assets() {
		$plugin_options           = get_option( 'planet4_gpch_plugin_optimize_settings' );
		$enable_split_url_testing = isset( $plugin_options['split_url_testing'] ) ? (bool) $plugin_options['split_url_testing'] : false;

		if ( $enable_split_url_testing ) {
			wp_enqueue_script( 'gpch-optimize-plugin-sidebar-js' );

			wp_enqueue_style(
				'gpch-optimize-plugin-sidebar-css',
				plugins_url( 'build/editor/style-document-setting-panel.css', PLANET4_GPCH_PLUGIN_OPTIMIZE_NAME ),
				array(),
				filemtime( dirname( __DIR__, 1 ) . '/build/editor/style-document-setting-panel.css' ),
			);
		}
	}
}

// Initialize the EditorIntegration singleton.
EditorIntegration::get_instance();

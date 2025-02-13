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
	}

	/**
	 * Filters the allowed block types and adds the plugin's blocks to the allowlist.
	 *
	 * @param array|string|bool       $allowed_block_types Array of block type slugs, or true/false for all/none.
	 * @param WP_Block_Editor_Context $block_editor_context Context for the block editor.
	 * @return array|string|bool Modified allowed block types.
	 */
	public function filter_allowed_block_types( $allowed_block_types, $block_editor_context ) {
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
}

// Initialize the EditorIntegration singleton.
EditorIntegration::get_instance();

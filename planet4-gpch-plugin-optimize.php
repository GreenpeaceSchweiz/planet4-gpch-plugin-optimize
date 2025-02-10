<?php
/**
 * Plugin Name:       Planet4 GPCH Optimize
 * Description:       A/B Testing and Personalization for Planet4 and Mixpanel
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            Stefan Dürrenberger/Greenpeace Switzerland
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       planet4-gpch-plugin-optimize
 *
 * @package GpchOptimize
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

require_once 'classes/class-settingspage.php';

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function planet4_gpch_plugin_optimize_init() {
	$plugin_options = get_option( 'planet4_gpch_plugin_optimize_settings' );
	$enable_blocks  = isset( $plugin_options['enable_blocks'] ) ? (bool) $plugin_options['enable_blocks'] : false;

	if ( $enable_blocks ) {
		register_block_type( __DIR__ . '/build/content-optimization' );
		register_block_type( __DIR__ . '/build/variant' );
	}
}
add_action( 'init', 'planet4_gpch_plugin_optimize_init' );


/**
 * Adds an inline script containing plugin settings data when the content optimization block is in the page.
 *
 * @return void
 */
function planet4_gpch_plugin_optimize_add_inline_script() {
	if ( ! is_singular() ) {
		return; // Only run on single posts or pages.
	}

	global $post;

	if ( ! $post || ! has_block( 'planet4-gpch-plugin-optimize/content-optimization', $post ) ) {
		return; // Exit early if the block is not found in the post content.
	}

	$options = get_option( 'planet4_gpch_plugin_optimize_settings' );

	$localized_data = array(
		'event_type'           => isset( $options['event_type'] ) ? $options['event_type'] : 'experiment_started',
		'datalayer_event_name' => isset( $options['datalayer_event_name'] ) ? $options['datalayer_event_name'] : '',
	);

	$script = 'window.Planet4GpchPluginOptimizeSettings = ' . wp_json_encode( $localized_data, JSON_UNESCAPED_SLASHES ) . ';';

	// Add inline script BEFORE the Gutenberg block view script.
	wp_add_inline_script( 'planet4-gpch-plugin-optimize-content-optimization-view-script', $script, 'before' );
}

add_action( 'wp_enqueue_scripts', 'planet4_gpch_plugin_optimize_add_inline_script' );

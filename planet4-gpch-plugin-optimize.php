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

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function planet4_gpch_plugin_optimize_init () {
	register_block_type( __DIR__ . '/build/content-optimization' );
	register_block_type( __DIR__ . '/build/variant' );
}
add_action( 'init', 'planet4_gpch_plugin_optimize_init' );

<?php
/**
 * Plugin Name:       Planet4 Gpch Ab Testing
 * Description:       Example block scaffolded with Create Block tool.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       planet4-gpch-ab-testing
 *
 * @package CreateBlock
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
function create_block_planet4_gpch_ab_testing_block_init() {
	register_block_type( __DIR__ . '/build/planet4-gpch-ab-testing' );
}
add_action( 'init', 'create_block_planet4_gpch_ab_testing_block_init' );

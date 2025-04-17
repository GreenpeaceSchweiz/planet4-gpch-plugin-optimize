<?php
/**
 * Plugin Name:       Planet4 GPCH Optimize
 * Description:       A/B Testing and Personalization for Planet4 and Mixpanel
 * Version:           0.3.0
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

define( 'PLANET4_GPCH_PLUGIN_OPTIMIZE_NAME', basename( __DIR__ ) . '/' . basename( __FILE__ ) );
define( 'PLUGIN_FILE_PATH', __FILE__ );

require_once 'classes/class-settingspage.php';
require_once 'classes/class-editorintegration.php';

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
		register_block_type( __DIR__ . '/build/blocks/content-optimization' );
		register_block_type( __DIR__ . '/build/blocks/variant' );
	}
}
add_action( 'init', 'planet4_gpch_plugin_optimize_init' );


/**
 * Enqueues the frontend scripts.
 *
 * @return void
 */
function planet4_gpch_plugin_optimize_add_inline_script() {
	if ( ! is_singular() ) {
		return; // Only run on single posts or pages.
	}

	global $post;

	// Plugin options
	$plugin_options           = get_option( 'planet4_gpch_plugin_optimize_settings' );
	$enable_split_url_testing = isset( $plugin_options['split_url_testing'] ) ? (bool) $plugin_options['split_url_testing'] : false;

	// Post meta of current post
	$post_meta = array(
		'post_is_variant' => get_post_meta( $post->ID, '_planet4_optimize_post_is_variant', true ),
		'experiment_name' => get_post_meta( $post->ID, '_planet4_optimize_experiment_name', true ),
		'variant_name'    => get_post_meta( $post->ID, '_planet4_optimize_variant_name', true ),
	);

	$post_meta['post_is_variant'] = ! empty( $post_meta['post_is_variant'] ) && $post_meta['post_is_variant'] === '1';

	$post_has_block = has_block( 'planet4-gpch-plugin-optimize/content-optimization', $post );

	// We only need to include the scripts if either the current post is a variant of a split url test or if the optimization block is in this post. Otherwise, exit early.
	if ( ! $post || ( ! $post_meta['post_is_variant'] && ! $post_has_block ) ) {
		return;
	}

	// Scripts and data for split URL tests
	if ( $enable_split_url_testing && $post_meta['post_is_variant'] ) {
		// Enqueue the script for split URL tests
		wp_enqueue_script(
			'planet4-gpch-plugin-optimize-split-url-script',
			plugins_url( 'build/frontend/split-url-test.js', PLANET4_GPCH_PLUGIN_OPTIMIZE_NAME ),
			array(),
			filemtime( dirname( __DIR__, 1 ) . 'build/frontend/split-url-test.js' ),
			false, // This script needs to be loaded in the header
		);

		$localized_data_split = array(
			'event_type'                   => isset( $plugin_options['event_type'] ) ? $plugin_options['event_type'] : 'experiment_started',
			'datalayer_event_name'         => isset( $plugin_options['datalayer_event_name'] ) ? $plugin_options['datalayer_event_name'] : '',
			'current_post_is_variant'      => $post_meta['post_is_variant'],
			'current_post_experiment_name' => $post_meta['experiment_name'],
			'current_post_variant_name'    => $post_meta['variant_name'],
		);

		$script = 'window.Planet4GpchPluginOptimizeSplitURLSettings = ' . wp_json_encode( $localized_data_split, JSON_UNESCAPED_SLASHES ) . ';';

		wp_add_inline_script( 'planet4-gpch-plugin-optimize-split-url-script', $script, 'before' );
	}

	global $wp_scripts;

	// Remove the "defer" loading strategy from the view script. The script needs to run earlier in order to prevent content flicker.
	unset( $wp_scripts->registered['planet4-gpch-plugin-optimize-content-optimization-view-script']->extra['strategy'] );

	// Scripts and data for content block optimizations
	if ( $post_has_block ) {
		$localized_data_optimization_view = array(
			'event_type'           => isset( $plugin_options['event_type'] ) ? $plugin_options['event_type'] : 'experiment_started',
			'datalayer_event_name' => isset( $plugin_options['datalayer_event_name'] ) ? $plugin_options['datalayer_event_name'] : '',
		);

		$script = 'window.Planet4GpchPluginOptimizeSettings = ' . wp_json_encode( $localized_data_optimization_view, JSON_UNESCAPED_SLASHES ) . ';';

		// Add inline script BEFORE the Gutenberg block view script.
		wp_add_inline_script( 'planet4-gpch-plugin-optimize-content-optimization-view-script', $script, 'before' );
	}
}

add_action( 'wp_enqueue_scripts', 'planet4_gpch_plugin_optimize_add_inline_script', 50 );



/**
 * Registers meta fields for posts related to the Planet4 GPCH plugin Optimize functionality.
 *
 * Registers the following meta fields:
 * - `_planet4_optimize_post_is_variant`: A boolean to define if the page is used as an experiment variant.
 * - `_planet4_optimize_experiment_name`: A string to store the name of the experiment.
 * - `_planet4_optimize_variant_name`: A string to define the variant's name.
 *
 * @return void
 */
function planet4_gpch_plugin_optimize_register_meta() {
	register_meta(
		'post',
		'_planet4_optimize_post_is_variant',
		array(
			'object_subtype'    => '',
			'type'              => 'boolean',
			'label'             => __(
				'This page/post is an experiment variant for a split URL test.',
				'planet4-gpch-plugin-optimize'
			),
			'single'            => true,
			'auth_callback'     => function () {
				return current_user_can( 'edit_posts' );
			},
			'show_in_rest'      => true,
			'revisions_enabled' => false,
		)
	);
	register_meta(
		'post',
		'_planet4_optimize_experiment_name',
		array(
			'object_subtype'    => '',
			'type'              => 'string',
			'label'             => __(
				'Experiment Name',
				'planet4-gpch-plugin-optimize'
			),
			'single'            => true,
			'sanitize_callback' => 'sanitize_text_field',
			'auth_callback'     => function () {
				return current_user_can( 'edit_posts' );
			},
			'show_in_rest'      => true,
			'revisions_enabled' => false,
		)
	);
	register_meta(
		'post',
		'_planet4_optimize_variant_name',
		array(
			'object_subtype'    => '',
			'type'              => 'string',
			'label'             => __(
				'Variant Name',
				'planet4-gpch-plugin-optimize'
			),
			'single'            => true,
			'sanitize_callback' => 'sanitize_text_field',
			'auth_callback'     => function () {
				return current_user_can( 'edit_posts' );
			},
			'show_in_rest'      => true,
			'revisions_enabled' => false,
		)
	);
}
add_action( 'init', 'planet4_gpch_plugin_optimize_register_meta' );

<?php
/**
 * Optimization report page for WordPress admin.
 *
 * @package Planet4GPCHPluginOptimize
 */

namespace Planet4GpchPluginOptimize;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Provides a WordPress admin containing a list of all optimizations.
 */
final class OptimizationsReport {
	/**
	 * The single instance of the class.
	 *
	 * @var SettingsPage $instance
	 */
	private static $instance = null;

	/**
	 * Singleton instance method.
	 *
	 * @return self|null
	 */
	public static function get_instance(): OptimizationsReport {
		if ( self::$instance === null ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Contains configuration options.
	 *
	 * @var $options
	 */
	private $options;

	/**
	 * Initializes the class and sets up hooks.
	 *
	 * @return void
	 */
	private function __construct() {
		$this->options = get_option( 'planet4_gpch_plugin_optimize_settings' );

		add_action( 'admin_menu', array( $this, 'add_settings_page' ) );
	}

	/**
	 * Adds a settings page.
	 *
	 * @return void
	 */
	public function add_settings_page() {
		add_menu_page(
			__('Planet4 GPCH Optimize', 'planet4-gpch-plugin-optimize' ),
			__('Optimize', 'planet4-gpch-plugin-optimize' ),
			'edit_posts',
			'planet4-gpch-optimize',
			array( $this, 'render_report_page' ),
			'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iODAwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCI+CiAgPHBhdGggZmlsbD0iIzEzMTMxMyIgZD0iTTEwMDkgMTAyM0g3MzhWOTVhNTMgNTMgMCAwIDEgNTQtNTRoMTYzYzMwIDAgNTMgMjUgNTMgNTR2OTI4em0tMjI2LTQ1aDE4MlY5NWMwLTUtNS05LTktOUg3OTNjLTMgMC01IDEtNiAzLTIgMS0zIDMtMyA2djg4M3ptLTEzOSA0NkgzNzRWMzE4YzAtMjggMjMtNDkgNTEtNDloMTcxYzI4IDAgNTAgMjIgNTAgNDl2NzA2em0tMjI1LTQ1aDE4MlYzMThjMC0yLTMtNC02LTRINDI0Yy0zIDAtNiAyLTYgNHY2NjF6bS0xMzQgNDRIMTNWNTM0YzAtMjQgMjEtNDQgNDUtNDRoMTgyYzI0IDAgNDUgMjAgNDUgNDR2NDg5ek01OCA5NzhoMTgyVjUzNEg1OHY0NDR6bTMyNC03NDBjLTEyLTMtMjAtMTUtMTctMjdsMjgtMTEyLTExMy0yOGMtMTItMy0xOS0xNS0xNy0yNyAzLTEyIDE2LTE5IDI4LTE2bDE1NSAzOC0zOCAxNTZjLTIgMTItMTQgMTktMjYgMTZ6Ii8+CiAgPHBhdGggZmlsbD0iIzEzMTMxMyIgZD0iTTgzIDMwN2MtNS0yLTEwLTUtMTMtMTEtNy0xMS00LTI0IDctMzBMNDA4IDY1YzExLTcgMjQtNCAzMSA3IDYgMTEgMyAyNC04IDMxTDEwMCAzMDRjLTUgMy0xMSA0LTE3IDN6Ii8+CiAgPHBhdGggZmlsbD0iIzEyMTIxMiIgZD0iTTc3MSA3NmgyMDR2OTIxSDc3MXpNNTQgNTA5aDE5N3Y0OTFINTR6bTM1NS0yMDRoMjE1djY4OEg0MDl6Ii8+Cjwvc3ZnPgo=',
			80
		);
	}

	/**
	 * Renders the settings page.
	 *
	 * @return void
	 */
	public function render_report_page() {
		$optimizations = $this->get_optimizations();
		?>
		<div class="wrap">
			<h1>Optimize Report</h1>

			<table class="wp-list-table widefat fixed striped table-view-list">
				<thead>
				<tr>
					<th scope="col"><?php esc_html_e('Post Title', 'planet4-gpch-plugin-optimize'); ?></th>
					<th scope="col"><?php esc_html_e('Post Type', 'planet4-gpch-plugin-optimize'); ?></th>
					<th scope="col"><?php esc_html_e('Experiment Status', 'planet4-gpch-plugin-optimize'); ?></th>
					<th scope="col"><?php esc_html_e('Experiment Name', 'planet4-gpch-plugin-optimize'); ?></th>
					<th scope="col"><?php esc_html_e('Variants', 'planet4-gpch-plugin-optimize'); ?></th>
					<th scope="col"><?php esc_html_e('Created By', 'planet4-gpch-plugin-optimize'); ?></th>
					<th scope="col"><?php esc_html_e('Last Edited By', 'planet4-gpch-plugin-optimize'); ?></th>
					<th scope="col"><?php esc_html_e('Creation Date', 'planet4-gpch-plugin-optimize'); ?></th>
				</tr>
				</thead>
				<tbody>
				<?php if (!empty($optimizations)) : ?>
					<?php foreach ($optimizations as $optimization) :
						$post = get_post($optimization['post_id']); // Get post object by ID
						$author_id = $post->post_author; // Post author ID
						$last_editor_id = get_post_meta($optimization['post_id'], '_edit_last', true); // Last editor meta
						?>
						<tr>
							<!-- Post Title -->
							<td><?php echo esc_html(get_the_title($optimization['post_id'])); ?><br>
								<a href="<?php echo esc_url(get_permalink($optimization['post_id'])); ?>" target="_blank"><?php esc_html_e('View', 'planet4-gpch-plugin-optimize'); ?></a> |
								<a href="<?php echo esc_url(get_edit_post_link($optimization['post_id'])); ?>" target="_blank"><?php esc_html_e('Edit', 'planet4-gpch-plugin-optimize'); ?></a>
							</td>

							<!-- Post Type -->
							<td><?php echo esc_html(get_post_type($optimization['post_id'])); ?></td>

							<!-- Experiment Status -->
							<td>
								<?php
								if (isset($optimization['attributes']['status']) && $optimization['attributes']['status']) {
									esc_html_e('Active', 'planet4-gpch-plugin-optimize');
								} else {
									esc_html_e('Deactivated', 'planet4-gpch-plugin-optimize');
								}
								?>
							</td>

							<!-- Experiment Name -->
							<td><?php echo esc_html($optimization['experiment_name'] ?? '-'); ?></td>

							<!-- Variants -->
							<td>
								<?php if (!empty($optimization['variants'])) : ?>
									<ul>
										<?php foreach ($optimization['variants'] as $variant) : ?>
											<li>
												<?php
												echo esc_html($variant['name']);
												if (!empty($variant['target_percentage'])) {
													echo ' (' . esc_html($variant['target_percentage']) . '%)';
												}
												if (!empty($variant['conditionals'])) {
													echo ': ' . esc_html(implode(', ', $variant['conditionals']));
												}
												?>
											</li>
										<?php endforeach; ?>
									</ul>
								<?php else : ?>
									<?php esc_html_e('No variants found.', 'planet4-gpch-plugin-optimize'); ?>
								<?php endif; ?>
							</td>

							<!-- Created By -->
							<td><?php echo esc_html(get_the_author_meta('display_name', $author_id)); ?></td>

							<!-- Last Edited By -->
							<td>
								<?php echo $last_editor_id ? esc_html(get_the_author_meta('display_name', $last_editor_id)) : esc_html__('N/A', 'planet4-gpch-plugin-optimize'); ?>
							</td>

							<!-- Post Creation Date -->
							<td><?php echo esc_html(get_the_date('Y-m-d', $optimization['post_id'])); ?></td>
						</tr>
					<?php endforeach; ?>
				<?php else : ?>
					<tr>
						<td colspan="9"><?php esc_html_e('No optimizations found.', 'planet4-gpch-plugin-optimize'); ?></td>
					</tr>
				<?php endif; ?>
				</tbody>
			</table>
		</div>
		<?php

		var_dump($optimizations);
	}

	/**
	 * Retrieves an array of post IDs of posts that contain a optimization block
	 *
	 * @return array An array of post IDs that meet the specified conditions.
	 * @global wpdb $wpdb WordPress database abstraction object used for database queries.
	 *
	 */
	protected function get_posts_ids_with_optimizations() {
			global $wpdb;

		/**
		 * Default post types to search
		 *
		 * @var array $default_post_types List of default post type slugs.
		 */
		$default_post_types = ['post', 'page'];

		/**
		 * Filter to customize the post types searched for the Optimize report.
		 *
		 * Add your own custom post types if you'd like them to show up in the report when they contain optimizations.
		 *
		 * @param array $post_types
		 */
			$post_types = apply_filters('planet4_gpch_plugin_optimize_report_post_types', $default_post_types);

			// Generate the SQL placeholder for the post types
			$post_type_placeholders = implode(', ', array_fill(0, count($post_types), '%s'));

			$query = $wpdb->prepare(
				"
				SELECT ID
				FROM {$wpdb->posts}
				WHERE post_status IN (%s, %s, %s, %s, %s)
				AND post_type IN ($post_type_placeholders)
				AND post_type != 'revision'
				AND post_content LIKE %s
				",
				array_merge(
					[
						'publish',
						'future',
						'draft',
						'pending',
						'private'
					],
					$post_types,
					['%<!-- wp:planet4-gpch-plugin-optimize/content-optimization%']
				)
			);

			$post_ids = $wpdb->get_col($query);

		return $post_ids;
	}

	/**
	 * Retrieves a list of content optimizations from posts.
	 *
	 * @return array An array of optimizations, where each optimization includes:
	 *               - 'post_id': The ID of the post containing the optimization block.
	 *               - 'attributes': The attributes of the optimization block.
	 *               - 'variants': An array of variant blocks with their respective attributes.
	 */
	protected function get_optimizations() {
		$optimizations = [];

		$post_ids = $this->get_posts_ids_with_optimizations();

		foreach ($post_ids as $post_id) {
			$post_content = get_post_field('post_content', $post_id);

			$blocks = parse_blocks($post_content);

			// Recursive function to extract blocks and innerBlocks
			$extract_blocks = function ($blocks, $post_id) use (&$extract_blocks, &$optimizations) {
				foreach ($blocks as $block) {
					if ($block['blockName'] === 'planet4-gpch-plugin-optimize/content-optimization') {
						// Add the block's attributes to the optimizations array
						$optimization_entry = [
							'post_id' => $post_id,
							'attributes' => $block['attrs'] ?? [], // Block attributes, if available
							'variants' => [],
						];

						// Get attributes of the variants
						if (!empty($block['innerBlocks'])) {
							foreach ($block['innerBlocks'] as $inner_block) {
								if ($inner_block['blockName'] === 'planet4-gpch-plugin-optimize/variant') {
									$optimization_entry['variants'][] = [
										'blockName' => $inner_block['blockName'],
										'attributes' => $inner_block['attrs'] ?? [],
									];
								}
							}
						}

						$optimizations[] = $optimization_entry;
					}

					// Recursively check innerBlocks
					if (!empty($block['innerBlocks'])) {
						$extract_blocks($block['innerBlocks'], $post_id);
					}
				}
			};

			$extract_blocks($blocks, $post_id);
		}

		return $optimizations;
	}
}

// Initialize the singleton instance
OptimizationsReport::get_instance();

<?php
/**
 * Settings Page
 *
 * @package Planet4GPCHPluginOptimize
 */

namespace Planet4GpchPluginOptimize;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Provides a WordPress admin settings page for the plugin.
 */
final class SettingsPage {
	/**
	 * The single instance of the class.
	 *
	 * @var SettingsPage $instance
	 */
	private static $instance = null;

	/**
	 * Contains configuration options.
	 *
	 * @var $options
	 */
	private $options;

	/**
	 * Singleton instance method.
	 *
	 * @return self|null
	 */
	public static function get_instance(): SettingsPage {
		if ( self::$instance === null ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Initializes the class and sets up hooks for plugin settings.
	 *
	 * @return void
	 */
	private function __construct() {
		register_activation_hook( PLUGIN_FILE_PATH, array( &$this, 'plugin_activate' ) );

		$this->options = get_option( 'planet4_gpch_plugin_optimize_settings' );

		add_filter( 'plugin_action_links_' . plugin_basename( PLANET4_GPCH_PLUGIN_OPTIMIZE_NAME ), array( $this, 'add_plugin_action_links' ) );
		add_action( 'admin_menu', array( $this, 'add_settings_page' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
	}

	/**
	 * Sets defaults for settings when plugin is activated.
	 *
	 * @return void
	 */
	public function plugin_activate() {
		$default_settings = array(
			'enable_blocks'        => '1',
			'split_url_testing'    => '1',
			'event_type'           => 'mixpanel',
			'datalayer_event_name' => 'experiment_started',
		);

		// Set default settings
		add_option( 'planet4_gpch_plugin_optimize_settings', $default_settings );
	}

	/**
	 * Adds a settings link to the plugin action links on the plugins page.
	 *
	 * @param array $plugin_actions The existing plugin action links.
	 * @return array The modified plugin action links with the settings link added.
	 */
	public function add_plugin_action_links( $plugin_actions ) {
		$plugin_actions[] = sprintf(
			'<a href="%s">%s</a>',
			esc_url( admin_url( 'admin.php?page=planet4-gpch-optimize-settings' ) ),
			__( 'Settings', 'planet4-gpch-plugin-optimize' )
		);

		return $plugin_actions;
	}

	/**
	 * Adds a settings page.
	 *
	 * @return void
	 */
	public function add_settings_page() {
		add_menu_page(
			'Planet4 GPCH Optimize Settings',
			'Optimize',
			'manage_options',
			'planet4-gpch-optimize-settings',
			array( $this, 'render_settings_page' ),
			'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iODAwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCI+CiAgPHBhdGggZmlsbD0iIzEzMTMxMyIgZD0iTTEwMDkgMTAyM0g3MzhWOTVhNTMgNTMgMCAwIDEgNTQtNTRoMTYzYzMwIDAgNTMgMjUgNTMgNTR2OTI4em0tMjI2LTQ1aDE4MlY5NWMwLTUtNS05LTktOUg3OTNjLTMgMC01IDEtNiAzLTIgMS0zIDMtMyA2djg4M3ptLTEzOSA0NkgzNzRWMzE4YzAtMjggMjMtNDkgNTEtNDloMTcxYzI4IDAgNTAgMjIgNTAgNDl2NzA2em0tMjI1LTQ1aDE4MlYzMThjMC0yLTMtNC02LTRINDI0Yy0zIDAtNiAyLTYgNHY2NjF6bS0xMzQgNDRIMTNWNTM0YzAtMjQgMjEtNDQgNDUtNDRoMTgyYzI0IDAgNDUgMjAgNDUgNDR2NDg5ek01OCA5NzhoMTgyVjUzNEg1OHY0NDR6bTMyNC03NDBjLTEyLTMtMjAtMTUtMTctMjdsMjgtMTEyLTExMy0yOGMtMTItMy0xOS0xNS0xNy0yNyAzLTEyIDE2LTE5IDI4LTE2bDE1NSAzOC0zOCAxNTZjLTIgMTItMTQgMTktMjYgMTZ6Ii8+CiAgPHBhdGggZmlsbD0iIzEzMTMxMyIgZD0iTTgzIDMwN2MtNS0yLTEwLTUtMTMtMTEtNy0xMS00LTI0IDctMzBMNDA4IDY1YzExLTcgMjQtNCAzMSA3IDYgMTEgMyAyNC04IDMxTDEwMCAzMDRjLTUgMy0xMSA0LTE3IDN6Ii8+CiAgPHBhdGggZmlsbD0iIzEyMTIxMiIgZD0iTTc3MSA3NmgyMDR2OTIxSDc3MXpNNTQgNTA5aDE5N3Y0OTFINTR6bTM1NS0yMDRoMjE1djY4OEg0MDl6Ii8+Cjwvc3ZnPgo=',
			80
		);
	}

	/**
	 * Renders the settings page.
	 *
	 * @return void
	 */
	public function render_settings_page() {
		?>
		<div class="wrap">
			<h1>Optimize Settings</h1>
			<form method="post" action="options.php">
				<?php
				settings_fields( 'planet4_gpch_plugin_optimize_settings_group' );
				do_settings_sections( 'planet4-gpch-optimize-settings' );
				submit_button();
				?>
			</form>
		</div>
		<?php
	}

	/**
	 * Register all settings for the plugin.
	 *
	 * @return void
	 */
	public function register_settings() {
		// Register settings
		register_setting( 'planet4_gpch_plugin_optimize_settings_group', 'planet4_gpch_plugin_optimize_settings' );

		// Section
		add_settings_section(
			'planet4_gpch_plugin_optimize_main_section',
			__( 'Main Settings', 'planet4-gpch-plugin-optimize' ),
			null,
			'planet4-gpch-optimize-settings'
		);

		// Fields
		$this->add_field( 'enable_blocks', __( 'Enable Gutenberg Blocks', 'planet4-gpch-plugin-optimize' ), 'checkbox', 'Enable' );
		$this->add_field( 'split_url_testing', __( 'Enable Split URL Testing', 'planet4-gpch-plugin-optimize' ), 'checkbox', 'Enable' );
		$this->add_field(
			'event_type',
			__( 'Event Type', 'planet4-gpch-plugin-optimize' ),
			'dropdown',
			array(
				'datalayer' => __( 'DataLayer/Tag Manager Event', 'planet4-gpch-plugin-optimize' ),
				'mixpanel'  => __( 'Mixpanel Javascript SDK Event', 'planet4-gpch-plugin-optimize' ),
			)
		);
		$this->add_field( 'datalayer_event_name', __( 'DataLayer Event Name', 'planet4-gpch-plugin-optimize' ), 'text', '', true );
	}

	/**
	 * Helper method to add a settings field to the plugin's settings page.
	 *
	 * @param string $id Identifier for the settings field.
	 * @param string $label Display label for the settings field.
	 * @param string $type Type of the field, e.g., 'text', 'checkbox', or 'dropdown'.
	 * @param mixed  $args Additional arguments for the field, such as options for dropdowns (optional).
	 * @param bool   $conditional If true, adds a conditional script to the field (optional).
	 *
	 * @return void
	 */
	private function add_field( $id, $label, $type, $args = '', $conditional = false ) {
		add_settings_field(
			$id,
			$label,
			function () use ( $id, $type, $args, $conditional ) {
				$value = isset( $this->options[ $id ] ) ? esc_attr( $this->options[ $id ] ) : '';
				switch ( $type ) {
					case 'checkbox':
						$checked = $value ? 'checked' : '';
						echo "<input type='checkbox' name='planet4_gpch_plugin_optimize_settings[" . esc_html( $id ) . "]' value='1' " . esc_html( $checked ) . '> ' . esc_html( $args );
						break;
					case 'text':
						echo "<input type='text' name='planet4_gpch_plugin_optimize_settings[" . esc_html( $id ) . "]' value='" . esc_html( $value ) . "' placeholder='Enter event name'>";
						break;
					case 'dropdown':
						echo "<select name='planet4_gpch_plugin_optimize_settings[" . esc_html( $id ) . "]' id='" . esc_html( $id ) . "'>";

						foreach ( $args as $key => $label ) {
							$selected = selected( $value, $key, false );
							echo "<option value='" . esc_html( $key ) . "' " . esc_html( $selected ) . '>' . esc_html( $label ) . '</option>';
						}
						echo '</select>';
						break;
				}
			},
			'planet4-gpch-optimize-settings',
			'planet4_gpch_plugin_optimize_main_section'
		);
	}
}

// Initialize the singleton instance
SettingsPage::get_instance();

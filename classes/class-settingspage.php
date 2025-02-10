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
class SettingsPage {

	/**
	 * Holds the singleton instance of the class.
	 *
	 * @var $instance
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
	public static function get_instance() {
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
		$this->options = get_option( 'planet4_gpch_plugin_optimize_settings' );
		add_action( 'admin_menu', array( $this, 'add_settings_page' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
	}

	/**
	 * Adds a settings page.
	 *
	 * @return void
	 */
	public function add_settings_page() {
		add_menu_page(
			'Planet4 GPCH Optimize Settings',
			'Optimize Settings',
			'manage_options',
			'planet4-gpch-optimize-settings',
			array( $this, 'render_settings_page' ),
			'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iODAwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCI+CiAgPGcgZmlsbD0iIzEzMTMxMyI+CiAgICA8cGF0aCBkPSJNMTAwOS40NSAxMDIyLjg4SDczOC4zMjVWOTUuMjNjMC0xNC41NjUgNS42MDItMjguMDA5IDE1LjY4NS0zOC4wOTIgMTAuMDg0LTEwLjA4MyAyMy41MjgtMTUuNjg1IDM4LjA5Mi0xNS42ODVoMTYyLjQ1MWMzMC4yNSAwIDUzLjc3NyAyNC42NDggNTMuNzc3IDUzLjc3N3Y5MjcuNjV6bS0yMjYuMzEtNDQuODE0aDE4MS40OTZWOTUuMjNjMC01LjYwMi00LjQ4MS04Ljk2My04Ljk2My04Ljk2M2gtMTYyLjQ1Yy0zLjM2MSAwLTUuNjAyIDEuMTItNi43MjIgMi4yNC0xLjEyIDEuMTIxLTIuMjQxIDMuMzYyLTIuMjQxIDYuNzIzdjg4Mi44MzZ6TTY0NC4yMTYgMTAyNEgzNzQuMjEyVjMxOC4xOGMwLTI4LjAxIDIyLjQwNy00OS4yOTYgNTAuNDE1LTQ5LjI5NmgxNzEuNDE0YzI4LjAwOSAwIDUwLjQxNiAyMi40MDcgNTAuNDE2IDQ5LjI5NVYxMDI0em0tMjI1LjE5LTQ0LjgxNGgxODEuNDk2VjMxOC4xNzljMC0yLjI0LTIuMjQtNC40ODEtNS42MDEtNC40ODFINDIzLjUwN2MtMi4yNCAwLTUuNjAyIDIuMjQtNS42MDIgNC40ODF2NjYxLjAwN3ptLTEzNC40NDIgNDMuNjk0SDEzLjQ1OVY1MzQuNDA3YzAtMjQuNjQ4IDIwLjE2Ni00NC44MTQgNDQuODE0LTQ0LjgxNEgyMzkuNzdjMjQuNjQ3IDAgNDQuODE0IDIwLjE2NiA0NC44MTQgNDQuODE0djQ4OC40NzN6TTU4LjI3MyA5NzguMDY2SDIzOS43N1Y1MzQuNDA3SDU4LjI3M3Y0NDMuNjU5em0zMjMuNDg1LTczOS44MzhjLTExLjk2Ni0yLjk1LTE5LjM0Mi0xNS4xNTMtMTYuMzkzLTI3LjExOWwyNy42MTgtMTEyLjA0Mi0xMTMuMTMtMjcuODg2Yy0xMS45NjUtMi45NS0xOS4zNDItMTUuMTUzLTE2LjM5My0yNy4xMTkgMi45NS0xMS45NjYgMTUuMTUzLTE5LjM0MiAyNy4xMTktMTYuMzkzbDE1NS41NTQgMzguMzQ0LTM4LjM0NCAxNTUuNTU0Yy0xLjg2MiAxMi4yMzQtMTQuMDY1IDE5LjYxLTI2LjAzIDE2LjY2MXoiLz4KICAgIDxwYXRoIGQ9Ik04My4zNTYgMzA2LjZjLTUuNDM5LTEuMzQtMTAuMzQxLTQuODU3LTEzLjYyLTEwLjI4LTYuNTU3LTEwLjg0OC0zLjM0LTIzLjkwMSA3LjUwOC0zMC40NThMNDA4LjM2IDY0Ljc3OWMxMC44NDctNi41NTcgMjMuOS0zLjM0IDMwLjQ1OCA3LjUwOCA2LjU1NyAxMC44NDcgMy4zNCAyMy45LTcuNTA4IDMwLjQ1OEwxMDAuMTk0IDMwMy44MjdjLTUuNDIzIDMuMjgtMTEuMzk5IDQuMTE0LTE2LjgzOCAyLjc3M3oiLz4KICA8L2c+Cjwvc3ZnPgo=',
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

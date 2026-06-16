const { registerPlugin } = wp.plugins;
const { PluginDocumentSettingPanel } = wp.editor;

import PluginMetaFields from './plugin-meta-fields';

import optimizeIcon from '../../icons/optimization.js';

import './style.scss';

const PluginDocumentSettingPanelOptimize = () => (
	<PluginDocumentSettingPanel
		name="planet4-gpch-plugin-optimize-setting-panel"
		title="Split URL Experiment"
		className="planet4-gpch-plugin-optimize-setting-panel"
		icon={ optimizeIcon }
	>
		<PluginMetaFields />
	</PluginDocumentSettingPanel>
);

registerPlugin( 'plugin-document-setting-panel-demo', {
	render: PluginDocumentSettingPanelOptimize,
	icon: { optimizeIcon },
} );

/* global Planet4GpchPluginOptimizeSplitURLSettings */
const SplitUrlTest = () => {
	if (
		typeof Planet4GpchPluginOptimizeSplitURLSettings !== 'undefined' &&
		Planet4GpchPluginOptimizeSplitURLSettings.current_post_is_variant ===
			true
	) {
		const settings = Planet4GpchPluginOptimizeSplitURLSettings;
		const optimizationName = settings.current_post_experiment_name;
		const variantName = settings.current_post_variant_name;

		if ( settings.event_type === 'mixpanel' ) {
			if ( typeof window.mixpanel !== 'undefined' ) {
				console.log( 'Sending event to Mixpanel' );
				window.mixpanel.track( '$experiment_started', {
					'Experiment name': optimizationName,
					'Variant name': variantName,
				} );
			}
		} else if ( settings.event_type === 'datalayer' ) {
			window.dataLayer = window.dataLayer || [];
			console.log( 'Sending event to DataLayer' );
			window.dataLayer.push( {
				event: settings.datalayer_event_name,
				experiment_name: optimizationName,
				variant_name: variantName,
			} );
		}
	}
};

SplitUrlTest();

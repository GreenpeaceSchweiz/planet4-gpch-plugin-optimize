/* global localStorage, Planet4GpchPluginOptimizeSettings */
const OptimizeFrontend = () => {
	const optimizeBlocks = document.querySelectorAll(
		'.gp-optimize-container'
	);

	/**
	 * Returns a weighted random element from an array.
	 *
	 * @param {Array} items Array of item objects with at least `item` and `weight` properties
	 * @return {Object} The item selected by weighted random
	 */
	const selectWeightedRandomItem = ( items ) => {
		const weights = items.reduce( ( acc, item, i ) => {
			acc.push( item.weight + ( acc[ i - 1 ] ?? 0 ) );
			return acc;
		}, [] );

		const random = Math.random() * weights.at( -1 );

		return items[ weights.findIndex( ( weight ) => weight > random ) ];
	};

	/**
	 * Select a variant using the targeting specifications in variantTargeting
	 *
	 * @param {string} optimizationId
	 * @param {Array}  variants
	 */
	const chooseVariant = ( optimizationId, variants ) => {
		const storedVariant = localStorage.getItem(
			'gp-optimize-' + optimizationId
		);

		if ( storedVariant !== undefined ) {
			// Return the stored variant only if it still exists
			for ( const variant of variants ) {
				if ( variant.dataset.variantId === storedVariant ) {
					console.log( 'Found stored variant ID: ', storedVariant );
					return storedVariant;
				}
			}
		}

		// Choose by weighted random
		const weightedRandomData = [];
		for ( const variant of variants ) {
			let weight = parseInt( variant.dataset.targetPercentage );
			if ( isNaN( weight ) ) {
				weight = 50;
			}

			weightedRandomData.push( {
				variantId: variant.dataset.variantId,
				weight,
			} );
		}
		console.log( 'Weighted random data: ', weightedRandomData );

		const winningVariant = selectWeightedRandomItem( weightedRandomData );

		// Save to local storage
		localStorage.setItem(
			'gp-optimize-' + optimizationId,
			winningVariant.variantId
		);

		console.log( 'Selected winning variant: ', winningVariant.variantId );

		return winningVariant.variantId;
	};

	console.log( 'Starting Optimize' );
	optimizeBlocks.forEach( ( optimizeBlock ) => {
		// Only continue if the experiment is enabled
		if (
			optimizeBlock.dataset.status === 'true' &&
			optimizeBlock.dataset.optimizationId !== undefined
		) {
			const variants = optimizeBlock.querySelectorAll(
				'.gp-optimize-variant'
			);

			const winnerVariantId = chooseVariant(
				optimizeBlock.dataset.optimizationId,
				variants
			);

			let winnerVariant;

			console.log(
				'Winning variant for Optimization ' +
					optimizeBlock.dataset.optimizationId +
					' is ' +
					winnerVariantId
			);

			// Show the winning variant, hide the rest
			for ( const variant of variants ) {
				if ( variant.dataset.variantId === winnerVariantId ) {
					variant.style.display = 'block';
					winnerVariant = variant;
				} else {
					variant.style.display = 'none';
				}
			}

			// Send an experiment info to either Mixpanel or dataLayer
			const optimizationName =
				optimizeBlock.dataset.optimizationName ||
				optimizeBlock.dataset.optimizationId;

			if ( typeof Planet4GpchPluginOptimizeSettings !== 'undefined' ) {
				if (
					Planet4GpchPluginOptimizeSettings.event_type === 'mixpanel'
				) {
					if ( typeof window.mixpanel !== 'undefined' ) {
						console.log( 'Sending event to Mixpanel' );
						window.mixpanel.track( '$experiment_started', {
							'Experiment name': optimizationName,
							'Variant name': winnerVariant.dataset.variantName,
						} );
					}
				} else if (
					Planet4GpchPluginOptimizeSettings.event_type === 'datalayer'
				) {
					window.dataLayer = window.dataLayer || [];
					console.log( 'Sending event to DataLayer' );
					window.dataLayer.push( {
						event: Planet4GpchPluginOptimizeSettings.datalayer_event_name,
						experiment_name: optimizationName,
						variant_name: winnerVariant.dataset.variantName,
					} );
				}
			}
		}
	} );
};

OptimizeFrontend();

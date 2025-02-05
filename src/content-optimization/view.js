/* global localStorage, mixpanel */
const OptimizationFrontend = () => {
	const optimizationBlocks = document.querySelectorAll(
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
					console.log("Found stored variant ID: ", storedVariant);
					return storedVariant;
				}
			}
		}

		// Choose by weighted random
		const weightedRandomData = [];
		for ( const variant of variants ) {
			weightedRandomData.push( {
				variantId: variant.dataset.variantId,
				weight: parseInt( variant.dataset.targetPercentage ),
			} );
		}
		console.log("Weighted random data: ", weightedRandomData);

		const winningVariant = selectWeightedRandomItem( weightedRandomData );

		// Save to local storage
		localStorage.setItem(
			'gp-optimize-' + optimizationId,
			winningVariant.variantId
		);

		console.log("Selected winning variant: ", winningVariant.variantId);

		return winningVariant.variantId;
	};

	console.log("Starting Optimize");
	optimizationBlocks.forEach( ( optimizationBlock ) => {
		// Only continue if the experiment is enabled
		if (
			optimizationBlock.dataset.status === 'true' &&
			optimizationBlock.dataset.optimizationId !== undefined
		) {
			const variants = optimizationBlock.querySelectorAll(
				'.gp-optimize-variant'
			);

			const winnerVariantId = chooseVariant(
				optimizationBlock.dataset.optimizationId,
				variants
			);

			let winnerVariant;

			console.log("Winning variant for Optimization " + optimizationBlock.dataset.optimizationId + " is " + winnerVariantId);

			// Show the winning variant, hide the rest
			for ( const variant of variants ) {
				if ( variant.dataset.variantId === winnerVariantId ) {
					variant.style.display = 'block';
					winnerVariant = variant;
				} else {
					variant.style.display = 'none';
				}
			}

			// Send an event to Mixpanel
			if ( mixpanel !== undefined ) {
				mixpanel.track( '$experiment_started', {
					'Experiment name':
						optimizationBlock.dataset.optimizationName,
					'Variant name': winnerVariant.dataset.variantName,
				} );
			}
		}
	} );
};

OptimizationFrontend();

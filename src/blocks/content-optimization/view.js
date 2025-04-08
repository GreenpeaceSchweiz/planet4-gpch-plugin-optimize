/* global localStorage, MutationObserver, Planet4GpchPluginOptimizeSettings */
/**
 * The main function handling the frontend of optimizations.
 */
const GpOptimizeFrontend = () => {
	/**
	 * Waits for an element specified by a CSS selector to be available in the DOM and resolves a promise with the element.
	 * If the element already exists, the promise resolves immediately. Otherwise, it observes changes in the DOM and resolves when the element is added.
	 *
	 * @param {string} selector - The CSS selector of the element to wait for.
	 * @return {Promise<Element>} A promise that resolves with the matching HTML element once it is available in the DOM.
	 */
	const waitForElement = ( selector ) => {
		return new Promise( ( resolve ) => {
			if ( document.querySelector( selector ) ) {
				return resolve( document.querySelector( selector ) );
			}

			const observer = new MutationObserver( () => {
				if ( document.querySelector( selector ) ) {
					observer.disconnect();
					resolve( document.querySelector( selector ) );
				}
			} );

			observer.observe( document.documentElement, {
				childList: true,
				subtree: true,
			} );
		} );
	};

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

	/**
	 * CSS selector fof the optimize container element.
	 *
	 * @type {string}
	 */
	const containerSelector = '.gp-optimize-container';

	// Run the frontend script as soon as an experiment container becomes available.
	waitForElement( containerSelector ).then( () => {
		const optimizeBlocks = document.querySelectorAll( containerSelector );

		console.log( 'Starting Optimize for blocks: ', optimizeBlocks );

		optimizeBlocks.forEach( ( optimizeBlock ) => {
			// Only continue if the experiment is enabled
			if (
				optimizeBlock.dataset.status === 'true' &&
				optimizeBlock.dataset.optimizationId !== undefined
			) {
				const variants = optimizeBlock.querySelectorAll(
					'.gp-optimize-variant'
				);

				console.log( 'Variants: ', variants );

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

				if (
					typeof Planet4GpchPluginOptimizeSettings !== 'undefined'
				) {
					if (
						Planet4GpchPluginOptimizeSettings.event_type ===
						'mixpanel'
					) {
						if ( typeof window.mixpanel !== 'undefined' ) {
							console.log( 'Sending event to Mixpanel' );
							window.mixpanel.track( '$experiment_started', {
								'Experiment name': optimizationName,
								'Variant name':
									winnerVariant.dataset.variantName,
							} );
						}
					} else if (
						Planet4GpchPluginOptimizeSettings.event_type ===
						'datalayer'
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
	} );
};

GpOptimizeFrontend();

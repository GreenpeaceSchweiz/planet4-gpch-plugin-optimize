/* global localStorage, sessionStorage, MutationObserver, Planet4GpchPluginOptimizeSettings */

/**
 * The main function handling frontend optimizations.
 */
const gpOptimizeFrontend = () => {
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
	 * Compares a URL query parameter value against a specified value using a given operator.
	 *
	 * @param {string} name     The name of the URL parameter to be matched.
	 * @param {string} value    The value to compare the parameter value against.
	 * @param {string} operator The comparison operator to use. Valid operators include:
	 *                          'is' (checks if the parameter value is equal to the given value),
	 *                          'is_not' (checks if the parameter value is not equal to the given value),
	 *                          'contains' (checks if the parameter value contains the given value),
	 *                          'does_not_contain' (checks if the parameter value does not contain the given value).
	 *
	 * @return {boolean} Returns true if the comparison matches based on the operator, otherwise false.
	 */
	const matchURLParameters = ( name, value, operator ) => {
		const urlParams = new URLSearchParams( window.location.search );
		const paramValue = urlParams.get( name );

		if ( operator === 'is' ) {
			if ( paramValue && paramValue === value ) {
				return true;
			}
		} else if ( operator === 'is_not' ) {
			if ( paramValue && paramValue !== value ) {
				return true;
			}
		} else if ( operator === 'contains' ) {
			if ( paramValue && paramValue.includes( value ) ) {
				return true;
			}
		} else if ( operator === 'does_not_contain' ) {
			if ( paramValue && ! paramValue.includes( value ) ) {
				return true;
			}
		}

		return false;
	};

	/**
	 * Evaluates and matches a value stored in localStorage or sessionStorage based on specified criteria.
	 *
	 * @param {string} storageType    - The type of storage to check, either 'local_storage' or 'session_storage'.
	 * @param {string} nameInStorage  - The key name of the value stored in the specified storage.
	 * @param {string} dataType       - The expected data type of the stored value. Supported data types are 'string', 'comma_separated', or 'object'.
	 * @param {string} conditionalKey - The key to inspect within the stored object when `dataType` is 'object'.
	 * @param {string} operator       - The operator to apply for comparison. Supported operators are 'is', 'is_not', 'contains', or 'does_not_contain'.
	 * @param {string} value          - The value to compare against the stored value based on the specified operator.
	 * @return {boolean} Returns `true` if the stored value matches the specified criteria; otherwise, returns `false`.
	 */
	const matchStorageElements = (
		storageType,
		nameInStorage,
		dataType,
		conditionalKey,
		operator,
		value
	) => {
		console.log(
			storageType,
			nameInStorage,
			dataType,
			conditionalKey,
			operator,
			value
		);

		// Try to find matches in storage (localStorage or sessionStorage)
		if (
			storageType === 'local_storage' ||
			storageType === 'session_storage'
		) {
			const storage =
				storageType === 'local_storage' ? localStorage : sessionStorage;
			const storedValue = storage.getItem( nameInStorage );

			// Ensure the stored value exists
			if ( storedValue === null ) {
				return false;
			}

			console.log( 'storedValue', storedValue );

			// Process the stored value based on its data type
			if ( dataType === 'string' ) {
				if ( operator === 'is' ) {
					return storedValue === value;
				} else if ( operator === 'is_not' ) {
					return storedValue !== value;
				} else if ( operator === 'contains' ) {
					return storedValue.includes( value );
				} else if ( operator === 'does_not_contain' ) {
					return ! storedValue.includes( value );
				}
			} else if ( dataType === 'comma_separated' ) {
				// Treat value as a comma-separated list
				const values = storedValue
					.split( ',' )
					.map( ( v ) => v.trim() );

				if ( operator === 'contains' ) {
					return values.includes( value );
				} else if ( operator === 'does_not_contain' ) {
					return ! values.includes( value );
				}
			} else if ( dataType === 'object' ) {
				try {
					const parsedValue = JSON.parse( storedValue );

					// Ensure the parsed value is an object
					if (
						typeof parsedValue !== 'object' ||
						parsedValue === null
					) {
						return false;
					}

					const storedObjectValue = parsedValue[ conditionalKey ];

					// Perform checks based on operator
					if ( operator === 'is' ) {
						return storedObjectValue === value;
					} else if ( operator === 'is_not' ) {
						return storedObjectValue !== value;
					} else if (
						operator === 'contains' &&
						typeof storedObjectValue === 'string'
					) {
						return storedObjectValue.includes( value );
					} else if (
						operator === 'does_not_contain' &&
						typeof storedObjectValue === 'string'
					) {
						return ! storedObjectValue.includes( value );
					}
				} catch ( error ) {
					// If JSON parsing fails, return false
					return false;
				}
			}
		}

		// Return false as a fallback
		return false;
	};

	/**
	 * Select a variant using the targeting specifications in variantTargeting
	 *
	 * @param {string} optimizationId
	 * @param {Array}  variants
	 */
	const chooseVariant = ( optimizationId, variants ) => {
		let winningVariantId = null;

		// Check the conditions in variants and if and of them are met, force show that variant.
		// Forced variants have priority over random variant selection.
		variantLoop: for ( const variant of variants ) {
			// Force preview when force_variant URL parameter is set to the current variantId
			const urlParams = new URLSearchParams( window.location.search );
			const forcePreviewVariant = urlParams.get( 'force_variant' );

			if ( forcePreviewVariant === variant.dataset.variantId ) {
				winningVariantId = variant.dataset.variantId;
				break variantLoop;
			}

			// Conditionals
			if ( variant.dataset.conditionals !== undefined ) {
				const variantConditionals = JSON.parse(
					variant.dataset.conditionals
				);

				if ( typeof variantConditionals === 'object' ) {
					for ( const condition of variantConditionals ) {
						let result = false;

						if ( condition.type === 'url_parameter' ) {
							result = matchURLParameters(
								condition.conditionalKey,
								condition.value,
								condition.operator
							);
						} else if (
							condition.type === 'local_storage' ||
							condition.type === 'session_storage'
						) {
							result = matchStorageElements(
								condition.type,
								condition.nameInStorage,
								condition.dataType,
								condition.conditionalKey,
								condition.operator,
								condition.value
							);
						}

						if ( result === true ) {
							winningVariantId = variant.dataset.variantId;

							break variantLoop;
						}
					}
				}
			}
		}

		// If no variant is forced, apply all other selection mechanisms
		if ( winningVariantId === null ) {
			// If the user has seen this optimization before, we've stored the variant and need to show the same one again.
			const storedVariant = localStorage.getItem(
				'gp-optimize-' + optimizationId
			);

			if ( storedVariant !== undefined ) {
				// Return the stored variant, but only if it still exists
				for ( const variant of variants ) {
					if ( variant.dataset.variantId === storedVariant ) {
						console.log(
							'Found stored variant ID: ',
							storedVariant
						);

						return storedVariant;
					}
				}
			}

			// If no variant is selected by now, choose by weighted random (with the weights set in the variants)
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
			console.log( 'Selected winning variant by weighted random. ' );

			const winningVariant =
				selectWeightedRandomItem( weightedRandomData );

			winningVariantId = winningVariant.variantId;
		}

		// Save to local storage
		localStorage.setItem(
			'gp-optimize-' + optimizationId,
			winningVariantId
		);

		console.log( 'Selected winning variant: ', winningVariantId );

		return winningVariantId;
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
						variant.remove();
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

gpOptimizeFrontend();

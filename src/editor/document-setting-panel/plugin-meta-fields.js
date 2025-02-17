import { __ } from '@wordpress/i18n';
import { TextControl, ToggleControl } from '@wordpress/components';
const { useSelect, useDispatch } = wp.data;

const PluginMetaFields = () => {
	const { pageIsVariant, experimentName, variantName } = useSelect(
		( select ) => {
			return {
				pageIsVariant:
					select( 'core/editor' ).getEditedPostAttribute( 'meta' )
						._planet4_optimize_post_is_variant,
				experimentName:
					select( 'core/editor' ).getEditedPostAttribute( 'meta' )
						._planet4_optimize_experiment_name,
				variantName:
					select( 'core/editor' ).getEditedPostAttribute( 'meta' )
						._planet4_optimize_variant_name,
			};
		}
	);

	const { editPost } = useDispatch( 'core/editor' );
	const updateMetaField = ( metaName, value ) => {
		editPost( { meta: { [ metaName ]: value } } );
	};

	return (
		<>
			<ToggleControl
				checked={ !! pageIsVariant }
				label={ __(
					'Use this page/post as experiment variant in a split URL test.',
					'planet4-gpch-plugin-optimize'
				) }
				onChange={ () => {
					updateMetaField(
						'_planet4_optimize_post_is_variant',
						! pageIsVariant
					);
				} }
				help={ __(
					'Make sure you have 2 or more pages with this option enabled and exactly the same experiment name. The variant names need to be different.',
					'planet4-gpch-plugin-optimize'
				) }
			/>
			<TextControl
				__nextHasNoMarginBottom
				__next40pxDefaultSize
				label={ __(
					'Experiment Name',
					'planet4-gpch-plugin-optimize'
				) }
				value={ experimentName || '' }
				onChange={ ( value ) => {
					if ( /^[A-Za-z0-9 -]*$/.test( value ) ) {
						updateMetaField(
							'_planet4_optimize_experiment_name',
							value
						);
					} else {
						alert(
							__(
								'Please use only letters, numbers, spaces and dashes.',
								'planet4-gpch-plugin-optimize'
							)
						);
					}
				} }
				help={ __(
					"Used to identify the Optimization in Mixpanel. Feel free to use a readable name. Don't change once the experiment has started!",
					'planet4-gpch-plugin-optimize'
				) }
			/>
			<TextControl
				__nextHasNoMarginBottom
				__next40pxDefaultSize
				label={ __( 'Variant Name', 'planet4-gpch-plugin-optimize' ) }
				value={ variantName || '' }
				onChange={ ( value ) => {
					updateMetaField( '_planet4_optimize_variant_name', value );
				} }
				help={ __(
					"Used to identify the Variant in Mixpanel. Feel free to use a readable name. Don't change once the experiment has started!",
					'planet4-gpch-plugin-optimize'
				) }
			/>
		</>
	);
};

export default PluginMetaFields;

import { __ } from '@wordpress/i18n';
import { percent } from '@wordpress/icons';
import {
	InnerBlocks,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl, TextControl } from '@wordpress/components';

import VariantTargeting from '../../components/VariantTargeting/VariantTargeting';

import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @param {Object}   root0
 * @param {Object}   root0.attributes
 * @param {Function} root0.setAttributes
 * @param {Object}   root0.context
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes, context } ) {
	let { variantId, variantName, targetPercentage, conditionals } = attributes;

	if ( variantId === undefined ) {
		// Generate a random optimizationId
		const chars =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const length = 8;
		variantId = '';

		for ( let i = 0; i < length; i++ ) {
			variantId += chars.charAt(
				Math.floor( Math.random() * chars.length )
			);
		}

		setAttributes( { variantId } );
	}

	if ( variantName === undefined ) {
		variantName = variantId;
	}

	if ( targetPercentage === undefined ) {
		targetPercentage = 50;
	}

	if ( conditionals === undefined ) {
		conditionals = [];
	}

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __(
						'Variant Settings',
						'planet4-gpch-plugin-optimize'
					) }
				>
					<p>
						<b>Variant ID: </b>
						{ variantId || '' }
					</p>
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ __(
							'Variant Name',
							'planet4-gpch-plugin-optimize'
						) }
						value={ variantName || '' }
						onChange={ ( value ) =>
							setAttributes( { variantName: value } )
						}
						help={ __(
							"Used to identify the Variant in Mixpanel. Feel free to use a readable name. Don't change once the experiment has started!",
							'planet4-gpch-plugin-optimize'
						) }
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Targeting', 'planet4-gpch-plugin-optimize' ) }
				>
					<RangeControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label="Target group percentage"
						afterIcon={ percent }
						value={ targetPercentage }
						onChange={ ( value ) =>
							setAttributes( { targetPercentage: value } )
						}
						min={ 0 }
						max={ 100 }
						step={ 1 }
						marks={ [
							{
								value: 25,
								label: '25%',
							},
							{
								value: 50,
								label: '50%',
							},
							{
								value: 75,
								label: '75%',
							},
							{
								value: 100,
								label: '100%',
							},
						] }
						railColor="red"
						trackColor="green"
					/>
				</PanelBody>
				<VariantTargeting
					conditionals={ conditionals }
					setAttributes={ setAttributes }
				/>
			</InspectorControls>
			<div>
				{ attributes.variantId ===
					context[
						'content-optimization/editorSelectedVariantId'
					] && (
					<div { ...useBlockProps() }>
						<InnerBlocks />
					</div>
				) }
			</div>
		</>
	);
}

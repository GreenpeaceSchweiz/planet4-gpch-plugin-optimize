/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	InnerBlocks,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

import { PanelBody, RangeControl, TextControl } from '@wordpress/components';
import { percent } from '@wordpress/icons';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @param {Object}   root0
 * @param {Object}   root0.attributes
 * @param {Function} root0.setAttributes
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { variantName, targetPercentage } = attributes;
	let { variantId } = attributes;

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
			</InspectorControls>
			<div { ...useBlockProps() }>
				<InnerBlocks />
			</div>
		</>
	);
}

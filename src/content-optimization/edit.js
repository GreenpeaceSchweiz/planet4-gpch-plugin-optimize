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

import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';

const INNER_BLOCK_TEMPLATE = [
	[ 'planet4-gpch-ab-testing/variant', { name: 'Variant A' } ],
	[ 'planet4-gpch-ab-testing/variant', { name: 'Variant B' } ],
];

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   root0
 * @param {Object}   root0.attributes
 * @param {Function} root0.setAttributes
 *
 * @return {JSX.Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { status } = attributes;
	let { optimizationId, optimizationName } = attributes;

	if ( optimizationId === undefined ) {
		// Generate a random optimizationId
		const chars =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const length = 16;
		optimizationId = '';

		for ( let i = 0; i < length; i++ ) {
			optimizationId += chars.charAt(
				Math.floor( Math.random() * chars.length )
			);
		}

		setAttributes( { optimizationId } );
	}

	if ( optimizationName === undefined ) {
		optimizationName = optimizationId;
	}

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Settings', 'planet4-gpch-ab-testing' ) }
				>
					<ToggleControl
						checked={ !! status }
						label={ __(
							'Enable/Disable the Optimization',
							'planet4-gpch-ab-testing'
						) }
						onChange={ () =>
							setAttributes( {
								status: ! status,
							} )
						}
						help={ __(
							'Disabling the Optimization will show the first variant to everyone.',
							'planet4-gpch-ab-testing'
						) }
					/>
					<p>
						<b>Optimization ID: </b>
						{ optimizationId || '' }
					</p>
					<TextControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ __(
							'Experiment Name',
							'planet4-gpch-ab-testing'
						) }
						value={ optimizationName || '' }
						onChange={ ( value ) => {
							if ( /^[A-Za-z0-9 -]*$/.test( value ) ) {
								setAttributes( { optimizationName: value } );
							} else {
								alert(
									__(
										'Please use only letters, numbers, spaces and dashes.',
										'planet4-gpch-ab-testing'
									)
								);
							}
						} }
						help={ __(
							"Used to identify the Optimization. Don't change once the experiment has started!",
							'planet4-gpch-ab-testing'
						) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<InnerBlocks template={ INNER_BLOCK_TEMPLATE } />
			</div>
		</>
	);
}

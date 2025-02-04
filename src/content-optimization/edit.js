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

import { PanelBody, ToggleControl } from '@wordpress/components';

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
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { status } = attributes;
	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Settings', 'planet4-gpch-ab-testing' ) }
				>
					<ToggleControl
						checked={ !! status }
						label={ __(
							'Test is running',
							'planet4-gpch-ab-testing'
						) }
						onChange={ () =>
							setAttributes( {
								status: ! status,
							} )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<InnerBlocks template={ INNER_BLOCK_TEMPLATE } />
			</div>
		</>
	);
}

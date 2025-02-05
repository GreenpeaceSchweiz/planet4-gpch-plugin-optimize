/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @param {Object} attributes
 * @param {string} attributes.attributes
 *
 * @return {Element} Element to render.
 */
export default function save( { attributes } ) {
	return (
		<div
			{ ...useBlockProps.save( { className: 'gp-optimize-container' } ) }
			data-status={ attributes.status }
			data-optimization-id={ attributes.optimizationId }
			data-optimization-name={ attributes.optimizationName }
		>
			<InnerBlocks.Content />
		</div>
	);
}

import { __ } from '@wordpress/i18n';

import {
	InnerBlocks,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';

import { useSelect } from '@wordpress/data';

import { plusCircleFilled } from '@wordpress/icons';

import {
	PanelBody,
	TextControl,
	ToggleControl,
	Button,
} from '@wordpress/components';

import variantIcon from '../../icons/variant.js';
import './editor.scss';

const INNER_BLOCK_TEMPLATE = [
	[ 'planet4-gpch-plugin-optimize/variant', { variantName: 'Variant A' } ],
	[ 'planet4-gpch-plugin-optimize/variant', { variantName: 'Variant B' } ],
];

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   root0
 * @param {string}   root0.clientId
 * @param {Object}   root0.attributes
 * @param {Function} root0.setAttributes
 *
 * @return {JSX.Element} Element to render.
 */
export default function Edit( { clientId, attributes, setAttributes } ) {
	const { status } = attributes;
	let { optimizationId, optimizationName, editorSelectedVariantIndex } =
		attributes;

	const innerBlocks = useSelect(
		( select ) => {
			const blockEditor = select( 'core/block-editor' );
			return blockEditor.getBlocks( clientId );
		},
		[ clientId ]
	);

	const handleVariantSelection = ( index ) => {
		for ( const [ i, innerBlock ] of innerBlocks.entries() ) {
			if ( i === index ) {
				setAttributes( {
					editorSelectedVariantId: innerBlock.attributes.variantId,
					editorSelectedVariantIndex: i,
				} );

				wp.data
					.dispatch( 'core/block-editor' )
					.selectBlock( innerBlock.clientId );
			}
		}
	};

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
					title={ __( 'Settings', 'planet4-gpch-plugin-optimize' ) }
				>
					<ToggleControl
						checked={ !! status }
						label={ __(
							'Enable/Disable the Optimization',
							'planet4-gpch-plugin-optimize'
						) }
						onChange={ () =>
							setAttributes( {
								status: ! status,
							} )
						}
						help={ __(
							'Disabling the Optimization will show the first variant to everyone.',
							'planet4-gpch-plugin-optimize'
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
							'planet4-gpch-plugin-optimize'
						) }
						value={ optimizationName || '' }
						onChange={ ( value ) => {
							if ( /^[A-Za-z0-9 -]*$/.test( value ) ) {
								setAttributes( { optimizationName: value } );
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
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<div className="variant-selector-container">
					<p className={ 'optimization-info' }>
						<strong>
							{ __(
								'Content Optimization:',
								'planet4-gpch-plugin-optimize'
							) }{ ' ' }
							{ optimizationName }
						</strong>
						{ optimizationName === optimizationId && (
							<span>
								{ __(
									'(Feel free to set a human redable name!)',
									'planet4-gpch-plugin-optimize'
								) }
							</span>
						) }
					</p>
					<div className="variant-buttons">
						{ innerBlocks.length > 0 ? (
							innerBlocks.map( ( block, index ) => (
								<Button
									__next40pxDefaultSize
									variant={ 'secondary' }
									icon={ variantIcon }
									iconSize={ 20 }
									key={ index }
									className={ `variant-button ${
										editorSelectedVariantIndex === index
											? 'is-active'
											: ''
									}` }
									onClick={ () =>
										handleVariantSelection( index )
									}
								>
									{ block.attributes.variantName }
								</Button>
							) )
						) : (
							<></>
						) }
						<Button
							__next40pxDefaultSize
							variant={ 'primary' }
							icon={ plusCircleFilled }
							className="add-variant-button"
							onClick={ () => {
								const newBlock = wp.blocks.createBlock(
									'planet4-gpch-plugin-optimize/variant',
									{
										variantName: `Variant ${
											innerBlocks.length + 1
										}`,
									}
								);

								wp.data
									.dispatch( 'core/editor' )
									.insertBlock(
										newBlock,
										innerBlocks.length,
										clientId
									);
							} }
						>
							{ __(
								'Add Variant',
								'planet4-gpch-plugin-optimize'
							) }
						</Button>
					</div>
					{ status !== true && (
						<p className={ 'optimization-disabled' }>
							{ __(
								'This content optimization is disabled. The website shows the first variant.',
								'planet4-gpch-plugin-optimize'
							) }
						</p>
					) }
				</div>
				<div className="variant-content">
					<InnerBlocks template={ INNER_BLOCK_TEMPLATE } />
				</div>
			</div>
		</>
	);
}

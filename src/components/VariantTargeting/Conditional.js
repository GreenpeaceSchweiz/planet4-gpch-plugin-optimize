import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Button, SelectControl, TextControl } from '@wordpress/components';
import { edit, closeSmall } from '@wordpress/icons';

import './Conditional.css';

const Conditional = ( {
	index,
	conditional,
	onSaveConditionals,
	onRemoveConditional,
} ) => {
	const [ type, setType ] = useState( 'url_parameter' );
	const [ typeSelection, setTypeSelection ] = useState();
	const [ conditionalKey, setConditionalKey ] = useState(
		conditional.conditionalKey || ''
	);
	const [ operator, setOperator ] = useState( conditional.operator ?? 'is' );
	const [ value, setValue ] = useState( conditional.value ?? '' );

	const [ showDetails, setShowDetails ] = useState(
		conditional.showDetails ?? false
	);

	// Initialize typeSelection
	if ( typeof typeSelection === 'undefined' ) {
		if ( conditionalKey === 'utm_medium' ) {
			setTypeSelection( 'utm_medium' );
		} else if ( conditionalKey === 'utm_source' ) {
			setTypeSelection( 'utm_source' );
		} else if ( conditionalKey === 'utm_campaign' ) {
			setTypeSelection( 'utm_campaign' );
		}
	}

	const onTypeSelection = ( selected ) => {
		// Handle presets
		if ( selected === 'utm_medium' ) {
			setType( 'url_parameter' );
			setTypeSelection( selected );
			setConditionalKey( 'utm_medium' );
		} else if ( selected === 'utm_source' ) {
			setType( 'url_parameter' );
			setTypeSelection( selected );
			setConditionalKey( 'utm_source' );
		} else if ( selected === 'utm_campaign' ) {
			setType( 'url_parameter' );
			setTypeSelection( selected );
			setConditionalKey( 'utm_campaign' );
		} else {
			setTypeSelection( selected );
			setType( selected );
		}
	};

	const onSaveConditional = () => {
		setShowDetails( false );
		onSaveConditionals( {
			index,
			type,
			conditionalKey,
			operator,
			value,
			showDetails: false,
		} );
	};

	return (
		<>
			{ showDetails === false && (
				<div className="conditional-container">
					<div className="buttons">
						<Button
							onClick={ () => setShowDetails( true ) }
							variant="link"
							icon={ edit }
							size="small"
							iconSize={ 20 }
						></Button>
						<Button
							onClick={ () => onRemoveConditional( index ) }
							variant="link"
							icon={ closeSmall }
							size="small"
							iconSize={ 20 }
						></Button>
					</div>
					<div className="info">
						{ type === 'url_parameter' && (
							<>
								<p>
									{ typeSelection === 'utm_medium' &&
										__(
											'UTM Medium in URL:',
											'planet4-gpch-plugin-optimize'
										) }
									{ typeSelection === 'utm_source' &&
										__(
											'UTM Source in URL:',
											'planet4-gpch-plugin-optimize'
										) }
									{ typeSelection === 'utm_campaign' &&
										__(
											'UTM Campaign in URL:',
											'planet4-gpch-plugin-optimize'
										) }
									{ typeSelection === 'url_parameter' &&
										__(
											'URL Parameter:',
											'planet4-gpch-plugin-optimize'
										) }
								</p>
								<p>
									<code>{ conditionalKey }</code>
									<span>
										{ operator === 'is' && ' == ' }
										{ operator === 'is_not' && ' != ' }
										{ operator === 'contains' &&
											' contains ' }
										{ operator === 'does_not_contain' &&
											' does not contain ' }
									</span>
									<code>{ value }</code>
								</p>
							</>
						) }
					</div>
				</div>
			) }
			{ showDetails === true && (
				<div className="conditional-container">
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __(
							'Force this variant when',
							'planet4-gpch-plugin-optimize'
						) }
						onChange={ onTypeSelection }
						options={ [
							{
								label: __(
									'Query parameter in URL',
									'planet4-gpch-plugin-optimize'
								),
								value: 'url_parameter',
							},
							{
								label: __(
									'utm_medium in URL',
									'planet4-gpch-plugin-optimize'
								),
								value: 'utm_medium',
							},
							{
								label: __(
									'utm_source in URL',
									'planet4-gpch-plugin-optimize'
								),
								value: 'utm_source',
							},
							{
								label: __(
									'utm_campaign in URL',
									'planet4-gpch-plugin-optimize'
								),
								value: 'utm_campaign',
							},
						] }
						value={ typeSelection }
					/>
					<div className="conditional-details">
						{ typeSelection !== 'utm_medium' &&
							typeSelection !== 'utm_source' &&
							typeSelection !== 'utm_campaign' && (
								<TextControl
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									label={ __(
										'Key',
										'planet4-gpch-plugin-optimize'
									) }
									onChange={ setConditionalKey }
									value={ conditionalKey }
								/>
							) }
						<SelectControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __(
								'Operator',
								'planet4-gpch-plugin-optimize'
							) }
							onChange={ setOperator }
							value={ operator }
							options={ [
								{
									label: __(
										'is (==)',
										'planet4-gpch-plugin-optimize'
									),
									value: 'is',
								},
								{
									label: __(
										'is not (!=)',
										'planet4-gpch-plugin-optimize'
									),
									value: 'is_not',
								},
								{
									label: __(
										'contains',
										'planet4-gpch-plugin-optimize'
									),
									value: 'contains',
								},
								{
									label: __(
										'does not contain',
										'planet4-gpch-plugin-optimize'
									),
									value: 'does_not_contain',
								},
							] }
						/>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __(
								'Value',
								'planet4-gpch-plugin-optimize'
							) }
							onChange={ setValue }
							value={ value }
						/>
						<Button
							onClick={ () => onSaveConditional() }
							variant="primary"
						>
							{ __( 'Save', 'planet4-gpch-plugin-optimize' ) }
						</Button>
						<Button
							onClick={ () => onRemoveConditional( index ) }
							variant="secondary"
							isDestructive
						>
							{ __( 'Remove', 'planet4-gpch-plugin-optimize' ) }
						</Button>
					</div>
				</div>
			) }
		</>
	);
};

export default Conditional;

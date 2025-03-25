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
	const [ conditionalKey, setConditionalKey ] = useState(
		conditional.conditionalKey || ''
	);
	const [ operator, setOperator ] = useState( conditional.operator ?? 'is' );
	const [ value, setValue ] = useState( conditional.value ?? '' );

	const [ showDetails, setShowDetails ] = useState(
		conditional.showDetails ?? false
	);

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
								<p>URL Parameter:</p>
								<p>
									<code>{ conditionalKey }</code>
									<span>
										{ operator === 'is' && ' == ' }
										{ operator === 'is-not' && ' != ' }
										{ operator === 'contains' &&
											' contains ' }
										{ operator === 'does-not-contain' &&
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
						onChange={ setType }
						options={ [
							{
								label: __(
									'Query parameter in URL',
									'planet4-gpch-plugin-optimize'
								),
								value: 'url_parameter',
							},
						] }
					/>
					<div className="conditional-details">
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
									value: 'is-not',
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
									value: 'does-not-contain',
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

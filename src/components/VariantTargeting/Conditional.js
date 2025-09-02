import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Button, SelectControl, TextControl } from '@wordpress/components';
import { edit, closeSmall } from '@wordpress/icons';

import './Conditional.css';

/**
 * A functional component to manage conditionals within the UI.
 *
 * @param {Object}   props                     The properties passed to the component.
 * @param {number}   props.index               The index of the conditional in the list.
 * @param {Object}   props.conditional         The object representing the conditional state, including keys like `conditionalKey`, `operator`, and `value`.
 * @param {Function} props.onSaveConditionals  A callback function triggered when the conditional is saved.
 * @param {Function} props.onRemoveConditional A callback function triggered when the conditional is removed.
 * @return {JSX.Element}                       A React component that renders the conditional UI with editable fields for type, key, operator, and value.
 */
const Conditional = ( {
	index,
	conditional,
	onSaveConditionals,
	onRemoveConditional,
} ) => {
	/**
	 * Type of the conditional. E.g.  url_parameter, local_storage
	 */
	const [ type, setType ] = useState( conditional.type ?? 'url_parameter' );

	/**
	 * Helper for the UI, allows for selecting types with a preset
	 */
	const [ typeSelection, setTypeSelection ] = useState(
		conditional.typeSelection ?? null
	);

	/**
	 * Name in the storage, e.g. the name in LocalStorage, SessionStorage or cookie name
	 */
	const [ nameInStorage, setNameInStorage ] = useState(
		conditional.nameInStorage ?? 'gp_optimize_data'
	);

	/**
	 * Data type, e.g. string, object, comma_separated
	 */
	const [ dataType, setDataType ] = useState(
		conditional.dataType ?? 'string'
	);

	/**
	 * Key of the URL parameter or object (depending on dataType) with the targeting data
	 */
	const [ conditionalKey, setConditionalKey ] = useState(
		conditional.conditionalKey ?? ''
	);

	/**
	 * Operator to compare the value against the conditionalKey. E.g. is, is_not, contains, does_not_contain
	 */
	const [ operator, setOperator ] = useState( conditional.operator ?? 'is' );

	/**
	 * Value to look for in the conditionalKey of the targeting data
	 */
	const [ value, setValue ] = useState( conditional.value ?? '' );

	/**
	 * State of the conditional in the UI
	 */
	const [ showDetails, setShowDetails ] = useState(
		conditional.showDetails ?? false
	);

	/**
	 * Handles type selection and sets preset values.
	 *
	 * @param {string} selected - The selected value used to determine the type and conditional key.
	 */
	const onTypeSelection = ( selected ) => {
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

	/**
	 * Handles saving conditionals
	 */
	const onSaveConditional = () => {
		setShowDetails( false );
		onSaveConditionals( {
			index,
			type,
			typeSelection,
			nameInStorage,
			dataType,
			conditionalKey,
			operator,
			value,
			showDetails: false,
		} );
	};

	/**
	 * Defines when the key field is shown in the UI
	 *
	 * @return {boolean} Whether or not to display the "key" field.
	 */
	const showKeyField = () => {
		if (
			( typeSelection === 'local_storage' && dataType === 'string' ) ||
			( typeSelection === 'local_storage' &&
				dataType === 'comma_separated' ) ||
			( typeSelection === 'session_storage' && dataType === 'string' ) ||
			( typeSelection === 'session_storage' &&
				dataType === 'comma_separated' ) ||
			typeSelection === 'utm_medium' ||
			typeSelection === 'utm_source' ||
			typeSelection === 'utm_campaign'
		) {
			return false;
		}

		return true;
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
						<>
							<p>
								<b>
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
									{ typeSelection === 'local_storage' &&
										__(
											'LocalStorage:',
											'planet4-gpch-plugin-optimize'
										) }
									{ typeSelection === 'session_storage' &&
										__(
											'SessionStorage:',
											'planet4-gpch-plugin-optimize'
										) }
								</b>
							</p>
							{ ( typeSelection === 'local_storage' ||
								typeSelection === 'session_storage' ) && (
								<p>
									{ __(
										'Name in storage:',
										'planet4-gpch-plugin-optimize'
									) }{ ' ' }
									<code>{ nameInStorage }</code> ({ dataType }
									)
								</p>
							) }
							<p>
								{ conditionalKey !== '' &&
									operator !== 'exists' &&
									operator !== 'does_not_exist' && (
										<code>{ conditionalKey }</code>
									) }
								<span>
									{ operator === 'is' && ' == ' }
									{ operator === 'is_not' && ' != ' }
									{ operator === 'contains' && ' contains ' }
									{ operator === 'does_not_contain' &&
										' does not contain ' }
									{ operator === 'exists' && ' exists ' }
									{ operator === 'does_not_exist' &&
										' does not exist' }
								</span>
								{ operator !== 'exists' &&
									operator !== 'does_not_exist' && (
										<code>{ value }</code>
									) }
							</p>
						</>
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
							{
								label: __(
									'Data in LocalStorage',
									'planet4-gpch-plugin-optimize'
								),
								value: 'local_storage',
							},
							{
								label: __(
									'Data in SessionStorage',
									'planet4-gpch-plugin-optimize'
								),
								value: 'session_storage',
							},
						] }
						value={ typeSelection }
					/>
					{ ( typeSelection === 'local_storage' ||
						typeSelection === 'session_storage' ) && (
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __(
								'Name in Storage',
								'planet4-gpch-plugin-optimize'
							) }
							onChange={ setNameInStorage }
							value={ nameInStorage }
						/>
					) }
					<div className="conditional-details">
						{ ( typeSelection === 'local_storage' ||
							typeSelection === 'session_storage' ) && (
							<SelectControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __(
									'Data type',
									'planet4-gpch-plugin-optimize'
								) }
								onChange={ setDataType }
								options={ [
									{
										label: __(
											'String',
											'planet4-gpch-plugin-optimize'
										),
										value: 'string',
									},
									{
										label: __(
											'Comma separated list',
											'planet4-gpch-plugin-optimize'
										),
										value: 'comma_separated',
									},
									{
										label: __(
											'Object',
											'planet4-gpch-plugin-optimize'
										),
										value: 'object',
									},
								] }
								value={ dataType }
							/>
						) }
						{ showKeyField() && (
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
								...( dataType !== 'comma_separated'
									? [
											{
												label: __(
													'is (==)',
													'planet4-gpch-plugin-optimize'
												),
												value: 'is',
											},
									  ]
									: [] ),
								...( dataType !== 'comma_separated'
									? [
											{
												label: __(
													'is not (!=)',
													'planet4-gpch-plugin-optimize'
												),
												value: 'is_not',
											},
									  ]
									: [] ),
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
								{
									label: __(
										'exists',
										'planet4-gpch-plugin-optimize'
									),
									value: 'exists',
								},
								{
									label: __(
										'does not exist',
										'planet4-gpch-plugin-optimize'
									),
									value: 'does_not_exist',
								},
							] }
						/>
						{ operator !== 'exists' &&
							operator !== 'does_not_exist' && (
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
							) }
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

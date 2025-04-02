import { __ } from '@wordpress/i18n';
import { PanelBody, Button } from '@wordpress/components';
import { plus } from '@wordpress/icons';
import { useState } from '@wordpress/element';

import './VariantTargeting.css';
import Conditional from './Conditional';

const VariantTargeting = ( { conditionals, setAttributes } ) => {
	const [ conditionalsCount, setConditionalsCount ] = useState( 0 );

	const onAddConditional = () => {
		const newConditional = { showDetails: true };
		setAttributes( { conditionals: [ ...conditionals, newConditional ] } );

		setConditionalsCount( conditionalsCount + 1 );
	};

	const onSaveConditionals = ( data ) => {
		conditionals[ data.index ] = data;
	};

	const onRemoveConditional = ( index ) => {
		// new conditionals array with the conditional at index removed
		const updatedConditionals = conditionals.filter(
			( _, conditionalIndex ) => conditionalIndex !== index
		);

		setAttributes( { conditionals: updatedConditionals } );
		setConditionalsCount( updatedConditionals.length );
	};

	return (
		<>
			<PanelBody>
				<p>
					<b>
						{ __(
							'Force this variant when either',
							'planet4-gpch-plugin-optimize'
						) }
					</b>
				</p>
				<div className="conditionals-container">
					{ conditionals.map( ( conditional, index ) => (
						<Conditional
							key={ index }
							index={ index }
							conditional={ conditional }
							onSaveConditionals={ onSaveConditionals }
							onRemoveConditional={ onRemoveConditional }
						/>
					) ) }
				</div>
				<Button
					__next40pxDefaultSize
					variant={ 'secondary' }
					icon={ plus }
					iconSize={ 20 }
					className={ 'add-conditional-button' }
					onClick={ () => onAddConditional() }
				>
					{ __( 'Add Condition', 'planet4-gpch-plugin-optimize' ) }
				</Button>
			</PanelBody>
		</>
	);
};

export default VariantTargeting;

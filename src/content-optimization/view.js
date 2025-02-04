const OptimizationFrontend = () => {
	const optimizationBlocks = document.querySelectorAll(
		'.gp-optimize-container'
	);

	// TODO: Check if optimization is enabled

	optimizationBlocks.forEach( ( optimizationBlock ) => {
		const variants = optimizationBlock.querySelectorAll(
			'.gp-optimize-variant'
		);

		console.log( variants );
	} );
};

OptimizationFrontend();

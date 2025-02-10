/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import metadata from './block.json';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {
	icon: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="icon"
			viewBox="0 0 1024 1024"
		>
			<g fill="#131313">
				<path d="M1009.45 1022.88H738.325V95.23c0-14.565 5.602-28.009 15.685-38.092 10.084-10.083 23.528-15.685 38.092-15.685h162.451c30.25 0 53.777 24.648 53.777 53.777v927.65zm-226.31-44.814h181.496V95.23c0-5.602-4.481-8.963-8.963-8.963h-162.45c-3.361 0-5.602 1.12-6.722 2.24-1.12 1.121-2.241 3.362-2.241 6.723v882.836zM644.216 1024H374.212V318.18c0-28.01 22.407-49.296 50.415-49.296h171.414c28.009 0 50.416 22.407 50.416 49.295V1024zm-225.19-44.814h181.496V318.179c0-2.24-2.24-4.481-5.601-4.481H423.507c-2.24 0-5.602 2.24-5.602 4.481v661.007zm-134.442 43.694H13.459V534.407c0-24.648 20.166-44.814 44.814-44.814H239.77c24.647 0 44.814 20.166 44.814 44.814v488.473zM58.273 978.066H239.77V534.407H58.273v443.659zm323.485-739.838c-11.966-2.95-19.342-15.153-16.393-27.119l27.618-112.042-113.13-27.886c-11.965-2.95-19.342-15.153-16.393-27.119 2.95-11.966 15.153-19.342 27.119-16.393l155.554 38.344-38.344 155.554c-1.862 12.234-14.065 19.61-26.03 16.661z" />
				<path d="M83.356 306.6c-5.439-1.34-10.341-4.857-13.62-10.28-6.557-10.848-3.34-23.901 7.508-30.458L408.36 64.779c10.847-6.557 23.9-3.34 30.458 7.508 6.557 10.847 3.34 23.9-7.508 30.458L100.194 303.827c-5.423 3.28-11.399 4.114-16.838 2.773z" />
			</g>
		</svg>
	),

	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * @see ./save.js
	 */
	save,
} );

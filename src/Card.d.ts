export default Card;
/**
 * @param {Stack} stack
 * @param {HTMLElement} targetElement
 * @param {boolean} prepend
 * @returns {object} An instance of Card.
 */
declare function Card(stack: Stack, targetElement: HTMLElement, prepend: boolean): object;
declare namespace Card {
    /**
     * Creates a configuration object.
     *
     * @param {object} config
     * @returns {object}
     */
    function makeConfig(config?: object): object;
    /**
     * Uses CSS transform to translate element position and rotation.
     *
     * Invoked in the event of `dragmove` and every time the physics solver is triggered.
     *
     * @param {HTMLElement} element
     * @param {number} coordinateX Horizontal offset from the startDrag.
     * @param {number} coordinateY Vertical offset from the startDrag.
     * @param {number} rotation
     * @returns {undefined}
     */
    function transform(element: HTMLElement, coordinateX: number, coordinateY: number, rotation: number): undefined;
    /**
     * Append element to the parentNode.
     *
     * This makes the element first among the siblings. The reason for using
     * this as opposed to zIndex is to allow CSS selector :nth-child.
     *
     * Invoked in the event of mousedown.
     * Invoked when card is added to the stack.
     *
     * @param {HTMLElement} element The target element.
     * @returns {undefined}
     */
    function appendToParent(element: HTMLElement): undefined;
    /**
     * Prepend element to the parentNode.
     *
     * This makes the element last among the siblings.
     *
     * Invoked when card is added to the stack (when prepend is true).
     *
     * @param {HTMLElement} element The target element.
     * @returns {undefined}
     */
    function prependToParent(element: HTMLElement): undefined;
    /**
     * Returns a value between 0 and 1 indicating the completeness of the throw out condition.
     *
     * Ration of the absolute distance from the original card position and element width.
     *
     * @param {number} xOffset Distance from the dragStart.
     * @param {number} yOffset Distance from the dragStart.
     * @param {HTMLElement} element Element.
     * @returns {number}
     */
    function throwOutConfidence(xOffset: number, yOffset: number, element: HTMLElement): number;
    /**
     * Determines if element is being thrown out of the stack.
     *
     * Element is considered to be thrown out when throwOutConfidence is equal to 1.
     *
     * @param {number} xOffset Distance from the dragStart.
     * @param {number} yOffset Distance from the dragStart.
     * @param {HTMLElement} element Element.
     * @param {number} throwOutConfidence config.throwOutConfidence
     * @returns {boolean}
     */
    function isThrowOut(xOffset: number, yOffset: number, element: HTMLElement, throwOutConfidence: number): boolean;
    /**
     * Calculates a distances at which the card is thrown out of the stack.
     *
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    function throwOutDistance(min: number, max: number): number;
    /**
     * Calculates rotation based on the element x and y offset, element width and maxRotation variables.
     *
     * @param {number} coordinateX Horizontal offset from the startDrag.
     * @param {number} coordinateY Vertical offset from the startDrag.
     * @param {HTMLElement} element Element.
     * @param {number} maxRotation
     * @returns {number} Rotation angle expressed in degrees.
     */
    function rotation(coordinateX: number, coordinateY: number, element: HTMLElement, maxRotation: number): number;
    let THROW_IN: string;
    let THROW_OUT: string;
}

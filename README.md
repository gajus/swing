# Swing

A card swiping interface. The swipe-left/swipe-right for yes/no input. As seen in apps like [Jelly](http://jelly.co/) and [Tinder](http://www.gotinder.com/), and [many others](http://www.saydaily.com/2014/09/tinder-swipe-and-media).

![Card stack example.](./.readme/card-stack.gif)

## Quick Start

```js
var stack,
    cards;

// Prepare the cards in the stack for iteration.
cards = [].slice.call(document.querySelectorAll('.stack li'))

// An instance of the Stack is used to attach event listeners.
stack = new Swing.Stack();

cards.forEach(function (targetElement) {
    // Add card element to the Stack.
    stack.createCard(targetElement);
});

// Add event listener for when a card is thrown out of the stack.
stack.on('throwout', function (e) {
    // e.target Reference to the element that has been thrown out of the stack.
    // e.throwDirection Direction in which the element has been thrown (1 right, -1 left).

    console.log('Card has been thrown out of the stack.');
    console.log('Throw direction: ' + (e.throwDirection == 1 ? 'right' : 'left'));
});

// Add event listener for when a card is thrown in the stack.
stack.on('snapback', function (e) {
    console.log('Card has snapped back to the stack.');
});
```

## Usage Examples

* [Card stack](http://gajus.com/sandbox/swing/examples/card-stack/).

The code for all of the examples is in the [./examples/](https://github.com/gajus/swing/tree/master/examples/) folder.

[Raise an issue](https://github.com/gajus/swing/issues) if you are missing an example.

## Events

Use an instance of the `Swing.Stack` to attach event listeners, e.g.

```js
var stack;

stack = stack = new Swing.Stack();

stack.on('throwout', function () {});
```

| Name | Description |
| --- | --- |
| `throwout` | When card has been thrown out of the stack. |
| `throwin` | When card has been thrown in to the stack. This includes the spring back into place effect. |
| `dragstart` | Hammer [panstart](http://hammerjs.github.io/recognizer-pan/). |
| `dragmove` | Hammer [panmove](http://hammerjs.github.io/recognizer-pan/). |
| `dragend` | Hammer [panend](http://hammerjs.github.io/recognizer-pan/). |

### Event Object

Event listener is invoked with a single `eventObject` parameter.

```js
var stack;

stack = stack = new Swing.Stack();

stack.on('throwout', function (eventObject) {});
```

| Name | Value |
| --- | --- |
| `target` | The element being dragged. |
| `direction` | The direction in which the element is being dragged: `Card.DIRECTION_LEFT` or `Card.DIRECTION_RIGHT`. |

## Dependencies

If you are using the `./dist/` version, you do not need to download the dependencies.

The list of the dependencies and description of their role is for your reference only.

* [Rebound](http://facebook.github.io/rebound-js/docs/rebound.html) to drive physical animations. Notice how if you drag too little and let go, the cards spring back into place.
* [Hammer](http://hammerjs.github.io/) to handle drag interactions.

## Todo

* Animate the card stack underneath the current card.
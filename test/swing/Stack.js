/* eslint-disable max-nested-callbacks */

import test from 'ava';
import sinon from 'sinon';
import Stack from "../../src/Stack.js";
import Direction from '../../src/Direction.js';

test('getCard() returns card associated with an element', (t) => {
  const stack = Stack();

  const parentElement = global.document.createElement('div');
  const element = global.document.createElement('div');

  parentElement.append(element);

  const card = stack.createCard(element);

  t.is(stack.getCard(element), card);
});

test('getCard() returns null when element is not associated with a card', (t) => {
  const stack = Stack();

  const element = global.document.createElement('div');

  t.is(stack.getCard(element), null);
});

test('destroyCard() is called when Card is destroyed', (t) => {
  const stack = Stack();

  const parentElement = global.document.createElement('div');
  const element = global.document.createElement('div');
  const spy = sinon.spy(stack, 'destroyCard');

  parentElement.append(element);

  const card = stack.createCard(element);

  card.destroy();

  t.is(spy.calledWith(card), true);
});

const setupEnvironment = (config = {}) => {
  const parentElement = global.document.createElement('div');
  const cardElement = global.document.createElement('div');

  config.targetElementWidth = 100;
  config.targetElementHeight = 100;

  const stack = Stack(config);

  parentElement.append(cardElement);

  const card = stack.createCard(cardElement);

  return {
    card,
    cardElement,
    stack,
  };
};

test('getConfig() returns the config object', (t) => {
  const configInput = {};

  const stack = Stack(configInput);

  t.deepEqual(stack.getConfig(), configInput);
});

test('isThrowOut is invoked in the event of dragend', (t) => {
  const spy = sinon.spy();

  const environment = setupEnvironment({
    isThrowOut: spy,
  });

  t.false(spy.called);

  environment.card.trigger('mousedown');

  t.false(spy.called);

  environment.card.trigger('panmove', {
    deltaX: 10,
    deltaY: 10,
  });

  t.false(spy.called);

  environment.card.trigger('panend', {
    deltaX: 10,
    deltaY: 10,
  });

  t.true(spy.called);
});

test('determintes thrownOut event (true)', (t) => {
  const environment = setupEnvironment({
    allowedDirections: [
      Direction.UP,
      Direction.DOWN,
      Direction.LEFT,
      Direction.RIGHT,
    ],
    isThrowOut: () => {
      return true;
    },
  });

  const spy1 = sinon.spy();
  const spy2 = sinon.spy();

  environment.card.on('throwout', spy1);
  environment.card.on('throwin', spy2);

  environment.card.trigger('mousedown');
  environment.card.trigger('panmove', {
    deltaX: 10,
    deltaY: 10,
  });
  environment.card.trigger('panend', {
    deltaX: 10,
    deltaY: 10,
  });

  t.true(spy1.called);
  t.false(spy2.called);
});

test('determintes thrownOut event (false)', (t) => {
  const environment = setupEnvironment({
    allowedDirections: [
      Direction.UP,
      Direction.DOWN,
      Direction.LEFT,
      Direction.RIGHT,
    ],
    isThrowOut: () => {
      return false;
    },
  });

  const spy1 = sinon.spy();
  const spy2 = sinon.spy();

  environment.card.on('throwout', spy1);
  environment.card.on('throwin', spy2);

  environment.card.trigger('mousedown');
  environment.card.trigger('panmove', {
    deltaX: 10,
    deltaY: 10,
  });
  environment.card.trigger('panend', {
    deltaX: 10,
    deltaY: 10,
  });

  t.false(spy1.called);
  t.true(spy2.called);
});

test.cb('throwOutConfidence is invoked in the event of dragmove', (t) => {
  const spy = sinon.spy();

  const environment = setupEnvironment({
    throwOutConfidence: spy,
  });

  environment.card.on('throwout', spy);

  environment.card.trigger('panstart');
  environment.card.trigger('panmove', {
    deltaX: 10,
    deltaY: 10,
  });

  setTimeout(() => {
    environment.card.trigger('panmove', {
      deltaX: 11,
      deltaY: 10,
    });
  }, 10);

  setTimeout(() => {
    environment.card.trigger('panmove', {
      deltaX: 12,
      deltaY: 10,
    });
  }, 20);

  // Timeout is required to accommodate requestAnimationFrame.
  setTimeout(() => {
    t.is(spy.callCount, 3);

    t.end();
  }, 30);
});

test.cb('rotation is invoked in the event of dragmove', (t) => {
  const spy = sinon.spy();
  const environment = setupEnvironment({
    rotation: spy,
  });

  environment.card.on('rotation', spy);

  environment.card.trigger('panstart');
  environment.card.trigger('panmove', {
    deltaX: 10,
    deltaY: 10,
  });

  setTimeout(() => {
    environment.card.trigger('panmove', {
      deltaX: 11,
      deltaY: 10,
    });
  }, 10);

  setTimeout(() => {
    environment.card.trigger('panmove', {
      deltaX: 12,
      deltaY: 10,
    });
  }, 20);

  setTimeout(() => {
    t.is(spy.callCount, 3);

    t.end();
  }, 30);
});

test.cb('transform is invoked in the event of dragmove', (t) => {
  const spy = sinon.spy();
  const environment = setupEnvironment({transform: spy});

  environment.card.on('transform', spy);

  environment.card.trigger('panstart');
  environment.card.trigger('panmove', {
    deltaX: 10,
    deltaY: 10,
  });

  setTimeout(() => {
    environment.card.trigger('panmove', {
      deltaX: 11,
      deltaY: 10,
    });
  }, 10);

  setTimeout(() => {
    environment.card.trigger('panmove', {
      deltaX: 12,
      deltaY: 10,
    });
  }, 20);

  setTimeout(() => {
    t.is(spy.callCount, 3);

    t.end();
  }, 30);
});

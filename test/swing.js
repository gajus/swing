import {
    expect
} from 'chai';

import sinon from 'sinon';
import jsdom from 'jsdom';

describe('DOM', () => {
    beforeEach(() => {
        global.document = jsdom.jsdom(`
            <!DOCTYPE html>
            <html>
            <head>
            </head>
            <body>
            </body>
            </html>
        `);

        global.window = document.defaultView;
        global.navigator = {};
    });

    describe('Stack', () => {
        let stack,
            Swing;

        beforeEach(() => {
            Swing = require('./../src');
            stack = Swing.Stack();
        });

        describe('.getCard()', () => {
            it('returns card associated with an element', () => {
                let card,
                    element,
                    parentElement;

                parentElement = global.document.createElement('div');
                element = global.document.createElement('div');

                parentElement.appendChild(element);

                card = stack.createCard(element);

                expect(stack.getCard(element)).to.equal(card);
            });
            it('returns null when element is not associated with a card', () => {
                let element;

                element = global.document.createElement('div');

                expect(stack.getCard(element)).to.equal(null);
            });
        });
        describe('.destroyCard()', () => {
            it('is called when Card is destroyed', () => {
                let card,
                    element,
                    parentElement,
                    spy;

                parentElement = global.document.createElement('div');
                element = global.document.createElement('div');
                spy = sinon.spy(stack, 'destroyCard');

                parentElement.appendChild(element);

                card = stack.createCard(element);
                card.destroy();

                expect(spy.calledWith(card)).to.equal(true);
            });
        });

        describe('.getConfig()', () => {
            let setupEnv;

            beforeEach(() => {
                setupEnv = (config = {}) => {
                    let card,
                        cardElement,
                        parentElement,
                        stack;

                    parentElement = global.document.createElement('div');
                    cardElement = global.document.createElement('div');

                    config.targetElementWidth = 100;
                    config.targetElementHeight = 100;

                    stack = Swing.Stack(config);

                    parentElement.appendChild(cardElement);

                    card = stack.createCard(cardElement);

                    return {
                        stack,
                        card,
                        cardElement
                    };
                };
            });
            it('returns the config object', () => {
                let configInput,
                    stack;

                configInput = {};
                stack = Swing.Stack(configInput);

                expect(stack.getConfig()).to.equal(configInput);
            });
            describe('isThrowOut', () => {
                it('is invoked in the event of dragend', () => {
                    let env,
                        spy;

                    spy = sinon.spy();
                    env = setupEnv({isThrowOut: spy});

                    expect(spy.called).to.equal(false);
                    env.card.trigger('mousedown');
                    expect(spy.called).to.equal(false);
                    env.card.trigger('panmove', {deltaX: 10, deltaY: 10});
                    expect(spy.called).to.equal(false);
                    env.card.trigger('panend', {deltaX: 10, deltaY: 10});
                    expect(spy.called).to.equal(true);
                });
                [true, false].forEach((throwOut) => {
                    it('determines throwOut event', () => {
                        let env,
                            spy1,
                            spy2;

                        env = setupEnv({isThrowOut: () => {
                            return throwOut;
                        }});
                        spy1 = sinon.spy();
                        spy2 = sinon.spy();

                        env.card.on('throwout', spy1);
                        env.card.on('throwin', spy2);

                        env.card.trigger('mousedown');
                        env.card.trigger('panmove', {deltaX: 10, deltaY: 10});
                        env.card.trigger('panend', {deltaX: 10, deltaY: 10});

                        if (throwOut) {
                            expect(spy1.called).to.equal(true);
                            expect(spy2.called).to.equal(false);
                        } else {
                            expect(spy1.called).to.equal(false);
                            expect(spy2.called).to.equal(true);
                        }
                    });
                });
            });
            describe('throwOutConfidence', () => {
                it('is invoked in the event of dragmove', (done) => {
                    let env,
                        spy;

                    spy = sinon.spy();
                    env = setupEnv({throwOutConfidence: spy});

                    env.card.on('throwout', spy);

                    env.card.trigger('panstart');
                    env.card.trigger('panmove', {deltaX: 10, deltaY: 10});

                    setTimeout(() => {
                        env.card.trigger('panmove', {deltaX: 11, deltaY: 10});
                    }, 10);

                    setTimeout(() => {
                        env.card.trigger('panmove', {deltaX: 12, deltaY: 10});
                    }, 20);

                    // Timeout is required to accommodate requestAnimationFrame.
                    setTimeout(() => {
                        expect(spy.callCount).to.equal(3);

                        done();
                    }, 30);
                });
            });
            describe('rotation', () => {
                it('is invoked in the event of dragmove', (done) => {
                    let env,
                        spy;

                    spy = sinon.spy();
                    env = setupEnv({rotation: spy});

                    env.card.on('rotation', spy);

                    env.card.trigger('panstart');
                    env.card.trigger('panmove', {deltaX: 10, deltaY: 10});

                    setTimeout(() => {
                        env.card.trigger('panmove', {deltaX: 11, deltaY: 10});
                    }, 10);

                    setTimeout(() => {
                        env.card.trigger('panmove', {deltaX: 12, deltaY: 10});
                    }, 20);

                    setTimeout(() => {
                        expect(spy.callCount).to.equal(3);

                        done();
                    }, 30);
                });
            });
            describe('transform', () => {
                it('is invoked in the event of dragmove', (done) => {
                    let env,
                        spy;

                    spy = sinon.spy();
                    env = setupEnv({transform: spy});

                    env.card.on('transform', spy);

                    env.card.trigger('panstart');
                    env.card.trigger('panmove', {deltaX: 10, deltaY: 10});

                    setTimeout(() => {
                        env.card.trigger('panmove', {deltaX: 11, deltaY: 10});
                    }, 10);

                    setTimeout(() => {
                        env.card.trigger('panmove', {deltaX: 12, deltaY: 10});
                    }, 20);

                    setTimeout(() => {
                        expect(spy.callCount).to.equal(3);

                        done();
                    }, 30);
                });
            });
        });
    });
})

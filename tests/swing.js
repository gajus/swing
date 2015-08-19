describe('Stack', () => {
    let stack;

    beforeEach(() => {
        stack = gajus.Swing.Stack();
    });
    describe('.createCard()', () => {
        it('returns an instance of Card', () => {
            let parentElement,
                element,
                card;

            parentElement = document.createElement('div');
            element = document.createElement('div');

            parentElement.appendChild(element);

            card = stack.createCard(element);

            expect(card).to.instanceof(gajus.Swing.Card);
        });
    });
    describe('.getCard()', () => {
        it('returns card associated with an element', () => {
            let parentElement,
                element,
                card;

            parentElement = document.createElement('div');
            element = document.createElement('div');

            parentElement.appendChild(element);

            card = stack.createCard(element);

            expect(stack.getCard(element)).to.equal(card);
        });
        it('returns null when element is not associated with a card', () => {
            let element;

            element = document.createElement('div');

            expect(stack.getCard(element)).to.equal(null);
        });
    });
    describe('.destroyCard()', () => {
        it('is called when Card is destroyed', () => {
            let spy,
                parentElement,
                element,
                card;

            spy = sinon.spy(stack, 'destroyCard');
            parentElement = document.createElement('div');
            element = document.createElement('div');

            parentElement.appendChild(element);

            card = stack.createCard(element);
            card.destroy();

            expect(spy).to.have.been.calledWith(card);
        });
    });
});

describe('Stack', () => {
    describe('.config()', () => {
        let setupEnv;

        beforeEach(() => {
            setupEnv = (config) => {
                let parentElement,
                    cardElement,
                    stack,
                    card;

                parentElement = document.createElement('div');
                cardElement = document.createElement('div');

                config = config || {};
                config.targetElementWidth = 100;
                config.targetElementHeight = 100;

                stack = gajus.Swing.Stack(config);

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
            stack = gajus.Swing.Stack(configInput);

            expect(stack.config()).to.equal(configInput);
        });
        describe('isThrowOut', () => {
            it('is invoked in the event of dragend', () => {
                let spy,
                    env;

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

                    env  = setupEnv({isThrowOut: () => {
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
            it('is invoked in the event of dragmove', () => {
                let spy,
                    env;

                spy = sinon.spy();
                env = setupEnv({throwOutConfidence: spy});

                env.card.on('throwout', spy);

                env.card.trigger('mousedown');
                env.card.trigger('panmove', {deltaX: 10, deltaY: 10});
                env.card.trigger('panmove', {deltaX: 11, deltaY: 10});
                env.card.trigger('panmove', {deltaX: 12, deltaY: 10});

                expect(spy.callCount).to.equal(3);
            });
        });
        describe('rotation', () => {
            it('is invoked in the event of dragmove', () => {
                let spy,
                    env;

                spy = sinon.spy();
                env = setupEnv({rotation: spy});

                env.card.on('rotation', spy);

                env.card.trigger('mousedown');
                env.card.trigger('panmove', {deltaX: 10, deltaY: 10});
                env.card.trigger('panmove', {deltaX: 11, deltaY: 10});
                env.card.trigger('panmove', {deltaX: 12, deltaY: 10});

                expect(spy.callCount).to.equal(3);
            });
        });
        describe('transform', () => {
            it('is invoked in the event of dragmove', () => {
                let spy,
                    env;

                spy = sinon.spy();
                env = setupEnv({transform: spy});

                env.card.on('transform', spy);

                env.card.trigger('mousedown');
                env.card.trigger('panmove', {deltaX: 10, deltaY: 10});
                env.card.trigger('panmove', {deltaX: 11, deltaY: 10});
                env.card.trigger('panmove', {deltaX: 12, deltaY: 10});

                expect(spy.callCount).to.equal(3);
            });
        });
    });
});

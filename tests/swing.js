describe('Stack', function () {
    var stack;
    beforeEach(function () {
        stack = gajus.Swing.Stack();
    });
    describe('.springSystem()', function () {
        it('returns an instance of SpringSystem', function () {
            expect(stack.springSystem().constructor.name).to.equal('SpringSystem');
        });
    });
    describe('.createCard()', function () {
        it('returns an instance of Card', function () {
            var parentElement = document.createElement('div'),
                element = document.createElement('div'),
                card;

            parentElement.appendChild(element);

            card = stack.createCard(element);

            expect(card).to.instanceof(gajus.Swing.Card);
        });
    });
    describe('.getCard()', function () {
        it('returns card associated with an element', function () {
            var parentElement = document.createElement('div'),
                element = document.createElement('div'),
                card;

            parentElement.appendChild(element);

            card = stack.createCard(element);

            expect(stack.getCard(element)).to.equal(card);
        });
        it('returns null when element is not associated with a card', function () {
            var element = document.createElement('div');
            
            expect(stack.getCard(element)).to.null;
        });
    });
    describe('._destroyCard()', function () {
        it('is called when Card is destroyed', function () {
            var spy = sinon.spy(stack, '_destroyCard'),
                parentElement = document.createElement('div'),
                element = document.createElement('div'),
                card;

            parentElement.appendChild(element);

            card = stack.createCard(element);
            card.destroy();

            expect(spy).to.have.been.calledWith(card);
        });
    });
    describe('.config()', function () {
        var setupEnv;
        beforeEach(function () {
            setupEnv = function (config) {
                var parentElement = document.createElement('div'),
                    cardElement = document.createElement('div'),
                    stack,
                    card;

                config = config || {};
                config.targetElementWidth = 100;
                config.targetElementHeight = 100;

                stack = gajus.Swing.Stack(config);

                parentElement.appendChild(cardElement);

                card = stack.createCard(cardElement);

                return {
                    stack: stack,
                    card: card,
                    cardElement: cardElement
                };
            };            
        });
        it('returns the config object', function () {
            var configInput = {},
                stack = gajus.Swing.Stack(configInput);
            
            expect(stack.config()).to.equal(configInput);
        });
        describe('isThrowOut', function () {
            it('is invoked in the event of dragend', function () {
                var spy = sinon.spy(),
                    env = setupEnv({isThrowOut: spy});
                expect(spy).to.not.have.been.called;
                env.card._trigger('_mousedown');
                expect(spy).to.not.have.been.called;
                env.card._trigger('_panmove', {deltaX: 10, deltaY: 10});
                expect(spy).to.not.have.been.called;
                env.card._trigger('_panend', {deltaX: 10, deltaY: 10});
                expect(spy).to.have.been.called;
            });
            [true, false].forEach(function (throwOut) {
                it('determines throwOut event', function () {
                    var env = setupEnv({isThrowOut: function () { return throwOut; }}),
                        spy1 = sinon.spy(),
                        spy2 = sinon.spy();

                    env.card.on('throwout', spy1);
                    env.card.on('throwin', spy2);

                    env.card._trigger('_mousedown');
                    env.card._trigger('_panmove', {deltaX: 10, deltaY: 10});
                    env.card._trigger('_panend', {deltaX: 10, deltaY: 10});

                    if (throwOut) {
                        expect(spy1).to.have.been.called;
                        expect(spy2).to.have.not.been.called;
                    } else {
                        expect(spy1).to.have.not.been.called;
                        expect(spy2).to.have.been.called;
                    }
                });
            });
        });
        describe('throwOutConfidence', function () {
            it('is invoked in the event of dragmove', function () {
                var spy = sinon.spy(),
                    env = setupEnv({throwOutConfidence: spy});

                env.card.on('throwout', spy);

                env.card._trigger('_mousedown');
                env.card._trigger('_panmove', {deltaX: 10, deltaY: 10});
                env.card._trigger('_panmove', {deltaX: 11, deltaY: 10});
                env.card._trigger('_panmove', {deltaX: 12, deltaY: 10});

                expect(spy.callCount).to.equal(3);
            });
        });
        describe('rotation', function () {
            it('is invoked in the event of dragmove', function () {
                var spy = sinon.spy(),
                    env = setupEnv({rotation: spy});

                env.card.on('rotation', spy);

                env.card._trigger('_mousedown');
                env.card._trigger('_panmove', {deltaX: 10, deltaY: 10});
                env.card._trigger('_panmove', {deltaX: 11, deltaY: 10});
                env.card._trigger('_panmove', {deltaX: 12, deltaY: 10});

                expect(spy.callCount).to.equal(3);
            });
        });
        describe('transform', function () {
            it('is invoked in the event of dragmove', function () {
                var spy = sinon.spy(),
                    env = setupEnv({transform: spy});

                env.card.on('transform', spy);

                env.card._trigger('_mousedown');
                env.card._trigger('_panmove', {deltaX: 10, deltaY: 10});
                env.card._trigger('_panmove', {deltaX: 11, deltaY: 10});
                env.card._trigger('_panmove', {deltaX: 12, deltaY: 10});

                expect(spy.callCount).to.equal(3);
            });
        });
    });
});
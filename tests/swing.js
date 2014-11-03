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
                    stack = gajus.Swing.Stack(config),
                    card;

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
                var env = setupEnv();
                env.card.on('dragstart', function () {
                    console.log('OK');
                });
                env.card._trigger('_mousedown');
                env.card._trigger('_panmove', {deltaX: 10, deltaY: 10});
                env.card._trigger('_panend', {deltaX: 10, deltaY: 10});
            });
        });
    });
});
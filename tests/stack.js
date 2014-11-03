describe('Stack', function () {
    var stack;
    beforeEach(function () {
        stack = gajus.Swing.Stack();
    });
    describe('.config()', function () {
        it('returns the config object', function () {
            var configInput = {},
                stack = gajus.Swing.Stack(configInput);
            
            expect(stack.config()).to.equal(configInput);
        });
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
});
describe('Stack', function () {
    var stack;
    beforeEach(function () {
        stack = gajus.Swing.Stack();
    });
    describe('.config()', function () {
        it('returns the config object', function () {
            var configInput = {},
                stack = gajus.Swing.Stack(configInput);
            
            expect(stack.config()).toEqual(configInput);
        });
    });
    describe('.springSystem()', function () {
        it('returns an instance of SpringSystem', function () {
            expect(stack.springSystem().constructor.name).toEqual('SpringSystem');
        });
    });
    describe('.eventEmitter()', function () {
        it('returns an instance of the Sister event emitter', function () {
            expect(stack.eventEmitter().constructor.name).toEqual('Sister');
        });
    });
});
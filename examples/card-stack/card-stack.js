document.addEventListener('DOMContentLoaded', function () {
    var stack;

    stack = gajus.Swing.Stack();

    [].forEach.call(document.querySelectorAll('.stack li'), function (targetElement) {
        stack.createCard(targetElement);

        targetElement.classList.add('in-deck');
    });

    stack.on('throwout', function (e) {
        var direction = Math.abs(e.throwDirection) == 1 ? (e.throwDirection < 0 ? 'left' : 'right') : e.throwDirection > 0 ? 'down' : 'up';

        console.log(e.target.innerText || e.target.textContent, 'has been thrown out of the stack to the', direction, 'direction.');

        e.target.classList.remove('in-deck');
    });

    stack.on('throwin', function (e) {
        console.log(e.target.innerText || e.target.textContent, 'has been thrown into the stack from the', e.throwDirection == 1 ? 'right' : 'left', 'direction.');

        e.target.classList.add('in-deck');
    });
});

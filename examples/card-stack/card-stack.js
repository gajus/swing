document.addEventListener('DOMContentLoaded', function () {
    var stack;

    stack = new Swing.Stack();

    [].forEach.call(document.querySelectorAll('.stack li'), function (targetElement) {
        stack.createCard(targetElement);

        targetElement.classList.add('in-deck');
    });

    stack.on('throwout', function (e) {
        console.log(e.target.innerText || e.target.textContent, 'Card has been thrown out of the stack.');
        console.log(e.target.innerText || e.target.textContent, 'Throw direction: ' + (e.throwDirection == 1 ? 'right' : 'left'));

        e.target.classList.remove('in-deck');
    });

    stack.on('snapback', function (e) {
        console.log(e.target.innerText || e.target.textContent, 'Card has snapped back to the stack.');

        e.target.classList.add('in-deck');
    });
});
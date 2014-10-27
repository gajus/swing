document.addEventListener('DOMContentLoaded', function () {
    var stack,
        logCard;

    logCard = function (targetElement, text) {
        console.log('%c' + targetElement.innerText + '%c ' + text, targetElement.classList.contains('clubs') || targetElement.classList.contains('spades') ? 'color: #000' : 'color: #f00', '');
    };

    stack = new Swing.Stack();

    [].forEach.call(document.querySelectorAll('.stack li'), function (targetElement) {
        var card;

        card = stack.createCard(targetElement);

        card.on('throwout', function (e) {
            logCard(e.target, 'Card has been thrown out of the stack.');

            logCard(e.target, 'Throw direction: ' + (e.throwDirection == 1 ? 'right' : 'left'));

            e.target.classList.remove('in-deck');
        });

        card.on('snapback', function (e) {
            logCard(e.target, 'Card has snapped back to the stack.');

            e.target.classList.add('in-deck');
        });

        targetElement.classList.add('in-deck');
    });
});
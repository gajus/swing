document.addEventListener('DOMContentLoaded', function () {
    var stack = window.swing.Stack(),
        cardElement = document.querySelector('.stack li');

    window.card = stack.createCard(cardElement);

    stack.on('throwout', function (e) {
        console.log(e.target.innerText || e.target.textContent, 'has been thrown out of the stack to the', e.throwDirection, 'direction.');
    });

    stack.on('throwin', function (e) {
        console.log(e.target.innerText || e.target.textContent, 'has been thrown into the stack from the', e.throwDirection, 'direction.');
    });
});

// make the modal appear when a card is clicked
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
        const modal = document.querySelector('.modal-overlay').style.display = 'block';

    });
 });

// close the modal when the close button is clicked
 document.querySelector('.close').addEventListener('click', () => {
    document.querySelector('.modal-overlay').style.display = 'none';
 });

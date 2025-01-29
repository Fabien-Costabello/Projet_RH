// document.addEventListener('DOMContentLoaded', () => {
//     const editButton = document.getElementById('editUserBtn');
//     if (editButton) {
//         editButton.addEventListener('click', () => {
//             console.log('Bouton cliqué : Edit user');
//             document.getElementById('edit-user-modal').classList.remove('hidden')
//         });
//     }
// });

const deleteButtons = document.querySelectorAll('.delete-user-btn');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

document.addEventListener('DOMContentLoaded', () => {
    // Gestionnaire pour afficher le modal
    document.querySelectorAll('[data-modal-target]').forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);
            const computerId = button.getAttribute('data-id');
          
            confirmDeleteBtn.setAttribute('href', `/deleteComputer/${computerId}`);
            confirmDeleteBtn.setAttribute('data-id', computerId);
            if (modal) {
                modal.classList.remove('hidden');
            }
        });
    });

    // Gestionnaire pour masquer le modal
    document.querySelectorAll('[data-modal-hide]').forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal-hide');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('hidden');
            }
        });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const modals = document.querySelectorAll('.h-modal');

    modals.forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.add('hidden');
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                modal.classList.add('hidden');
            }
        });
    });
});



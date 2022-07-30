const update = document.querySelector('#update-button');
const deleteButton = document.querySelector('#delete-button');
const messageDiv = document.querySelector('#message');

update.addEventListener('click', _ => {
    fetch('/quotes', {
        method: 'put',
        header: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: 'Bojack Horseman',
            quote: 'I\'m poison. I come from poison, I have poison inside me and I destroy everything I touch. That’s my legacy.'
        })
    })
    .then(res => {
        if (res.ok) return res.json()
    })
    .then(res => {
        window.location.reload(true)
    })
})

deleteButton.addEventListener('click', _ => {
    fetch('/quotes', {
        method: 'delete',
        header: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: 'Bojack Horseman'
        })
    })
    .then(res => {
        if (res.ok) return res.json()
    })
    .then(res => {
        if (res === 'No quote to delete') {
            messageDiv.textContent = 'No more Bojack quote to delete';
        } else {
            window.location.reload(true)
        }
    })
    .catch(error => console.error(error))
})
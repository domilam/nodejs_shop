const deleteProduct = (btn) => {
    console.log('clicked');
    const prodId = btn.parentNode.querySelector('[name=prodId]').value;
    const csrf  = btn.parentNode.querySelector('[name=_csrf]').value;
    const productElement = btn.closest('article');
    console.log(csrf);
    fetch('/admin/delete-product/' + prodId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    })
    .then(result => {
        console.log(result);
        return result.json();
    })
    .then(data => {
        console.log(data);
        productElement.parentNode.removeChild(productElement);
    })
    .catch(err => console.log(err));
}
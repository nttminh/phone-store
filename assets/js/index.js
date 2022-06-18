const API_URL = 'https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products';

let availableProducts = [];
let cart = [];

const handleSelectChange = (e) => {
    const selectedProduct = e.target.value.toLowerCase();
    console.log(selectedProduct);
    if (selectedProduct === 'all') {
        renderProducts(availableProducts);
        return
    }

    const selectedProducts = availableProducts.filter(product => product.type.toLowerCase() === selectedProduct);
    renderProducts(selectedProducts);
}
document.getElementById('device-type').addEventListener('change', handleSelectChange);

const getProducts = async () => {
    const response = await axios.get(API_URL);
    availableProducts = response.data;
    availableProducts = mapProducts(availableProducts);
    renderProducts(availableProducts);
    return availableProducts;
}

// save cart to local storage
const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}

const mapProducts = (products) => {
    const result = products.map(product => new Product(product.name, product.price, product.screen, product.backCamera, product.frontCamera, product.img, product.desc, product.type, product.id, product.quantity));
    return result;
}

formatPrice = (price) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'VND',
    });
    return formatter.format(price);
}

const renderProducts = (products) => {
    let availableProductsHTML = '';
    products.forEach(product => {
        availableProductsHTML += product.render();
    });
    document.getElementById('available-products').innerHTML = availableProductsHTML;
}

const renderCart = (cart) => {
    let cartHTML = '';
    cart.forEach((product, index) => {
        cartHTML += product.renderCartItem(index);
    }
    );
    const totalPrice = cart.reduce((total, product) => total + product.price * product.quantity, 0);
    document.getElementById('cart-total').innerHTML = formatPrice(totalPrice);
    document.getElementById('cart').innerHTML = cartHTML;
}

const handleOpenDetail = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    $('#productModal').modal('show');
    $('#longTitle').text(response.data.name);

    $('#product-name').text(response.data.name);
    $('#product-price').text(`Giá sản phẩm: ${formatPrice(response.data.price)}`);
    $('#product-screen-size').text(`Cỡ màn hình: ${response.data.screen}`);
    $('#product-back-camera').text(`Camera sau: ${response.data.backCamera}`);
    $('#product-front-camera').text(`Camera trước: ${response.data.frontCamera}`);
    $('#product-image').attr('src', response.data.img);
    $('#product-description').text(`Mô tả sản phẩm: ${response.data.desc}`);

    $('#product-add-cart').off('click').click(async () => {
        handleAddToCart(id);
    })
}

handleChangeQuantity = (id, decision) => {
    const cartProduct = cart.find(product => product.id == id);
    cartProduct.quantity += decision;
    if (cartProduct.quantity <= 0) {
        cart = cart.filter(product => product.id != id);
    }
    renderCart(cart);
}

handleAddToCart = (id) => {
    // if product is already in cart, increase quantity
    const product = availableProducts.find(product => product.id == id);
    const cartProduct = cart.find(product => product.id == id);
    if (cartProduct) {
        cartProduct.quantity++;
    }
    // if product is not in cart, add it
    else {
        product.quantity = 1;
        cart.push(product);
    }
    // save cart to local storage
    saveCart();
    renderCart(cart);
}

const handleUpdateProduct = async (id) => {
    try {
        const name = document.getElementById('name').value.trim();
        const price = document.getElementById('price').value.trim();
        const screen = document.getElementById('screen').value.trim();
        const backCamera = document.getElementById('backCamera').value.trim();
        const frontCamera = document.getElementById('frontCamera').value.trim();
        const img = document.getElementById('imgURL').value.trim();
        const desc = document.getElementById('productDescription').value.trim();
        const type = document.getElementById('brand').value;
        const quantity = document.getElementById('quantity').value;

        const updatedProduct = {
            "name": name,
            "price": price,
            "screen": screen,
            "backCamera": backCamera,
            "frontCamera": frontCamera,
            "img": img,
            "desc": desc,
            "type": type,
            "quantity": quantity
        }

        const response = await axios.put(`${API_URL}/${id}`, updatedProduct);
        const updatedProductWithId = {
            ...response.data,
            id: id
        }

        const updatedProductIndex = availableProducts.findIndex(product => product.id == id);
        availableProducts[updatedProductIndex] = new Product(updatedProductWithId.name, updatedProductWithId.price, updatedProductWithId.screen, updatedProductWithId.backCamera, updatedProductWithId.frontCamera, updatedProductWithId.img, updatedProductWithId.desc, updatedProductWithId.type, updatedProductWithId.id, updatedProductWithId.quantity);
        renderProducts(availableProducts);
    } catch (error) {
        console.error(error);
    }
}

handleCheckout = () => {
    cart = [];
    alert('Đặt hàng thành công!');
    renderCart(cart);
}

handleClearCart = () => {
    cart = [];
    renderCart(cart);
}

getProducts();

// if cart in local storage, render cart
if (localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'));
    console.log(cart)
    cart = mapProducts(cart);
    renderCart(cart);
}

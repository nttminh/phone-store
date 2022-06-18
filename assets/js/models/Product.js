class Product {
    constructor(name, price, screen, backCamera, frontCamera, img, desc, type, id, quantity) {
        this.name = name;
        this.price = price;
        this.screen = screen;
        this.backCamera = backCamera;
        this.frontCamera = frontCamera;
        this.img = img;
        this.desc = desc;
        this.type = type;
        this.id = id;
        this.quantity = quantity;
    }

    // format price with commas
    formatPrice(price) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'VND',
        });
        return formatter.format(price);
    }

    render = () => {
        return `
        <div class="card pt-3" style="width: 22rem;">
            <img class="card-img-top" src="${this.img}" alt="">
        <div class="card-body">
            <h3 class="card-title">${this.name}</h3>
            <p class="card-text">Giá: <span>${this.formatPrice(this.price)}</span></p>
            <button class="btn btn-primary" onclick="handleAddToCart(${this.id})">Thêm vào giỏ</button>
            <button class="btn btn-outline-info" onclick="handleOpenDetail(${this.id})">Thông tin</button>
        </div>    
    </div>`
    }

    renderCartItem = (index) => {
        return `
        <tr>
                            <th scope="row">${index + 1}</th>
                            <td>${this.name}</td>
                            <td>
                            ${this.quantity}
                                <button class="btn btn-outline-info" onclick="handleChangeQuantity(${this.id},-1)">-</button>
                                <button class="btn btn-outline-info" onclick="handleChangeQuantity(${this.id},1)">+</button>
                            </td>
                            <td>${this.formatPrice(this.price)}</td>
                            <td>${this.formatPrice(this.price * this.quantity)}</td>
                        </tr>`

    }
}
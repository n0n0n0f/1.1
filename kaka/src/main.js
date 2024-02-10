let app = new Vue({
    el: '#app',
    data: {
        product: "Socks",
        brand: 'Vue Mastery',
        description: "A pair of warm, fuzzy socks",
        image: "./assets/vmSocks-green-onWhite.jpg",
        altText: "A pair of socks",
        link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
        inStock: true,
        inventory: 0,
        onSale: true,
        details: ['80% cotton', '20% polyester', 'Gender-neutral'],
        variants: [
            {
                variantId: 2234,
                variantColor: 'green',
                variantImage: "./assets/vmSocks-green-onWhite.jpg",
            },
            {
                variantId: 2235,
                variantColor: 'blue',
                variantImage: "./assets/vmSocks-blue-onWhite.jpg",
            }
            ],
                sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
                cart: 0,
                },
                methods: {
                    addToCart() {
                        this.cart += 1;
                    },
                    updateProduct(variantImage) {
                        this.image = variantImage;
                    },
                    ReduceToCart() {
                        if (this.cart >= 1){
                            this.cart -= 1
                        }
                    }

                },
                computed: {
                    title() {
                        return this.brand + ' ' + this.product;
                    },
                    sale() {
                        if (this.onSale){
                            return this.title + ' is on sale!'
                        } else {
                            return this.title + ' is not sale!'
                        }
                    }
                },


});
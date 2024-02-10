Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
      <div class="product">
        <div class="product-image">
          <img :src="image" :alt="altText" />
        </div>
        <div class="product-info">
          <h1>{{ title }}</h1>
          <p>Shipping: {{ shipping }}</p>
          <a :href="link">More products like this</a>
          <p v-if="inventory > 10">In stock</p>
          <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out!</p>
          <p :class="{ text_through: !inStock }" v-else>Out of stock</p>
          <p>{{ sale }}</p>
          <ul>
            <li v-for="detail in details">{{ detail }}</li>
          </ul>
          <div class="color-box" v-for="variant in variants" :key="variant.variantId" :style="{ backgroundColor:variant.variantColor }"
               @mouseover="updateProduct(variant.variantImage)">
          </div>
          <ul>
            <li v-for="size in sizes">{{ size }}</li>
          </ul>

          <button
              v-on:click="addToCart"
              :disabled="!inStock"
              :class="{ disabledButton: !inStock }">
            Add to cart
          </button>
          <button
              v-on:click="ReduceToCart"
              :disabled="!inStock"
              :class="{ disabledButton: !inStock }">
            Reduce to cart
          </button>
        </div>
      </div>
    `,
    data() {
        return {
            selectedVariant: 0,
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
            cart: [],

        }
    },
    methods: {
        ReduceToCart(){
            this.$emit('reduce-to-cart', this.variants[this.selectedVariant].variantId);

        },
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);


        },

        updateProduct(variantImage) {
            this.image = variantImage;
        },


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
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        }

    }
})
Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
        <div class="product-details">
            <ul>
                <li v-for=" detail in details">{{ detail }}</li>
            </ul>
        </div>
`
});

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id) ;
        },

        updateCartminus(id) {
            const index = this.cart.indexOf(id);
            if (index !== -1){
                this.cart.splice(index, 1);
            }
            }
        },


})






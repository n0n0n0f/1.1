let eventBus = new Vue()
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

    },
    mounted() {
        eventBus.$on('review-submitted', function (productReview) {
            this.reviews.push(productReview);
        }.bind(this));
    },
})
Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
      <div>
        <p>Product Details:</p>
        <ul>
          <li v-for="detail in details">{{ detail }}</li>
        </ul>
      </div>
    `
});


Vue.component('product-review', {
    template: `
      <div class="dec">
        <div>
        </div>
        <ul>
          <li v-for="review in reviews" :key="review.id">
            <p>{{ review.name }}</p>
            <p>Rating: {{ review.rating }}</p>
            <p>{{ review.review }}</p>
          </li>
        </ul>

        <form class="review-form" @submit.prevent="onSubmit">
          <div v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
              <li v-for="error in errors">{{ error }}</li>
            </ul>
          </div>

          <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name" placeholder="name">
          </p>

          <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review"></textarea>
          </p>

          <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
              <option>5</option>
              <option>4</option>
              <option>3</option>
              <option>2</option>
              <option>1</option>
            </select>
          </p>

          <p>Would you recommend this product?</p>
          <label>
            Yes
            <input type="radio" value="Yes" v-model="recommend"/>
          </label>
          <label>
            No
            <input type="radio" value="No" v-model="recommend"/>
          </label>

          <p>
            <input type="submit" value="Submit">
          </p>
        </form>
      </div>

    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            reviews: [],
            errors: []
        }
    },
    methods:{
        onSubmit() {
            this.errors = [];
            if(this.name && this.review && this.rating && this.recommend) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend,
                    id: this.reviews.length + 1
                };
                eventBus.$emit('review-submitted', productReview)
                this.name = null;
                this.review = null;
                this.rating = null;
                this.recommend = null;
            } else {
                if(!this.name) this.errors.push("Name required.");
                if(!this.review) this.errors.push("Review required.");
                if(!this.rating) this.errors.push("Rating required.");
                if(!this.recommend) this.errors.push("Recommendation required.");
            }
        }
    }
});

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        },
        details: {
            type: Array,
            required: false
        },
        selectedTab: {
            type: String,
            required: true
        }
    },
    template: `
      <div>
        <ul>
          <span class="tab"
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs"
                @click="selectedTab = tab"
          >{{ tab }}</span>
        </ul>
        <div v-show="selectedTab === 'Reviews'">
          <p v-if="!reviews.length">There are no reviews yet.</p>
          <ul>
            <li v-for="review in reviews">
              <p>{{ review.name }}</p>
              <p>Rating: {{ review.rating }}</p>
              <p>{{ review.review }}</p>
            </li>
          </ul>
        </div>
        <div v-show="selectedTab === 'Make a Review'">
          <product-review></product-review>
        </div>
        <div v-show="selectedTab === 'Shipping'">
          <product-shipping :premium="premium"></product-shipping>
        </div>
        <div v-show="selectedTab === 'Details'">
          <product-details :details="details"></product-details>
        </div>
      </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details']
        }
    }
});



Vue.component('product-shipping', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
        <div>
            <p>Shipping Details:</p>
            <p v-if="premium">Free Shipping</p>
            <p v-else>Standard Shipping: $2.99</p>
        </div>
    `
});



let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
        reviews: [],
        details: ['80% cotton', '20% polyester', 'Gender-neutral']
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        removeFromCart(id){
            const index = this.cart.indexOf(id);
            if (index !== -1){
                this.cart.splice(index, 1);
            }
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview);
        });
    }
});
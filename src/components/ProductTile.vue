<template>
  <EditProductOverlay v-if="edit" :registration="registration" :data="product" @stopEditingProduct="stopEditingProduct($event)" @deleteProduct="deleteProduct($event)"/>

  <div class="card">
    <div class="image">
      <div v-if="this.picture == null" class="no-image">
        <i class="fa-solid fa-image fa-2xl"></i>
      </div>
      <img v-else :src="this.picture" alt="" />
    </div>
    <div class="info">
      <div class="row">
        <div class="col col-9">
          <p class="name">{{ product.name }}</p>
          <p class="category">{{ product.categories[0] }}</p>
  
        </div>
        <div class="col col-3">
          <button @click="edit = true" class="btn btn-primary">
            <i class="fa-solid fa-pen-to-square fa-lg"></i>

          </button>
        </div>
      </div>  


      <p class="description">{{ product.info }}</p>

      <p class="price">{{ product.price }} $</p>

      <div class="settings">
        <i v-if="product.delivery" class="fa-solid fa-truck fa-lg"></i>
        <i v-if="!product.public" class="fa-solid fa-lock fa-lg"></i>
      </div>

    </div>
  </div>
</template>

<script>
import EditProductOverlay from "./EditProductOverlay.vue"
import { reactive } from 'vue';
import { supabase } from '../supabase';

export default {
  name: 'ProductTile',
  props: ['data', 'registration'],
  components: { EditProductOverlay },
  emits: ['deleteProduct', 'editProduct'],
  data() {
    return {
      edit: false,
      picture: null
    };
  },
  setup() {
    var product = reactive({
      id: null,
      name: '',
      info: '',
      categories: [],
      price: '',
      imageBefore: null, 
      image: null, 
      delivery: true,
      public: true,
      product_picture: '',
      variations: [],
      extras: [],
      has_variations: false,
      has_extras: false
    });

    return {
      product,
    };
  },
  async mounted() {
    if(this.data != null) {
      this.product.id = this.data.id;
      this.product.name = this.data.name;
      this.product.categories = this.data.categories;
      this.product.info = this.data.info;
      this.product.price = this.data.price;
      this.product.delivery = this.data.delivery;
      this.product.public = this.data.public;
      this.product.product_picture = this.data.product_picture;
      this.product.has_variations = this.data.has_variations;
      this.product.has_extras = this.data.has_extras;

      if(this.data.variations != undefined) {
        this.data.variations.forEach(variation => {
          this.product.variations.push(variation)
        })   
      }
      
      if(this.data.extras != undefined) {
        this.data.extras.forEach(extra => {
          this.product.extras.push(extra)
        }) 
      }
      

      if(this.registration) {
        this.product.image = this.data.image
        this.product.imageBefore = this.data.image
        this.picture = this.data.image
      } else
      if (this.data.product_picture != null) {
        const response = await supabase.storage
          .from('public/products-pictures')
          .download(this.data.product_picture);
        if (response.data != null) {
          this.product.image = await response.data.text();
          this.product.imageBefore = this.product.image
          this.picture = this.product.image
        } 
        if (response.error) console.warn(response.error);
      } else if (this.data.image != null ) {
        this.product.image = this.data.image;
        this.product.imageBefore = this.data.image
        this.picture = this.data.image
      }
    }
  },
  methods: {
    stopEditingProduct(productData) {
      this.edit = false;

      if(productData == null) return;

      this.product = productData;
      this.picture = productData.image;

      if(this.registration) {
        this.$emit('editProduct', productData)
      }
    },
    deleteProduct(productData) {
      this.edit = false;
      
      this.$emit('deleteProduct', productData)
    }
  }
};
</script>

<style scoped>
.price,
.name {
  font-size: 1.25rem;
  padding: 0;
  margin: 0;
  font-weight: 600;
}

.name {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1; /* number of lines to show */
  line-clamp: 1;
  -webkit-box-orient: vertical;
}

.btn {
  position: absolute;
  top: 15px;
  right: 10px;
  padding: 2px 5px 3px 5px;
}

.name {
  text-align: left;
  margin: 10px 15px 0 15px;
}

.description {
  text-align: left;
  margin: 5px 15px 0 15px;
  font-size: 0.9rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1; /* number of lines to show */
  line-clamp: 1;
  -webkit-box-orient: vertical;
}


.price {
  position: absolute;
  text-align: left;
  bottom: 8px;
  left: 15px;
  color: black;
}

.settings {
  position: absolute;
  text-align: left;
  bottom: 8px;
  right: 15px;
  color: black;
  padding: 3px;
}

.row,
.col {
  margin: 0;
  padding: 0;
}

.info {
  position: absolute;
  width: 60%;
  height: 100%;
  top: 0;
  left: 40%;
}

.card {
  flex-direction: row;
  overflow: hidden;
  margin: 2.5%;
}

.image {
  width: 40%;
  position: relative;
  padding-bottom: 40%;
  margin-right: 10px;
  border-right: 1px solid;
  border-color: #cfd4da;
}

.no-image {
  background-color: gray;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

img {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  object-fit: cover;
}

.category {
  text-align: left;
  font-weight: 300;
  margin: -5px 15px 0 15px;
}

.btn-primary {
  background-color: #00a100;
  border-color: #00a100;
}

.btn-primary:hover {
  background-color: #007400;
  border-color: #007400;
}

.fa-image {
  position: absolute;
  font-size: 4rem;
  top: 50%;
  left: calc(50% - 2rem);
  color: black;
}

/*   border-radius: 0.375rem 0 0 0.375rem; */
</style>

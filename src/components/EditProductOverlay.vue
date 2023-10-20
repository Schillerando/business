<template>
  <AlertPopup :title="this.alertTitle" :info="this.alertInfo" />

  <div class="overlay">
    <div class="card">
      <div class="card-header">
        <div>
          <h4 class="card-title">Angebot</h4>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="stopEditingProduct()"
          ></button>
        </div>
      </div>
      <div class="card-body scroll">
        <div class="image">
          <div v-if="product.image == null" class="no-image">
            <i class="fa-solid fa-image fa-2xl"></i>
          </div>
          <img
            v-else
            :src="this.product.image"
            alt="Unternehmen Bild"
            id="productImage"
          />
        </div>

        <input
          class="form-control form-control-sm col-7"
          type="file"
          id="formFile"
          accept="image/*"
          @change="imageInput()"
        />

        <p v-if="product.image == null" style="font-weight: 300; font-size: 0.9rem">Füge ein Bild hinzu, welches dein Angebot repräsentiert. (Optimales Format 1:1)</p>


        <form class="needs-validation" novalidate>
          <div class="input-group mb-3">
            <span class="input-group-text"
              ><i class="fa-solid fa-box-open"></i></span>
            <input
              type="text"
              id="product-name"
              class="form-control"
              @input="validateProduct(false)"
              placeholder="Name"
              :value="product.name"
              required
            />
          </div>

          <div class="input-group mb-3">
            <span class="input-group-text"
              ><i class="fa-solid fa-list"></i
            ></span>
            <select
              class="form-select"
              id="product-category"
              aria-label="Default select example"
              :value="product.categories[0]"
              @change="validateProduct(false)"
            >
              <option value="" selected>Kategorie</option>
              <option value="Essen">Essen</option>
              <option value="Trinken">Trinken</option>
              <option value="Dienstleistung">Dienstleistung</option>
              <option value="Gegenstand">Gegenstand</option>
              <option value="Aktivität">
                Aktivität
              </option>
              <option value="Event">
                Event
              </option>
              <option value="Sonstiges">
                Sonstiges
              </option>
            </select>
          </div>

          <div class="input-group mb-3">
            <span class="input-group-text"
              ><i class="fa-solid fa-circle-info"></i
            ></span>
            <textarea
              type="text"
              id="product-info"
              class="form-control"
              @input="validateProduct(false)"
              placeholder="Beschreibung"
              required
              maxlength="200"
              style="resize: none"
              rows="5"
              cols="50"
              :value="product.info"
            ></textarea>
          </div>

          <div v-if="product.variations == undefined || product.variations.length == 0" class="input-group mb-3">
            <span class="input-group-text"
              ><i class="fa-solid fa-dollar-sign"></i></span>
            <input
              type="number"
              id="product-price"
              class="form-control"
              @input="validateProduct(false)"
              placeholder="Preis"
              :value="product.price"
              required
            />
          </div>


          <div class="variations">

            <div class="add-variations">
              <p class="header">Variationen</p>

              <button class="btn btn-primary add-button" @click.prevent="addVariation()">
                <i class="fa-solid fa-plus"></i>
              </button>

              <p class="info">Zum Beispiel verschiedene Größen, von denen man eine auswählen kann.</p>
            </div>
            
            <div v-if="product.variations != undefined && product.variations.length > 0" class="variations-list">
              <div v-for="variation in product.variations" :key="variation.id">

                <div class="input-group mb-1">
                  <input @input="editVariationName(variation.id)" type="text" class="form-control variation-name" placeholder="Variation" aria-label="Variation" :value="variation.name">
                  <span class="input-group-text"><i class="fa-solid fa-dollar-sign"></i></span>
                  <input @input="editVariationPrice(variation.id)" type="number" class="form-control variation-price" placeholder="Preis" aria-label="Preis" :value="variation.price">
                  <button class="form-control trash" @click.prevent="removeVariation(variation.id)"><i class="fa-solid fa-trash"></i></button>
                </div>

              </div>
            </div>

          </div>      
          

          <div class="extras mt-4">

            <div class="add-extras">
              <p class="header">Extras</p>

              <button class="btn btn-primary add-button" @click.prevent="addExtra()">
                <i class="fa-solid fa-plus"></i>
              </button>

              <p class="info">Zum Beispiel verschiedene Toppings oder Soßen, die man zusätzlich wählen kann. Der Aufpreis kommt bei Wahl zum eigentlichen Preis hinzu.</p>
            </div>
            
            <div v-if="product.extras != undefined && product.extras.length > 0" class="extras-list">
              <div v-for="extra in product.extras" :key="extra.id">

                <div class="input-group mb-1">
                  <input @input="editExtraName(extra.id)" type="text" class="form-control extra-name" placeholder="Extra" aria-label="Variation" :value="extra.name">
                  <span class="input-group-text"><i class="fa-solid fa-dollar-sign"></i></span>
                  <input @input="editExtraPrice(extra.id)" type="number" class="form-control extra-price" placeholder="Aufpreis" aria-label="Aufpreis" :value="extra.extra_price">
                  <button class="form-control trash" @click.prevent="removeExtra(extra.id)"><i class="fa-solid fa-trash"></i></button>
                </div>

              </div>
            </div>

          </div>  


          <div class="switches">
            <div class="form-check form-switch">
              <input @click="switchDelivery" :checked="product.delivery" class="form-check-input" type="checkbox" role="switch" id="deliverySwitch">
              <label class="form-check-label" for="flexSwitchCheckChecked">Lieferbar</label>
            </div>
  
            <div class="form-check form-switch">
              <input @click="switchPrivate" :checked="!product.public" class="form-check-input" type="checkbox" role="switch" id="privateSwitch">
              <label class="form-check-label" for="flexSwitchCheckDefault">Privat (nur für Buchhaltung)</label>
            </div>
          </div>


        </form>
      </div>
      <div class="card-footer">
        <button class="btn btn-primary save-button" @click="validateProduct(true)">Speichern</button>
        <button v-if="!this.delete && initialProduct.name != ''" class="btn btn-danger delete-button" @click="this.delete = true">Löschen</button>
        <div v-else-if="this.delete && initialProduct.name != ''" class="confirm">
          <button class="btn btn-primary confirm-button" @click="deleteProduct()">
            <i class="fa-solid fa-check fa-lg"></i>
          </button>
          <button class="btn btn-danger confirm-button" @click="this.delete = false">
            <i class="fa-solid fa-xmark fa-lg"></i>
          </button>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { useStore, mapGetters } from 'vuex';
import AlertPopup from '@/shared/components/AlertPopup.vue';
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.js';
import { supabase } from '../supabase';
import {v4 as uuidv4} from 'uuid';


export default {
  name: 'EditProductOverlay',
  props: ['data', 'edit', 'registration'],
  components: {
    AlertPopup,
  },
  emits: ['stopEditingProduct', 'deleteProduct'],
  data() {
    return {
      continuePressed: false,
      alertTitle: '',
      alertInfo: '',
      successAlertTitle: 'Erfolgreich',
      successAlertInfo: 'Aktion wurde erfolgreich durchgeführt',
      failureAlertTitle: 'Fehler',
      failureAlertInfo: 'Es ist ein Fehler aufgetreten!',
      delete: false
    }
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

    var initialProduct = reactive({
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

    const store = useStore();

    return {
      store,
      product,
      initialProduct
    };
  },
  mounted() {    
    if(this.data != null) {
      this.product.id = this.data.id;
      this.product.name = this.data.name;
      this.product.categories = this.data.categories;
      this.product.info = this.data.info;
      this.product.price = this.data.price;
      this.product.imageBefore = this.data.image;
      this.product.image = this.data.image;
      this.product.delivery = this.data.delivery;
      this.product.public = this.data.public;
      this.product.product_picture = this.data.product_picture;
      this.product.variations = this.data.variations;
      this.product.extras = this.data.extras;
      this.product.has_variations = this.data.has_variations;
      this.product.has_extras = this.data.has_extras;

      this.initialProduct.id = this.data.id;
      this.initialProduct.name = this.data.name;
      this.initialProduct.categories = this.data.categories;
      this.initialProduct.info = this.data.info;
      this.initialProduct.price = this.data.price;
      this.initialProduct.imageBefore = this.data.image;
      this.initialProduct.image = this.data.image;
      this.initialProduct.delivery = this.data.delivery;
      this.initialProduct.public = this.data.public;
      this.initialProduct.product_picture = this.data.product_picture;
      this.initialProduct.variations = this.data.variations;
      this.initialProduct.extras = this.data.extras;
      this.initialProduct.has_variations = this.data.has_variations;
      this.initialProduct.has_extras = this.data.has_extras;
    } else {
      this.product.id = uuidv4();
      this.initialProduct.id = this.product.id;
    }
  },
  computed: {
    ...mapGetters(['getState']),
  },
  watch: {
    getState(newValue) {
      var spinners = document.getElementsByClassName('spinner');
      var loadingButtons = document.getElementsByClassName('loading-button');

      if (newValue == 'loading') {
        Array.from(spinners).forEach((spinner) => {
          spinner.style.visibility = 'visible';
          spinner.style.position = 'relative';
        });

        Array.from(loadingButtons).forEach((button) => {
          button.style.visibility = 'hidden';
          button.style.position = 'absolute';
        });
      } else if (newValue == 'success') {
        Array.from(spinners).forEach((spinner) => {
          spinner.style.visibility = 'hidden';
          spinner.style.position = 'absolute';
        });

        Array.from(loadingButtons).forEach((button) => {
          button.style.visibility = 'visible';
          button.style.position = 'relative';
        });

        this.alertTitle = this.successAlertTitle;
        this.alertInfo = this.successAlertInfo;

        if (this.alertTitle != '') {
          alertModal = new Modal(document.getElementById('alertModal'), {});
          alertModal.show();
        }

        this.stopEditingProduct()
      } else {
        Array.from(spinners).forEach((spinner) => {
          spinner.style.visibility = 'hidden';
          spinner.style.position = 'absolute';
        });

        Array.from(loadingButtons).forEach((button) => {
          button.style.visibility = 'visible';
          button.style.position = 'relative';
        });

        this.alertTitle = this.failureAlertTitle;
        this.alertInfo = this.failureAlertInfo;

        if (this.alertTitle != '') {
          var alertModal = new Modal(document.getElementById('alertModal'), {});
          alertModal.show();
        }
      }
    },
  },
  methods: {
    async stopEditingProduct() {
      console.log("test")

      if(!this.registration) {
        const newProduct = this.store.getters.getCurrentProduct 
        this.store.commit('setCurrentProduct', null)
        if(newProduct != null) {
          this.product.id = newProduct.id;
          this.product.name = newProduct.name;
          this.product.categories = newProduct.categories;
          this.product.info = newProduct.info;
          this.product.price = newProduct.price;
          this.product.delivery = newProduct.delivery;
          this.product.public = newProduct.public;
          this.product.product_picture = newProduct.product_picture;
          this.product.variations = newProduct.variations;
          this.product.extras = newProduct.extras;
          this.product.has_variations = newProduct.has_variations;
          this.product.has_extras = newProduct.has_extras;

          if (newProduct.product_picture != null) {
            const response = await supabase.storage
              .from('public/products-pictures')
              .download(newProduct.product_picture);
            if (response.data != null) {
              this.product.image = await response.data.text();
              this.product.initialImage = this.product.image
            } 
            if (response.error) console.warn(response.error);
          }
        } else {
          this.product = null;
        }
      }

      this.$emit('stopEditingProduct', this.product)
    },
    switchDelivery() {
      this.product.delivery = !this.product.delivery
      this.product.public = this.product.delivery ? true : this.product.public
    },
    switchPrivate() {
      this.product.public = !this.product.public
      this.product.delivery = this.product.public ? this.product.delivery : false
    },
    deleteProduct() {
      this.$emit('deleteProduct', this.product)
    },
    addVariation() {
      if(this.product.variations == undefined) this.product.variations = []

      this.product.variations.push({
        id: this.product.variations.length,
        name: '',
        price: null,
        new: true
      })
    },
    editVariationName(id) {
      var index = this.product.variations.findIndex(variation => variation.id == id)

      var inputs = document.getElementsByClassName('variation-name')

      this.product.variations[index].name = inputs[index].value

      if(this.continuePressed) {
        if(this.product.variations[index].name.length < 1 || this.product.variations[index].name.length > 30) {
          inputs[index].classList.remove('is-valid');
          inputs[index].classList.add('is-invalid');
        } else {
          inputs[index].classList.add('is-valid');
          inputs[index].classList.remove('is-invalid');
        }
      }
    },
    editVariationPrice(id) {
      var index = this.product.variations.findIndex(variation => variation.id == id)

      var inputs = document.getElementsByClassName('variation-price')

      this.product.variations[index].price = inputs[index].value

      if(this.continuePressed) {
        if(this.product.variations[index].price == null || this.product.variations[index].price < 0 || this.product.variations[index].price > 9999) {
          inputs[index].classList.remove('is-valid');
          inputs[index].classList.add('is-invalid');
        } else {
          inputs[index].classList.add('is-valid');
          inputs[index].classList.remove('is-invalid');
        }
      }
    },
    removeVariation(id) {
      this.product.variations = this.product.variations.filter(variation => variation.id != id)
    },
    addExtra() {
      if(this.product.extras == undefined) this.product.extras = []

      this.product.extras.push({
        id: this.product.extras.length,
        name: '',
        extra_price: null,
        new: true
      })
    },
    editExtraName(id) {
      var index = this.product.extras.findIndex(extra => extra.id == id)

      var inputs = document.getElementsByClassName('extra-name')

      this.product.extras[index].name = inputs[index].value

      if(this.continuePressed) {
        if(this.product.extras[index].name.length < 1 || this.product.extras[index].name.length > 30) {
          inputs[index].classList.remove('is-valid');
          inputs[index].classList.add('is-invalid');
        } else {
          inputs[index].classList.add('is-valid');
          inputs[index].classList.remove('is-invalid');
        }
      }
    },
    editExtraPrice(id) {
      var index = this.product.extras.findIndex(extra => extra.id == id)

      var inputs = document.getElementsByClassName('extra-price')

      this.product.extras[index].extra_price = inputs[index].value

      if(this.continuePressed) {
        if(this.product.extras[index].extra_price == null || this.product.extras[index].extra_price < 0 || this.product.extras[index].extra_price > 9999) {
          inputs[index].classList.remove('is-valid');
          inputs[index].classList.add('is-invalid');
        } else {
          inputs[index].classList.add('is-valid');
          inputs[index].classList.remove('is-invalid');
        }
      }
    },
    removeExtra(id) {
      this.product.extras = this.product.extras.filter(extra => extra.id != id)
    },
    imageInput() {
      var input = document.getElementById('formFile');

      if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = e => {
          this.product.image = e.target.result
        };

        reader.readAsDataURL(input.files[0]);
      }

    },
    async validateProduct(pressed) {
      var nameInput = document.getElementById('product-name');
      var priceInput = document.getElementById('product-price');
      var categoryInput = document.getElementById('product-category');
      var descriptionInput = document.getElementById('product-info');

      this.product.name = nameInput.value;
      if(priceInput != null) this.product.price = priceInput.value;
      this.product.info = descriptionInput.value;
      this.product.categories = [categoryInput.value];

      if (!pressed && !this.continuePressed) return;

      var variationNameInputs = document.getElementsByClassName('variation-name');
      var variationPriceInputs = document.getElementsByClassName('variation-price');
      var extraNameInputs = document.getElementsByClassName('extra-name');
      var extraPriceInputs = document.getElementsByClassName('extra-price');

      var valid = true;

      if(pressed) {
        nameInput.value = nameInput.value.trim();

        descriptionInput.value = descriptionInput.value.trim();

        if(variationNameInputs.length > 0) {
          this.product.has_variations = true
          this.product.price = 100000
        } else {
          this.product.has_variations = false
        }

        for(var i = 0; i < variationNameInputs.length; i++) {
          this.product.variations[i].name = variationNameInputs[i].value.trim()

          if(this.product.variations[i].name.length < 1 || this.product.variations[i].name.length > 30) {
            variationNameInputs[i].classList.remove('is-valid');
            variationNameInputs[i].classList.add('is-invalid');
            valid = false;
          } else {
            variationNameInputs[i].classList.add('is-valid');
            variationNameInputs[i].classList.remove('is-invalid');
          }

          if(this.product.variations[i].price == null || this.product.variations[i].price < 0 || this.product.variations[i].price > 9999) {
            variationPriceInputs[i].classList.remove('is-valid');
            variationPriceInputs[i].classList.add('is-invalid');
            valid = false;
          } else {
            variationPriceInputs[i].classList.add('is-valid');
            variationPriceInputs[i].classList.remove('is-invalid');
          }

          if(this.product.variations[i].price < this.product.price) this.product.price = this.product.variations[i].price;
        }

        if(extraNameInputs.length > 0) this.product.has_extras = true
        else this.product.has_extras = false

        for(i = 0; i < extraNameInputs.length; i++) {
          this.product.extras[i].name = extraNameInputs[i].value.trim()

          if(this.product.extras[i].name.length < 1 || this.product.extras[i].name.length > 30) {
            extraNameInputs[i].classList.remove('is-valid');
            extraNameInputs[i].classList.add('is-invalid');
            valid = false;
          } else {
            extraNameInputs[i].classList.add('is-valid');
            extraNameInputs[i].classList.remove('is-invalid');
          }

          if(this.product.extras[i].extra_price == null || this.product.extras[i].extra_price < 0 || this.product.extras[i].extra_price > 1000) {
            extraPriceInputs[i].classList.remove('is-valid');
            extraPriceInputs[i].classList.add('is-invalid');
            valid = false;
          } else {
            extraPriceInputs[i].classList.add('is-valid');
            extraPriceInputs[i].classList.remove('is-invalid');
          }
        }
      }

      if (nameInput.value.trim().length < 3) {
        nameInput.classList.remove('is-valid');
        nameInput.classList.add('is-invalid');
        valid = false;
      } else {
        nameInput.classList.remove('is-invalid');
        nameInput.classList.add('is-valid');
      }

      if(priceInput != null) {
        if (
          priceInput.value < 0 ||
          priceInput.value > 9999 
        ) {
          priceInput.classList.remove('is-valid');
          priceInput.classList.add('is-invalid');
          valid = false;
        } else {
          priceInput.classList.remove('is-invalid');
          priceInput.classList.add('is-valid');
        }
      } 

      if (categoryInput.value == 'Kategorie') {
        categoryInput.classList.remove('is-valid');
        categoryInput.classList.add('is-invalid');
        valid = false;
      } else {
        categoryInput.classList.remove('is-invalid');
        categoryInput.classList.add('is-valid');
      }

      if (descriptionInput.value.trim().length < 5) {
        descriptionInput.classList.remove('is-valid');
        descriptionInput.classList.add('is-invalid');
        valid = false;
      } else {
        descriptionInput.classList.remove('is-invalid');
        descriptionInput.classList.add('is-valid');
      }

      this.continuePressed = true

      if (valid && pressed) {

        if(this.initialProduct == this.product) {
          this.stopEditingProduct()
        } else {
          this.failureAlertTitle = 'Fehler'
          this.failureAlertInfo = 'Beim Aktualisieren des Angebots ist ein Fehler aufgetreten. Versuche es später erneut.'
          this.successAlertTitle = ''

          if(this.registration) {
            this.stopEditingProduct()
          } else {
            if(this.initialProduct.name == '') {
              this.store.dispatch('addProduct', this.product)
            } else {
              this.store.dispatch('updateProduct', this.product)
            }
          }

        }
      }
    }
  }
};
</script>

<style scoped>
.overlay {
  position: fixed;
  width: 100%; 
  height: 100%; 
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 20; 
  cursor: pointer; 
}

.card {
  position: relative;
  height: 82%;
  width: 90%;
  top: 12.5%;
  margin: auto;
  max-width: 500px;
}

.card-header {
  display: flex;
  padding-top: 12px;
}

.card-footer {
  padding-bottom: 45px;
}

.card-title {
  padding: 0;
  margin: 0;
  text-align: left;
  display: inline-block;
}

.btn-close {
  position: absolute;
  right: 15px;
}

.save-button {
  font-size: 1.1rem;
  position: absolute;
  bottom: 7px;
  right: 12px;
  padding: 5px 13px 5px 11px;
}

.delete-button {
  font-size: 1.1rem;
  position: absolute;
  bottom: 7px;
  left: 12px;
  padding: 5px 13px 5px 11px;
}

.confirm {
  position: absolute;
  bottom: 7px;
  left: 12px;
}

.confirm-button {
  margin-right: 10px;
}

.image {
  width: 60%;
  position: relative;
  padding-bottom: 60%;
  margin: 0 auto 10px auto;
}

.no-image {
  background-color: gray;
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 0.375rem;
}

img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
  left: 0;
}

.fa-image {
  position: absolute;
  font-size: 6rem;
  top: 50%;
  left: calc(50% - 3rem);
}


.input-group-text {
  width: 40px;
  padding: 0;
  padding-left: 9px;
}

#formFile {
  width: 60%;
  position: relative;
  margin: 0 auto 10px auto;
}

.scroll {
  overflow-y: auto;
}

.fa-dollar-sign {
 padding-left: 5px;
}

.fa-circle-info{
  padding-left: 2px;
}

.fa-list{
  padding-left: 2px;
}

.switches {
  max-width: max-content;
  text-align: left;
  position: relative;
  margin: 20px 0;
}

.variations {
  text-align: left;
}

.extras {
  text-align: left;
}

.add-button {
  padding: 0 5px;
  display: inline;
  position: relative;
  bottom: 2px;
}

.header {
  display: inline;
  margin-right: 10px;
  font-size: 1.1rem;
}

.info {
  font-size: 0.9rem;
  font-weight: 300;
  margin-bottom: 5px;
}

.variation-name {
  width: 40%;
}

.extra-name {
  width: 40%;
}

.trash {
  width: 0;
  padding: 0;
}

.fa-trash {
  color: red;
}

</style>

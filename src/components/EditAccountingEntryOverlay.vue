<template>
  <AlertPopup :title="this.alertTitle" :info="this.alertInfo" />

  <div class="overlay">
    <div class="card">
      <div class="card-header">
        <div>
          <h4 class="card-title">Eintrag</h4>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="stopEditingEntry()"
          ></button>
        </div>
      </div>
      <div class="card-body scroll mt-4">
        <div class="details" v-if="userName != ''">
          <span class="day">{{ day }}</span>
          <span class="time">{{ time }}</span>
          <span class="userName">{{ userName }}</span>
        </div>

        <form class="needs-validation" novalidate>

          <div class="input-group mb-3">
            <span class="input-group-text"
              ><i class="fa-solid fa-list"></i
            ></span>
            <select
              class="form-select"
              id="entry-type"
              aria-label="Default select example"
              :value="entry.type"
              @change="validateEntry(false)"
              required
            >
              <option value="" selected>Typ</option>
              <option value="Verkauf+">
                Verkauf
              </option>
              <option value="Einkauf-">Einkauf</option>
              <option value="Gehalt-">Gehalt</option>
              <option value="Miete-">Miete</option>
              <option value="Steuern-">Steuern</option>
              <option value="Sonstige Einnahme+">
                Sonstige Einnahme
              </option>
              <option value="Sonstige Ausgabe-">Sonstige Ausgabe</option>
            </select>
          </div>

          <div v-if="entry.type == 'Verkauf+'" class="input-group mb-3">
            <span class="input-group-text"
              ><i class="fa-solid fa-box-open"></i></span>
            <select
              class="form-select"
              id="entry-product"
              aria-label="Default select example"
              :value="entry.product.id"
              @change="validateEntry(false, true)"
            >
              <option value="" selected>Angebot</option>
              <option v-for="product in this.products" :key="product.id" :value="product.id">{{ product.name }} | <span v-if="product.has_variations">ab</span> {{ product.price }} $</option>
            </select>
          </div>

          <div v-if="entry.type == 'Verkauf+' && entry.product != null && entry.product.has_variations" class="input-group mb-3">
            <span class="input-group-text"
              ><i class="fa-solid fa-bars"></i></span>
            <select
              class="form-select"
              id="entry-product-variation"
              aria-label="Default select example"
              :value="entry.variation"
              @change="validateEntry(false, false, true)"
            >
              <option value="" selected>Variation</option>
              <option v-for="variation in this.entry.product.variations" :key="variation.id" :value="variation.id">{{ variation.name }} | {{ variation.price }} $</option>
            </select>
          </div>

          <div v-if="entry.type == 'Verkauf+' && entry.product != null && entry.product.has_extras" class="extras">
            <p class="extras-header">Extras</p>
            <div class="check" v-for="extra in entry.product.extras" :key="extra.id">
              <div class="form-check">
                <input :checked="entry.extras.includes(extra.id)" @input="switchExtra(extra.id)" class="form-check-input" type="checkbox" :value="entry.extras.includes(extra.id)" id="flexCheckDefault">
                <label class="form-check-label" for="flexCheckDefault">
                  {{ extra.name }} | +{{ extra.extra_price }} $
                </label>
              </div>
            </div>
          </div>

          <div class="input-group mb-3">
            <span class="input-group-text"
              ><i class="fa-solid fa-bookmark"></i></span>
            <input
              type="text"
              id="entry-name"
              class="form-control"
              @input="validateEntry(false)"
              placeholder="Name"
              :value="entry.name"
              required
            />
          </div>

          <div v-if="entry.type != 'Verkauf+' && entry.type != 'Miete-'" class="input-group mb-3">
            <span class="input-group-text currency-input"
              >Währung</span>
            <a :class="{ 'btn-primary': !entry.currencyIsEuro, }" @click.prevent="changeCurrency(false)" class="form-control">
              Schillis
            </a>
            <a :class="{ 'btn-primary': entry.currencyIsEuro }" @click.prevent="changeCurrency(true)" class="form-control">
              Euro
            </a>
          </div>

          <div class="input-group mb-3">
            <span class="input-group-text"
              >
              <i v-if="entry.currencyIsEuro" class="fa-solid fa-euro-sign" :class="{ income: entry.type.includes('+'), expense: entry.type.includes('-') }"></i>
              <i v-else class="fa-solid fa-dollar-sign" :class="{ income: entry.type.includes('+'), expense: entry.type.includes('-') }"></i>
            </span>
            <input
              type="number"
              id="entry-amount"
              class="form-control"
              @input="validateEntry(false)"
              placeholder="Betrag"
              :value="Math.abs(entry.amount) == 0 ? '' : Math.abs(entry.amount)"
              :class="{ income: entry.type.includes('+'), expense: entry.type.includes('-') }"
              required
            />
          </div>

          <div class="input-group mb-3">
            <span class="input-group-text"
              ><i class="fa-solid fa-circle-info"></i
            ></span>
            <textarea
              type="text"
              id="entry-info"
              class="form-control"
              @input="validateEntry(false)"
              placeholder="Beschreibung"
              maxlength="100"
              style="resize: none"
              rows="5"
              cols="50"
              :value="entry.info"
            ></textarea>
          </div>

          <!-- Zeitpunkt -->
        </form>

        <p v-if="entry.image == null" style="font-weight: 300; font-size: 0.9rem">Füge einen Kassenzettel, eine Rechnung oder ähnliches hinzu.</p>

        <img
        v-if="entry.image != null"
          :src="this.entry.image"
          alt="Unternehmen Bild"
          id="productImage"
        />

        <input
          class="form-control form-control-sm col-7"
          type="file"
          id="formFile"
          accept="image/*"
          @change="imageInput()"
        />
        
      </div>
      <div class="card-footer">
        <button class="btn btn-primary save-button" @click="validateEntry(true)">Speichern</button>
        <button v-if="!this.delete && initialEntry.name != ''" class="btn btn-danger delete-button" @click="this.delete = true">Löschen</button>
        <div v-else-if="this.delete && initialEntry.name != ''" class="confirm">
          <button class="btn btn-primary confirm-button" @click="deleteEntry()">
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
import {v4 as uuidv4} from 'uuid';
import { supabase } from '@/supabase';
import { reformatDate, cutSecondsFromTime } from '@/helpers';


export default {
  name: 'EditEntryOverlay',
  props: ['data', 'edit', 'products'],
  components: {
    AlertPopup,
  },
  emits: ['stopEditingEntry', 'deleteEntry'],
  data() {
    return {
      continuePressed: false,
      alertTitle: '',
      alertInfo: '',
      successAlertTitle: 'Erfolgreich',
      successAlertInfo: 'Aktion wurde erfolgreich durchgeführt',
      failureAlertTitle: 'Fehler',
      failureAlertInfo: 'Es ist ein Fehler aufgetreten!',
      delete: false, 
      day: '',
      time: '',
      userName: ''
    }
  },
  setup() {
    var entry = reactive({
      id: null,
      name: '',
      type: '',
      info: '',
      amount: '',
      product: null,
      created_at: '',
      imageBefore: null, 
      image: null, 
      bill_picture: '',
      currencyIsEuro: false,
      variation: '',
      extras: []
    });

    var initialEntry = reactive({
      id: null,
      name: '',
      type: '',
      info: '',
      amount: '',
      product: null,
      created_at: '',
      imageBefore: null, 
      image: null, 
      bill_picture: '',
      currencyIsEuro: false,
      variation: '',
      extras: []
    });

    var product = reactive({
      id: null,
      name: '',
      info: '',
      categories: [],
      price: '',
      delivery: true,
      public: true,
      product_picture: '',
      has_variations: false,
      has_extras: false,
      variations: [],
      extras: []
    });

    const store = useStore();

    return {
      store,
      entry,
      initialEntry,
      product
    };
  },
  mounted() {
    if(this.data != null) {
      this.entry.id = this.data.id;
      this.entry.name = this.data.name;
      this.entry.type = this.data.type;
      this.entry.info = this.data.info;
      this.entry.amount = this.data.amount;
      this.entry.currencyIsEuro = this.data.currencyIsEuro;
      this.entry.variation = this.data.variation;
      this.entry.extras = this.data.extras;

      console.log(this.data.extras)

      this.day = reformatDate(this.data.created_at.split('T')[0]);
      this.time = cutSecondsFromTime(this.data.created_at.split('T')[1]);

      var index = this.products.findIndex(product => product.id == this.data.product);
      if(index != -1) this.entry.product = this.products[index];
      else this.entry.product = this.product;
      
      this.entry.imageBefore = this.data.image;
      this.entry.image = this.data.image;
      this.entry.bill_picture = this.data.bill_picture;

      this.initialEntry.id = this.data.id;
      this.initialEntry.name = this.data.name;
      this.initialEntry.type = this.data.type;
      this.initialEntry.info = this.data.info;
      this.initialEntry.amount = this.data.amount;
      this.initialEntry.currencyIsEuro = this.data.currencyIsEuro;
      this.initialEntry.variation = this.data.variation;
      this.initialEntry.extras = this.data.extras;

      if(index != -1) this.initialEntry.product = this.products[index];
      else this.initialEntry.product = this.product;

      this.initialEntry.imageBefore = this.data.image;
      this.initialEntry.image = this.data.image;
      this.initialEntry.bill_picture = this.data.bill_picture;
    } else {
      this.entry.id = uuidv4();
      this.initialEntry.id = this.entry.id;
      
      this.entry.product = this.product;
      this.initialEntry.product = this.product;
    }

    console.log(this.entry)
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

        this.stopEditingEntry()
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
    async stopEditingEntry() {
      const newEntry = this.store.getters.getCurrentEntry; 
      this.store.commit('setCurrentEntry', null)
      if(newEntry != null) {
        this.entry.id = newEntry.id;
        this.entry.name = newEntry.name;
        this.entry.type = newEntry.type;
        this.entry.info = newEntry.info;
        this.entry.amount = newEntry.amount;
        this.entry.product = newEntry.product;
        this.entry.bill_picture = newEntry.bill_picture;
        this.entry.currencyIsEuro = newEntry.currencyIsEuro;
        this.entry.created_at = newEntry.created_at
        this.entry.userName = newEntry.userName;

        if (newEntry.bill_picture != null) {
          const response = await supabase.storage
            .from('bill-pictures/' + this.store.getters.getUserCompany.id)
            .download(newEntry.bill_picture);
          if (response.data != null) {
            this.entry.image = await response.data.text();
            this.entry.initialImage = this.entry.image
          } 
          if (response.error) console.warn(response.error);
        }
      } else {
        this.entry = null;
      }

      this.$emit('stopEditingEntry', this.entry)
    },
    deleteEntry() {
      this.$emit('deleteEntry', this.entry)
    },
    imageInput() {
      var input = document.getElementById('formFile');

      if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = e => {
          this.entry.image = e.target.result
        };

        reader.readAsDataURL(input.files[0]);
      }

    },
    changeCurrency(toEuro) {
      this.entry.currencyIsEuro = toEuro

      this.entry.amount = 0
    },
    switchExtra(extraId) {
      var index = this.entry.product.extras.findIndex(extra => extra.id == extraId);

      if(this.entry.extras.includes(extraId)) {
        this.entry.extras = this.entry.extras.filter(extra => extra != extraId)
        this.entry.amount -= this.entry.product.extras[index].extra_price
      } else {
        this.entry.extras.push(extraId)
        this.entry.amount += this.entry.product.extras[index].extra_price
      }

    },
    async validateEntry(pressed, productChanged, variationChanged) {
      var nameInput = document.getElementById('entry-name');
      var typeInput = document.getElementById('entry-type');
      var amountInput = document.getElementById('entry-amount');
      var infoInput = document.getElementById('entry-info');
      var variationInput = document.getElementById('entry-product-variation');

      if(this.entry.type == 'Verkauf+') {
        var productInput = document.getElementById('entry-product');

        var findProduct = this.products.find(product => product.id == productInput.value);
        if(findProduct != null) this.entry.product = findProduct;
        else this.entry.product = this.product;

        if(productChanged && this.entry.product.id != null && productInput.value != '' && productInput.value != null) {
          this.entry.name = this.entry.product.name;
          this.entry.amount = this.entry.product.price;

          this.entry.variation = ''
          this.entry.extras = []
        } else {
          this.entry.name = nameInput.value;
          this.entry.amount = amountInput.value;
        }

        if(variationChanged) {
          this.entry.variation = variationInput.value

          if(variationInput.value != '') {
            var findVariation = this.entry.product.variations.find(variation => variation.id == variationInput.value);

            this.entry.name = this.entry.product.name + " " + findVariation.name

            this.entry.amount = findVariation.price

            this.entry.extras.forEach((extraId) => {
              var index = this.entry.product.extras.findIndex(extra => extra.id == extraId)

              this.entry.amount += this.entry.product.extras[index].extra_price
            })
          }
        }
      } else {
        this.entry.name = nameInput.value;
        this.entry.amount = amountInput.value;
      }

      this.entry.type = typeInput.value;
      this.entry.info = infoInput.value;

      if (!pressed && !this.continuePressed) return;

      if (pressed) nameInput.value = nameInput.value.trim();
      if (pressed) infoInput.value = infoInput.value.trim();
      var valid = true;
      
      if(pressed && this.entry.amount != 0) {
        if(this.entry.currencyIsEuro) {
          this.entry.amount = parseFloat(this.entry.amount).toFixed(2).toString();
          amountInput.value = this.entry.amount
        } else {
          this.entry.amount = parseFloat(this.entry.amount).toFixed(0).toString();
          amountInput.value = this.entry.amount
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

      if (
        amountInput.value < -9999 ||
        amountInput.value > 9999 
      ) {
        amountInput.classList.remove('is-valid');
        amountInput.classList.add('is-invalid');
        valid = false;
      } else {
        amountInput.classList.remove('is-invalid');
        amountInput.classList.add('is-valid');
      }

      if (typeInput.value == '') {
        typeInput.classList.remove('is-valid');
        typeInput.classList.add('is-invalid');
        valid = false;
      } else {
        typeInput.classList.remove('is-invalid');
        typeInput.classList.add('is-valid');
      }

      if (this.entry.type == 'Verkauf+' && this.entry.product != null && this.entry.product.has_variations) {
        
        if(this.entry.variation == '') {
          variationInput.classList.remove('is-valid');
          variationInput.classList.add('is-invalid');
          valid = false;
        } else {
          variationInput.classList.remove('is-invalid');
          variationInput.classList.add('is-valid');
        }
      }

      this.continuePressed = true

      if (valid && pressed) {

        if(this.initialEntry == this.entry) {
          this.stopEditingEntry()
        } else {
          this.failureAlertTitle = 'Fehler'
          this.failureAlertInfo = 'Beim Aktualisieren des Eintrags ist ein Fehler aufgetreten. Versuche es später erneut.'
          this.successAlertTitle = ''

          if(this.initialEntry.name == '') {
            this.store.dispatch('addEntry', this.entry)
          } else {
            this.store.dispatch('updateEntry', this.entry)
          }

        }
      }
    }
  }
};
</script>

<style scoped>

.btn-primary {
  color: white;
}

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

.no-image {
  background-color: gray;
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 0.375rem;
}

img {
  max-width: 90%;
  object-fit: scale-down;
  border-radius: 0.375rem;
  position: relative;
  margin: 10px auto 10px auto;
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

.fa-euro-sign {
 padding-left: 5px;
}

.fa-circle-info{
  padding-left: 2px;
}

.fa-bookmark {
  padding-left: 4px;
}

.fa-list {
  padding-left: 2px;
}

.income {
  color: green;
}

.expense {
  color: red;
}

.currency-input {
  width: 90px;
}

.details {
  text-align: left;
  margin: -15px 0 15px 0;
}

.time {
  padding: 0 10px;
}

.fa-bars {
  margin-left: 3px;
}

.extras {
  text-align: left;
  margin-bottom: 20px;
}

.check {
  margin-bottom: 5px;
}

.extras-header {
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.form-check {
  margin-bottom: 2px;
}

</style>

<template>
  <div v-if="data != null" class="container">
    <h1>Service</h1>

    <div class="title">
      <h4>{{ data.title }} <span class="emoji">{{ data.icon }}</span>
      </h4>
    </div>

    <div class="description">
      <p>{{ data.description }}</p>
    </div>

    <div class="price">
      <span v-if="data.price == 0">Kostenlos</span>
      <span class="costs" v-else>Kosten:</span>
      <span :class="{ 'isBusiness': isBusiness  }" v-if="data.price != 0">{{ data.price }} $</span>
      <span class="free" v-if="isBusiness && data.price != 0">0 $</span>
    </div>

    <form class="mx-3">
      <div class="input-group mb-4">
        <span class="input-group-text"
          ><i class="fa-solid fa-circle-info"></i
        ></span>
        <textarea
          type="text"
          id="service-note"
          class="form-control"
          placeholder="Anmerkungen zur Buchung"
          required
          maxlength="300"
          style="resize: none"
          rows="6"
          cols="50"
          :value="service.note"
        ></textarea>
      </div>

      <div class="form-check mt-4">
        <input
          class="form-check-input"
          type="checkbox"
          value=""
          id="service-check1"
          @change="validateBooking(false)"
        />
        <label class="form-check-label" for="acceptCheck">
          Ich akzeptiere die
          <a href="/agb" class="text-primary"
            >Allgemeinen Geschäftsbedingungen</a
          >
        </label>
      </div>
      <div v-if="!isBusiness" class="form-check mt-2 mb-4">
        <input
          class="form-check-input"
          type="checkbox"
          value=""
          id="service-check2"
          @change="validateBooking(false)"
        />
        <label class="form-check-label" for="acceptCheck">
          Ich verpflichte mich, den vollen
          Betrag des Services zu bezahlen
        </label>
      </div>
    </form>

    <button
      type="button"
      @click="validateBooking(true)"
      class="btn btn-primary order-button mx-3"
    >
      <div class="loading-button">Buchen</div>
      <div class="spinner">
        <span
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        <span class="sr-only">Loading...</span>
      </div>
    </button>
  </div>
</template>

<script>
import { useStore, mapGetters } from 'vuex';
import { computed, reactive } from 'vue';

export default {
  name: 'BookServiceView',
  data() {
    const service = reactive({
      type: '',
      price: 0,
      buyer: null,
      company: null,
      note: '',
    });

    return {
      service,
      data: null,
      isBusiness: false,
      bookingPressed: false
    }
  },
  setup() {
    const store = useStore();

    const userData = computed(() => store.state.user);

    return {
      store,
      userData,
    };
  },
  mounted() {
    this.data = history.state.data

    this.isBusiness = this.store.getters.getUserCompany.abo == 'Business'

    this.service.type = history.state.data.title;
    this.service.price = this.isBusiness ? 0 : history.state.data.price;
    this.service.buyer = this.userData.id
    this.service.company = this.store.getters.getUserCompany.id
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
      } else {
        Array.from(spinners).forEach((spinner) => {
          spinner.style.visibility = 'hidden';
          spinner.style.position = 'absolute';
        });

        Array.from(loadingButtons).forEach((button) => {
          button.style.visibility = 'visible';
          button.style.position = 'relative';
        });
      }
    },
  },
  methods: {
    validateBooking(pressed) {
      var noteInput = document.getElementById('service-note');
      var checkInput1 = document.getElementById('service-check1');
      var checkInput2 = document.getElementById('service-check2');

      if (!pressed && !this.bookingPressed) return;

      if (pressed) noteInput.value = noteInput.value.trim();
      var valid = true;

      this.service.note = noteInput.value;

      if (!checkInput1.checked) {
        checkInput1.classList.add('is-invalid');
        checkInput1.classList.remove('is-valid');
        valid = false;
      } else {
        checkInput1.classList.remove('is-invalid');
        checkInput1.classList.add('is-valid');
      }

      if(!this.isBusiness) {
        if (!checkInput2.checked) {
          checkInput2.classList.add('is-invalid');
          checkInput2.classList.remove('is-valid');
          valid = false;
        } else {
          checkInput2.classList.remove('is-invalid');
          checkInput2.classList.add('is-valid');
        }
      }

      this.bookingPressed = true;

      if (valid && pressed) {
        this.bookingPressed = false;
        this.store.dispatch('bookService', this.service)
      }
    },
  },
};
</script>

<style scoped>
h1 {
  margin: 30px 0 30px 10px;
}

form {
  margin-bottom: 30px;
}

.container {
  text-align: left;
}

.input-group-text {
  width: 40px;
}

.fa-solid {
  margin-right: 10px;
  margin-bottom: 10px;
}

.btn-primary {
  background-color: #00a100;
  border-color: #00a100;
  padding: 4px 10px 5px 10px;
  margin: 10px 0 20px 10px;
}

.btn-primary:hover {
  background-color: #007400;
  border-color: #007400;
}

div {
  text-align: left;
}

span {
  font-weight: 600;
}

p {
  font-weight: 300;
}

.emoji {
  font-size: 1.8rem;
  margin-left: 10px;
}

.price {
  font-size: 1.1rem;
}

.isBusiness {
  text-decoration-line: line-through;
  text-decoration-style: solid;
  text-decoration-color: #f6b600;
  text-decoration-thickness: 2px;
}

.free {
  color: #f6b600;
  margin-left: 5px;
}

.btn {
  padding: 3px 8px 3px 8px;
}

.title {
  margin: 0 15px;
}

.description {
  margin: 0 15px;
}

.spinner {
  visibility: hidden;
  position: absolute;
}

.price {
  margin: 0 15px 20px 15px;
}

.costs {
  margin-right: 10px;
  font-weight: 400;
}
</style>

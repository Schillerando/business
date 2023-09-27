<template>
  <div>

    <AlertPopup :title="this.alertTitle" :info="this.alertInfo" />

    <div class="container">
      <div class="row justify-content-center">
        <div class="mb-4">
          <div class="card container-card p-4 pb-0">
            <div class="card-body">
              <h1>Abo Auswählen</h1>
              <p class="text-muted">
                Wähle ein Abonnement für dein Unternehmen "{{ store.getters.getUserCompany.name }}"
              </p>

              <!-- 0 -->
              <div v-if="this.page == 0">
                <AboOptions :abo="form.abo" @chooseAbo="chooseAbo($event)"></AboOptions>
              </div>

              <!-- 1 -->
              <div v-else-if="this.page == 1">
                <h4>Bedingungen</h4>

                <div
                  class="card mb-4 p-4"
                  style="overflow-y: scroll; height: 400px"
                >
                <AGB />
              </div>

                <div class="form-check mb-4">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="acceptCheck"
                    @change="validatePage(1, false)"
                  />
                  <label class="form-check-label" for="acceptCheck">
                    Bedingungen akzeptieren
                  </label>
                </div>
              </div>

              <div style="height: 80px">
                <div class="back" v-if="this.page > 0">
                  <button
                    type="button"
                    @click="this.page--"
                    class="btn btn-secondary"
                  >
                    <div class="loading-button">Zurück</div>
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
  
  
                <div class="continue" v-if="this.page != 4">
                  <button
                    type="button"
                    @click="validatePage(page, true)"
                    class="btn btn-primary"
                  >
                    <div class="loading-button">Weiter</div>
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
  
                <div class="continue" v-if="this.page == 4">
                  <button
                    type="button"
                    @click="validatePage(page, true)"
                    class="btn btn-primary"
                  >
                    <div class="loading-button">Bestätigen</div>
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
              </div>
            </div>
          </div>  

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { useStore, mapGetters } from 'vuex';
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.js';
import AlertPopup from '@/shared/components/AlertPopup.vue';
import AboOptions from '../components/AboOptions'
import AGB from '../components/AGB.vue';

export default {
  name: 'UpdateAboView',
  components: {
    AlertPopup,
    AboOptions,
    AGB
  },
  data() {
    return {
      page: 0,
      continuePressed: false,
      action: '',
      alertTitle: '',
      alertInfo: '',
      successAlertTitle: 'Erfolgreich',
      successAlertInfo: 'Aktion wurde erfolgreich durchgeführt',
      failureAlertTitle: 'Fehler',
      failureAlertInfo: 'Es ist ein Fehler aufgetreten!',
    };
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

        if (this.alertTitle == '') return;
        alertModal = new Modal(document.getElementById('alertModal'), {});
        alertModal.show();
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

        if (this.alertTitle == '') return;
        var alertModal = new Modal(document.getElementById('alertModal'), {});
        alertModal.show();

        if (this.action == 'register') {
          this.signUpFailure();
        }
      }
    },
  },
  setup() {
    const form = reactive({
      abo: null,
    });

    const store = useStore();

    return {
      store,
      form
    };
  },
  methods: {
    chooseAbo(abo) {
      this.form.abo = abo;
      this.validatePage(0, false);
    },
    async validatePage(page, pressed) {
      if (!pressed && !this.continuePressed) return;

      
      if (page == 0) {
        const invalidAbo = document.getElementById('alert-danger');
        var valid = false;

        if (this.form.abo == null) {
          invalidAbo.style.visibility = 'visible';
          invalidAbo.style.position = 'relative';
        } else {
          invalidAbo.style.visibility = 'hidden';
          invalidAbo.style.position = 'absolute';
          valid = true;
        }

        this.continuePressed = true;

        if (valid && pressed) {
          console.log(this.form);

          this.continuePressed = false;
          this.page++;
        }
      } else if (page == 1) {
        const check = document.getElementById('acceptCheck');
        valid = false;

        if (!check.checked) {
          check.classList.add('is-invalid');
          check.classList.remove('is-valid');
        } else {
          check.classList.remove('is-invalid');
          check.classList.add('is-valid');
          valid = true;
        }

        this.continuePressed = true;

        if (valid && pressed) {
          this.continuePressed = false;
          this.updateAbo();
        }
      }
    },
    updateAbo() {
      this.store.dispatch('updateAbo', this.form);

      this.failureAlertTitle = 'Aktualisierung fehlgeschlagen';
      this.failureAlertInfo =
        'Bei der Aktualisierung des Abonnements ist ein Fehler aufgetreten! Versuche es später erneut.';
      this.successAlertTitle = '';
    },
  },
};
</script>

<style scoped>
.container-card {
  position: relative;
  width: 95%;
  margin: 2.5% auto;
  text-align: left;
}

.progress-container {
  position: relative;
  width: 95%;
  margin: 0 auto;
}

h3 {
  font-weight: 500;
}

@media (max-width: 576px) {
  .container-card {
    text-align: center;
  }
}

.note {
  padding: 0 50px 10px 50px;
  text-align: center;
  font-size: 0.8rem; 
  color: rgb(17, 17, 17);
}

.continue {
  position: absolute;
  right: 20px;
  bottom: 20px;
}

.row {
  padding-bottom: 0;
}

.back {
  position: absolute;
  left: 20px;
  bottom: 20px;
}

.skip {
  position: absolute;
  right: 110px;
  bottom: 20px;
}

.text-muted {
  color: #9faecb !important;
}

p {
  margin-top: 0;
  margin-bottom: 1rem;
}
.mb-3 {
  margin-bottom: 1rem !important;
}

.spinner {
  visibility: hidden;
  position: absolute;
}

.progress-bar {
  background-color: #00a100;
}

.input-group-text {
  width: 40px;
  padding: 0;
  padding-left: 10px;
}

#formFile {
  margin-bottom: 10px;
}

.abo .card {
  text-align: center;
}

.abo .card:hover {
  cursor: pointer;
}

.flex-card > div > div.card {
  height: calc(100% - 15px);
  margin-bottom: 15px;
}

.selected {
  border-color: rgb(0, 94, 201);
  border-width: 2px;
}

.alert-danger {
  text-align: center;
  visibility: hidden;
  position: absolute;
}

.card-footer {
  background-color: white;
}
</style>

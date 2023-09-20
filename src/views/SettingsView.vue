<template>
  <div>
    <AlertPopup :title="this.alertTitle" :info="this.alertInfo" />

    <div class="container">
      <div class="row">

        <div class="col-12">
          <div
            v-if="companyData.verified == false"
            class="alert alert-warning"
            role="alert"
          >
            Dein Unternehmen wird noch überprüft. Erst nach Bestätigung werden dein Unternehmen und dessen Angebote auf schillerando.de zu sehen sein.
          </div>
        </div>
        
        <div class="col-lg-8">
          <div class="card m-1">
            <div class="card-header">Informationen</div>
            <div class="card-body">
              <div class="image">
                <div v-if="form.image == null" class="no-image">
                  <i class="fa-solid fa-image fa-2xl"></i>
                </div>
                <img
                  v-else
                  :src="this.form.image"
                  alt="Unternehmen Bild"
                  id="companyImage"
                />
              </div>

              <input
                class="form-control form-control-sm mb-4"
                type="file"
                id="formFile"
                accept="image/*"
                @change="imageInput()"
                :disabled="!isCompanyEditing"
              />

              <form class="needs-validation" novalidate>
                <div class="input-group mb-3">
                  <span class="input-group-text"
                    ><i class="fa-solid fa-shop"></i
                  ></span>
                  <input
                    type="text"
                    id="company-name"
                    class="form-control"
                    placeholder="Name"
                    @input="validateCompanyChange(false)"
                    :value="companyData.name"
                    :disabled="!isCompanyEditing"
                    required
                  />
                </div>
                <div class="input-group mb-3">
                  <span class="input-group-text"
                    ><i class="fa-solid fa-location-dot"></i
                  ></span>
                  <input
                    type="text"
                    id="company-location"
                    class="form-control"
                    placeholder="Raum, Pausenhof, ..."
                    @input="validateCompanyChange(false)"
                    :value="companyData.location"
                    :disabled="!isCompanyEditing"
                    required
                  />
                </div>
    
                <div class="input-group mb-3">
                  <span class="input-group-text"
                    ><i class="fa-solid fa-list"></i
                  ></span>
                  <select
                    class="form-select"
                    id="company-category"
                    aria-label="Default select example"
                    :value="companyData.categories[0]"
                    @change="validateCompanyChange(false)"
                    :disabled="!isCompanyEditing"
                    required
                    :color="{ isCompanyEditing: 'red' }"
                  >
                    <option selected>Kategorie</option>
                    <option value="Gastronomie">Gastronomie</option>
                    <option value="Kultur">Kultur</option>
                    <option value="Dienstleistung">
                      Dienstleistung
                    </option>
                    <option style="color:red" value="Gastronomie & Dienstleistung">
                      Gastronomie & Dienstleistung
                    </option>
                  </select>
                </div>
    
                <div class="input-group mb-3">
                  <span class="input-group-text"
                    ><i class="fa-solid fa-circle-info"></i
                  ></span>
                  <textarea
                    type="text"
                    id="company-info"
                    class="form-control"
                    placeholder="Beschreibung"
                    required
                    maxlength="400"
                    style="resize: none"
                    rows="5"
                    cols="50"
                    @input="validateCompanyChange(false)"
                    :value="companyData.info"
                    :disabled="!isCompanyEditing"
                  ></textarea>
                </div>
              </form>
    
              <div
                v-if="!isCompanyEditing"
                class="py-2"
                style="width: fit-content"
              >
                <button
                  type="button"
                  class="btn btn-primary px-2 mx-2"
                  @click="editCompany()"
                >
                  Bearbeiten
                </button>
              </div>
              <div v-else style="display: flex">
                <div class="py-2 mx-0 edit-buttons">
                  <button
                    type="button"
                    class="btn btn-primary px-2 mx-2"
                    @click="validateCompanyChange(true)"
                  >
                    <div class="loading-button">Speichern</div>
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
                <div class="py-2 mx-0 edit-buttons">
                  <button
                    type="button"
                    class="btn btn-warning px-2 mx-2"
                    @click="cancelCompanyChange()"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      
        <div class="col-lg-4">
          <div class="card m-1">
            <div class="card-header">Mitarbeiter</div>
            <div class="card-body">
              <div
                v-for="(employee, index) in this.employees"
                :key="employee"
              >
                <div class="input-group mb-3">
                  <span class="input-group-text"
                    ><i class="fa fa-envelope"></i
                  ></span>
                  <input
                    type="email"
                    class="form-control employees-mail"
                    placeholder="Email"
                    data-regex="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                    :value="employees[index]"
                    :disabled="!isEmployeesEditing"
                    required
                    @input="validateEmployeesChange(false, index)"
                  />
                  <button
                    v-if="isEmployeesEditing"
                    class="input-group-text"
                    @click="employees.splice(index, 1)"
                  >
                    <i class="fa fa-trash"></i>
                  </button>
                </div>
              </div>
    
              <div v-if="userData.user_metadata.isCompanyLeader">
                <div
                  v-if="!isEmployeesEditing"
                  class="py-2"
                  style="width: fit-content"
                >
                  <button
                    type="button"
                    class="btn btn-primary px-2 mx-2"
                    @click="editEmployees()"
                  >
                    Bearbeiten
                  </button>
                </div>
                <div v-else>
                  <button
                    type="button"
                    v-if="this.employees.length < 26"
                    @click="addEmployee()"
                    class="btn btn-primary my-4"
                    style="width: max-content; display: block"
                  >
                    Mitarbeiter hinzufügen
                  </button>
                  <div style="display: flex">
                    <div class="py-2 mx-0 edit-buttons">
                      <button
                        type="button"
                        class="btn btn-primary px-2 mx-2"
                        @click="validateEmployeesChange(true, 0)"
                      >
                        <div class="loading-button">Speichern</div>
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
                    <div class="py-2 mx-0 edit-buttons">
                      <button
                        type="button"
                        class="btn btn-warning px-2 mx-2"
                        @click="cancelEmployeesChange()"
                      >
                        Abbrechen
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-8">
          <div class="card m-1">
            <div class="card-header">Extras</div>
            <div class="card-body">

              <form class="needs-validation" novalidate>
                <h5>Instagram</h5>

                <div class="input-group mb-3">
                  <span class="input-group-text"
                    ><i class="fa-brands fa-instagram fa-lg"></i></span>
                  <input
                    type="text"
                    id="company-instagram"
                    class="form-control"
                    placeholder="Instagram Name"
                    @input="validateExtrasChange(false)"
                    :value="companyData.socials['instagram']"
                    :disabled="!isExtrasEditing"
                    required
                  />
                </div>
              </form>

              <h5 class="mt-4">Standort</h5>

              <p style="text-align: left; font-size: 1rem; font-weight: 300;" v-if="isExtrasEditing">Wähle möglichst genau den Standort deines Unternehmens per Click auf die Karte aus.</p>

              <div v-if="companyData != null" class="sizing">
                <div class="mapWrapper">
                  <MapPicker @pickCoordinates="pickCoordinates($event)" :data="companyData.coordinates" :isExtrasEditing="isExtrasEditing" :key="key" class="map" />
                </div>
              </div>
    
              <div
                v-if="!isExtrasEditing"
                class="py-2"
                style="width: fit-content"
              >
                <button
                  type="button"
                  class="btn btn-primary px-2 mx-2"
                  @click="editExtras()"
                >
                  Bearbeiten
                </button>
              </div>
              <div v-else style="display: flex">
                <div class="py-2 mx-0 edit-buttons">
                  <button
                    type="button"
                    class="btn btn-primary px-2 mx-2"
                    @click="validateExtrasChange(true)"
                  >
                    <div class="loading-button">Speichern</div>
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
                <div class="py-2 mx-0 edit-buttons">
                  <button
                    type="button"
                    class="btn btn-warning px-2 mx-2"
                    @click="cancelExtrasChange()"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card m-1">
            <div class="card-header">QR-Code</div>
            <div class="card-body">
              <p>QR-Code zur Unternehmensseite</p>

              <QRCode :link="link" :scale="7" />
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '../supabase';
import { reactive } from 'vue';
import { useStore, mapGetters } from 'vuex';
import { computed } from 'vue';
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.js';
import AlertPopup from '../components/AlertPopup.vue';
import MapPicker from '@/components/MapPicker.vue';
import QRCode from '@/components/QRCode.vue';

export default {
  name: 'SettingsView',
  components: {
    AlertPopup,
    MapPicker,
    QRCode
},
  data() {
    return {
      isCompanyEditing: false,
      isEmployeesEditing: false,
      isExtrasEditing: false,
      saveCompanyPressed: false,
      saveEmployeesPressed: false,
      saveExtrasPressed: false,
      employees: [],
      alertTitle: '',
      alertInfo: '',
      successAlertTitle: '',
      successAlertInfo: '',
      failureAlertTitle: 'Fehler',
      failureAlertInfo: 'Es ist ein Fehler aufgetreten!',
      key: 0
    };
  },
  computed: {
    ...mapGetters(['getState']),
    link() {
      if(this.companyData == null) return ''
      return process.env.VUE_APP_MAIN_URL + '/' + this.companyData.alias
    }
  },
  setup() {
    const store = useStore();

    const userData = computed(() => store.state.user);
    const companyData = computed(() => store.state.userCompany);

    const form = reactive({
      name: '',
      location: '',
      category: 'Kategorie',
      info: '',
      employees: [''],
      image: null, 
      unchangedImage: null, 
      coordinates: []
    });

    return {
      store,
      userData,
      companyData,
      form,
    };
  },
  watch: {
    companyData: function () {
      const employees = this.companyData.employees;
      employees.forEach((employee, index) => {
        this.employees[index] = employee;
      });
    },
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
      }
    },
  },
  async created() {
    this.employees = this.companyData.employees;
  },
  async mounted() {
    if (this.companyData.header_picture != null) {
      const response = await supabase.storage
        .from('public/sellers-headings')
        .download(this.companyData.header_picture);
      if (response.data != null) {
        this.form.image = await response.data.text();
        this.form.unchangedImage = await response.data.text();
      } 
      if (response.error) console.warn(response.error);
    }
  },
  methods: {
    pickCoordinates(coordinates) {
      if(coordinates != null && coordinates.lat != null && coordinates.lng != null)
      this.form.coordinates = [coordinates.lat, coordinates.lng]
    },
    imageInput() {
      var input = document.getElementById('formFile');

      if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = e => {
          this.form.image = e.target.result
        };

        reader.readAsDataURL(input.files[0]);
      }

    },
    addEmployee() {
      var emailInputs = document.getElementsByClassName('employees-mail');
      var index = 0;
      Array.from(emailInputs).forEach((input) => {
        this.employees[index] = input.value;
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
        index++;
      });

      this.employees.push('');
    },
    cancelChanges() {
      this.cancelCompanyChange();
    },
    editCompany() {
      this.isCompanyEditing = true;

      var nameInput = document.getElementById('company-name');
      var locationInput = document.getElementById('company-location');
      var categoryInput = document.getElementById('company-category');
      var descriptionInput = document.getElementById('company-info');
      nameInput.disabled = false;
      locationInput.disabled = false;
      categoryInput.disabled = false;
      descriptionInput.disabled = false;
    },
    editExtras() {
      this.isExtrasEditing = true;

      var instagramInput = document.getElementById('company-instagram');
      instagramInput.disabled = false;
    },
    editEmployees() {
      this.isEmployeesEditing = true;

      var emailInputs = document.getElementsByClassName('employees-mail');
      Array.from(emailInputs).forEach((input) => {
        input.disabled = false;
      });
    },
    async validateCompanyChange(pressed) {
      if (!pressed && !this.saveCompanyPressed) return;

      var nameInput = document.getElementById('company-name');
      var locationInput = document.getElementById('company-location');
      var categoryInput = document.getElementById('company-category');
      var descriptionInput = document.getElementById('company-info');

      if (pressed) nameInput.value = nameInput.value.trim();
      if (pressed) locationInput.value = locationInput.value.trim();
      if (pressed) descriptionInput.value = descriptionInput.value.trim();
      var valid = true;

      if (nameInput.value.trim().length < 3) {
        nameInput.classList.remove('is-valid');
        nameInput.classList.add('is-invalid');
        valid = false;
      } else {
        nameInput.classList.remove('is-invalid');
        nameInput.classList.add('is-valid');
      }

      if (
        locationInput.value.trim().length < 3 ||
        locationInput.value.trim().length > 40
      ) {
        locationInput.classList.remove('is-valid');
        locationInput.classList.add('is-invalid');
        valid = false;
      } else {
        locationInput.classList.remove('is-invalid');
        locationInput.classList.add('is-valid');
      }

      if (categoryInput.value == 'Kategorie') {
        categoryInput.classList.remove('is-valid');
        categoryInput.classList.add('is-invalid');
        valid = false;
      } else {
        categoryInput.classList.remove('is-invalid');
        categoryInput.classList.add('is-valid');
      }

      if (descriptionInput.value.trim().length < 10) {
        descriptionInput.classList.remove('is-valid');
        descriptionInput.classList.add('is-invalid');
        valid = false;
      } else {
        descriptionInput.classList.remove('is-invalid');
        descriptionInput.classList.add('is-valid');
      }

      this.saveCompanyPressed = true;

      if (valid && pressed) {
        this.store.commit('setState', 'loading');

        if (
          nameInput.value.replace(/\s/g, '').toLowerCase() !=
          this.companyData.alias
        ) {
          const { data, error } = await supabase
            .from('companies')
            .select()
            .eq('alias', nameInput.value.replace(/\s/g, '').toLowerCase());

          if (error || data[0] != null) {
            nameInput.classList.remove('is-valid');
            nameInput.classList.add('is-invalid');

            this.form.name = nameInput.value;
            this.form.location = locationInput.value;
            this.form.category = categoryInput.value;
            this.form.info = descriptionInput.value;

            this.failureAlertTitle = 'Name schon vergeben';
            this.failureAlertInfo =
              'Es gibt bereits ein Unternehmen mit diesem Namen. Bitte wähle einen anderen!';
            this.store.commit('setState', 'failure');

            return;
          }
        }

        this.form.name = nameInput.value;
        this.form.location = locationInput.value;
        this.form.info = descriptionInput.value;
        this.form.category = categoryInput.value;

        this.saveCompany();
      }
    },
    async validateExtrasChange(pressed) {
      if (!pressed && !this.saveExtrasPressed) return;

      var instagramInput = document.getElementById('company-instagram');

      if (pressed) instagramInput.value = instagramInput.value.trim();
      var valid = true;

      this.saveExtrasPressed = true;

      if (valid && pressed) {
        this.store.commit('setState', 'loading');

        if (
          instagramInput.value.replace(/\s/g, '').toLowerCase() !=
          this.companyData.socials['instagram']
        ) {
          try {
            const { error } = await supabase
            .from('companies')
            .update({
              socials: {'instagram': instagramInput.value.replace(/\s/g, '').toLowerCase() } 
            })
            .eq('id', this.companyData.id);

            if (error) throw error;
          } catch (e) {
            console.log(e)
            instagramInput.classList.remove('is-valid');
            instagramInput.classList.add('is-invalid');

            this.store.commit('setState', 'failure');
          }
          
        }

        if (
          this.form.coordinates !=
          this.companyData.coordinates && this.form.coordinates != []
        ) {
          try {
            const { error } = await supabase
            .from('companies')
            .update({
              coordinates: this.form.coordinates 
            })
            .eq('id', this.companyData.id);

            if (error) throw error;

            this.companyData.coordinates = this.form.coordinates
          } catch (e) {
            console.log(e)

            this.store.commit('setState', 'failure');
          }
          
        }

        instagramInput.classList.remove('is-valid');
        instagramInput.classList.remove('is-invalid');

        this.store.commit('setState', 'success');
        this.isExtrasEditing = false;

        this.key++;
      }
    },
    validateEmployeesChange(pressed, index) {
      if (!pressed && !this.saveEmployeesPressed) return;

      var emailInputs = document.getElementsByClassName('employees-mail');
      var regex = emailInputs[index].getAttribute('data-regex');
      var valid = true;

      if (!pressed) {
        if (!emailInputs[index].value.match(regex)) {
          emailInputs[index].classList.remove('is-valid');
          emailInputs[index].classList.add('is-invalid');
          valid = false;
        } else {
          emailInputs[index].classList.remove('is-invalid');
          emailInputs[index].classList.add('is-valid');
        }
      } else {
        Array.from(emailInputs).forEach((input) => {
          if (!input.value.match(regex)) {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            valid = false;
          } else {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
          }
        });
      }

      this.saveEmployeesPressed = true;

      if (valid && pressed) this.saveEmployees();
    },
    async saveCompany() {
      try {
        this.isCompanyEditing = false;
        this.saveCompanyPressed = false;

        var nameInput = document.getElementById('company-name');
        var locationInput = document.getElementById('company-location');
        var categoryInput = document.getElementById('company-category');
        var descriptionInput = document.getElementById('company-info');

        console.log(this.companyData)
        console.log(this.form)

        const { data, error } = await supabase
          .from('companies')
          .update({
            alias: this.form.name.replace(/\s/g, '').toLowerCase(),
            name: this.form.name,
            categories: [this.form.category],
            location: this.form.location,
            info: this.form.info,
          })
          .eq('id', this.companyData.id)
          .select();

        console.log(data)
        console.log(error)

        if (error) throw error;

        if (this.form.image != null && this.form.image != this.form.unchangedImage) {

          {
            const { error } = await supabase
              .storage
              .from('sellers-headings')
              .remove([data[0].header_picture])

            if (error) throw error;
          }

          var type = this.form.image.substring(this.form.image.indexOf(':'), this.form.image.indexOf(';')).replace(':', '')
          var fileName = data[0].id + '.' + type.split('/')[1]

          {
            const { error } = await supabase
              .storage
              .from('sellers-headings')
              .upload(fileName, this.form.image, {
                cacheControl: '3600',
                upsert: true,
                contentType: type
              })

            if (error) throw error;

          }

          {
            const { error } = await supabase
              .from('companies')
              .update({ header_picture: fileName })
              .eq('id', data[0].id)

              if (error) throw error;
          }
        }

        this.successAlertTitle = '';
        this.store.commit('setState', 'success');

        nameInput.classList.remove('is-valid');
        nameInput.classList.remove('is-invalid');
        locationInput.classList.remove('is-valid');
        locationInput.classList.remove('is-invalid');
        categoryInput.classList.remove('is-valid');
        categoryInput.classList.remove('is-invalid');
        descriptionInput.classList.remove('is-valid');
        descriptionInput.classList.remove('is-invalid');
      } catch (error) {
        this.failureAlertTitle = 'Fehler';
        this.failureAlertInfo =
          'Beim Ändern der Unternehmens-Daten ist ein Fehler aufgetreten!';
        this.store.commit('setState', 'failure');
        this.cancelCompanyChange();
        console.log(error.error_description || error.message);
      }
    },
    async saveEmployees() {
      try {
        const employees = [];

        var emailInputs = document.getElementsByClassName('employees-mail');
        Array.from(emailInputs).forEach((input) => {
          if (input.value != '') employees.push(input.value);
          input.classList.remove('is-valid');
          input.classList.remove('is-invalid');
        });

        if (
          JSON.stringify(employees) !=
          JSON.stringify(this.companyData.employees)
        ) {
          const { error } = await supabase
            .from('companies')
            .update({ employees: employees })
            .eq('user_uid', this.userData.id);

          if (error) throw error;
        }

        this.isEmployeesEditing = false;
        this.saveEmployeesPressed = false;

        Array.from(emailInputs).forEach((input) => {
          input.classList.remove('is-valid');
          input.classList.remove('is-invalid');
        });
      } catch (error) {
        this.failureAlertTitle = 'Fehler';
        this.failureAlertInfo =
          'Beim Ändern der Mitarbeiter ist ein Fehler aufgetreten!';
        this.store.commit('setState', 'failure');
        this.cancelEmployeesChange();
        console.log(error.error_description || error.message);
      }
    },
    cancelCompanyChange() {
      this.isCompanyEditing = false;
      this.saveCompanyPressed = false;

      var nameInput = document.getElementById('company-name');
      var locationInput = document.getElementById('company-location');
      var categoryInput = document.getElementById('company-category');
      var descriptionInput = document.getElementById('company-info');

      nameInput.value = this.companyData.name;
      locationInput.value = this.companyData.location;
      categoryInput.value = this.companyData.categories[0];
      descriptionInput.value = this.companyData.info;

      nameInput.classList.remove('is-valid');
      nameInput.classList.remove('is-invalid');
      locationInput.classList.remove('is-valid');
      locationInput.classList.remove('is-invalid');
      categoryInput.classList.remove('is-valid');
      categoryInput.classList.remove('is-invalid');
      descriptionInput.classList.remove('is-valid');
      descriptionInput.classList.remove('is-invalid');
    },
    cancelExtrasChange() {
      this.isExtrasEditing = false;
      this.saveExtrasPressed = false;

      var instagramInput = document.getElementById('company-instagram');
      instagramInput.value = this.companyData.socials['instagram'];

      this.form.coordinates = []
      this.key++;

      instagramInput.classList.remove('is-valid');
      instagramInput.classList.remove('is-invalid');
    },
    cancelEmployeesChange() {
      this.isEmployeesEditing = false;
      this.saveEmployeesPressed = false;

      this.employees = this.companyData.employees.filter(
        (employee) => employee != ''
      );

      console.log(this.employees);

      var emailInputs = document.getElementsByClassName('employees-mail');
      var index = 0;
      Array.from(emailInputs).forEach((input) => {
        input.value = this.employees[index];
        input.classList.remove('is-valid');
        input.classList.remove('is-invalid');
        index++;
      });
    },
  },
};
</script>

<style scoped>
.form-switch {
  width: fit-content;
  position: relative;
  margin: 0 auto;
}

.container {
  position: relative;
  text-align: center;
  width: 96%;
  padding: 0;
  margin: 50px auto;
  font-size: 1.1rem;
}

.card {
  margin: 10px 0;
}

.row {
  margin: 0;
  padding: 0;
}

.d-flex {
  flex-direction: row;
}

.credit {
  margin: auto 0;
  font-size: 1.5rem;
  font-weight: 300;
}

.credit-number {
  font-size: 2rem;
  font-weight: 600;
}

.data {
  text-align: left;
  font-weight: 300;
}

.action {
  background-color: #00a100;
  color: white;
}

.register {
  width: fit-content;
  margin: 0 auto;
}

.order .card div {
  margin: 5px 10px;
}

.product-count {
  width: 40px;
}

.product-count i {
  margin-left: 2px;
}

.price {
  width: 70px;
}

.input-group-text {
  width: 40px;
  padding: 0;
  padding-left: 10px;
}

.fa-location-dot {
  position: relative;
  left: 3px;
}

.fa-envelope {
  position: relative;
  left: 1px;
}
.fa-user {
  position: relative;
  left: 3px;
}

.fa-trash {
  position: relative;
  left: 1px;
  color: red;
}

.spinner {
  visibility: hidden;
  position: absolute;
}

.edit-buttons {
  display: inline;
  float: left;
  width: fit-content;
}

.pay-setup:hover {
  transform: scale(1.02);
}

.pay-setup:active {
  transform: scale(0.98);
}

.pay-setup {
  border: none;
  transition: all 0.2s ease-in-out;
}

.image {
  width: 100%;
  position: relative;
  padding-bottom: 56.25%;
  margin-bottom: 10px;
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

h5 {
  text-align: left;
}

.sizing {
  max-width: 70vh;
  margin-bottom: 30px;
}

.mapWrapper {
  position: relative;
  width: calc(100%);
  padding-bottom: calc(100%);
  margin: 0;
}

.map {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  left: 0;
  border-style: groove;
  border-color: #ebebeb;
  border-width: 1px;
}
</style>

<template>
  <div class="row abo flex-card">
    <div class="col-lg-4">
      <div
        class="card mb-4 rounded-3 shadow-sm"
        :class="{ selected: abo == 'Standard' }"
        @click="chooseAbo('Standard')"
      >
        <div class="card-header py-3">
          <h4 class="info-title my-0 fw-normal">Standard</h4>
        </div>
        <div class="card-body">
          <ul class="list-unstyled mt-3 mb-4">
            <li class="info-text">
              <CompanyBadge :verified="true" style="zoom: 80%; margin-right: 5px"/> Schillerando Partner
            </li>
            <li class="info-text advantage">Kostenlose Buchhaltung</li>

            <li class="info-text">Gebührenpflichtige Lieferungen<sup>1</sup></li>
            <li class="info-text">Gebührenpflichtige Services</li>
            <li class="info-text">-</li>
          </ul>
        </div>
        <div class="card-footer">
          <h4 class="mt-2">50$<sup>2</sup></h4>
        </div>
      </div>
    </div>
    <div class="col-lg-4">
      <div
        class="card mb-4 rounded-3 shadow-sm"
        :class="{ selected: abo == 'Delivery' }"
        @click="chooseAbo('Delivery')"
      >
        <div class="card-header py-3">
          <h4 class="info-title my-0 fw-normal">Delivery</h4>
        </div>
        <div class="card-body">
          <ul class="list-unstyled mt-3 mb-4">
            <li class="info-text">
              <CompanyBadge :verified="true" style="zoom: 80%; margin-right: 5px"/> Schillerando Partner
            </li>
            <li class="info-text">Kostenlose Buchhaltung</li>
            <li class="info-text advantage">Kostenlose Lieferungen</li>
            <li class="info-text">Gebührenpflichtige Services</li>
            <li class="info-text">-</li>
          </ul>
        </div>
        <div class="card-footer">
          <h4 class="mt-2">100$<sup>2</sup></h4>
        </div>
      </div>
    </div>
    <div class="col-lg-4">
      <div
        class="card mb-4 rounded-3 shadow-sm"
        :class="{ selected: abo == 'Business' }"
        @click="chooseAbo('Business')"
      >
        <div class="card-header py-3">
          <h4 class="info-title my-0 fw-normal">Business <span style="margin-left: 10px; font-weight: 500;" class="badge text-bg-danger">-20%</span></h4>
        </div>
        <div class="card-body">
          <ul class="list-unstyled mt-3 mb-4">
            <li class="info-text">
              <CompanyBadge :verified="true" :premium="true" style="zoom: 80%; margin-right: 5px"/> Premium Partner
            </li>
            <li class="info-text">Kostenlose Buchhaltung</li>

            <li class="info-text">Kostenlose Lieferungen</li>
            <li class="info-text advantage">
              Kostenlose Services
            </li>
            <li class="info-text advantage">Bevorzugung</li>
          </ul>
        </div>
        <div class="card-footer">
          <h4 class="mt-2"><span style="text-decoration: line-through">200$</span><span style="color: red; margin-left: 10px;">160$</span><sup>2</sup></h4>
        </div>
      </div>
    </div>

    <div v-if="later" class="col-12" style="margin-bottom: 40px;">
      <div
        class="card mb-3 rounded-3 shadow-sm"
        style="text-align: center"
        :class="{ selected: abo == 'Later' }"
        @click="chooseAbo('Later')"
      >
        <div class="card-body">
          Später auswählen
        </div>
      </div>
    </div>

    <p class="note"><sup>1</sup> 10% Lieferkosten pro Bestellung für Unternehmen. Beispiel: Kunde bestellt Cola für 20$ (2€). Schillerando Mitarbeiter geht zu Unternehmen und kauft Cola für 18$ (1.8€). Schillerando Mitarbeiter liefert Cola zum Kunden und bekommt 20$ (2€). Schillerando erhält 2$ (0.20€) Lieferkosten.</p>
    <p class="note"><sup>2</sup> $ entspricht der Staatswährung (1$ = 0.1€). Das Geld muss am ersten Tag von SAS bei Schillerando abgegeben werden bzw. wird von einem Schillerando Mitarbeiter eingesammelt.</p>

    <div
      class="alert alert-danger"
      id="alert-danger"
      role="alert"
    >
      Bitte wähle ein Abo aus!
    </div>
  </div>

</template>

<script>
import CompanyBadge from "./CompanyBadge.vue"

export default {
  name: 'AboOptions',
  props: ['abo', 'later'],
  components: {
    CompanyBadge,
  },
  emits: ['chooseAbo'],
  methods: {
    chooseAbo(abo) {
      this.$emit('chooseAbo', abo)
    },
  }
};
</script>

<style scoped>

h3 {
  font-weight: 500;
}

.note {
  padding: 0 50px 10px 50px;
  text-align: center;
  font-size: 0.8rem; 
  color: rgb(17, 17, 17);
}

p {
  margin-top: 0;
  margin-bottom: 1rem;
}
.mb-3 {
  margin-bottom: 1rem !important;
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

.advantage {
  font-weight: 700; 
  text-decoration: underline;
}

</style>

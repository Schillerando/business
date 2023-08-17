<template>
  <EditAccountingEntryOverlay v-if="newEntry" :products="products" @stopEditingEntry="stopEditingEntry($event)"
    @deleteEntry="deleteEntry()" />

  <div style="width: 100vw;">
    <TitleDiv title="Buchhaltung" />

    <div class="download">
      <p class="download-title">Herunterladen</p>
      
      <button class="btn btn-primary mb-4 download-button" @click="downloadCSV()">
        CSV (EXCEL)
      </button>

      <button class="btn btn-primary mb-4 download-button" @click="downloadCSV()">
        PDF
      </button>
    </div>

    <p style="margin-bottom: 20px;">
      $ <span style="font-size: 1.3rem">&#8793;</span> Schilli
    </p>

    <button class="btn btn-primary mb-4 add-product" @click="addEntry()">
      Eintrag hinzufügen
    </button>


    <div class="row">

      <div class="col-12 total-numbers">

        <div class="row table">

          <div class="col-lg-4 equal">
            <div class="card">
              <div class="card-body">
                <div :key="key" class="profit" :class="{ revenue: profit > 0, expenses: profit < 0 }">
                  <h3>Gewinn / Verlust</h3>
                  <h1>{{ profit }} $</h1>
                  <div class="euroProfit">{{ euroProfit }} €</div>

                  <a id="tooltip" tabindex="0" data-bs-toggle="tooltip" data-bs-placement="top"
                    title="mit Einberechnung von Umtauschsteuer">
                    <i class="fa-regular fa-circle-question fa-lg"></i>
                  </a>

                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-4 equal">
            <div class="card">
              <div class="card-body">
                <div :key="key" class="revenue">
                  <h3>Einnahmen</h3>
                  <h1>{{ revenue }} $</h1>
                  <div v-if="euroRevenue != 0 && schilliRevenue != 0" class="euroProfit">{{ euroRevenue }} € + {{ schilliRevenue }} $</div>
                  <div v-else-if="euroRevenue != 0" class="euroProfit">{{ euroRevenue }} €</div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-4 equal">
            <div class="card">
              <div class="card-body">
                <div :key="key" class="expenses">
                  <h3>Ausgaben</h3>
                  <h1>{{ expenses }} $</h1>
                  <div v-if="euroExpenses != 0 && schilliExpenses != 0" class="euroProfit">{{ euroExpenses }} € + {{ schilliExpenses }} $</div>
                  <div v-else-if="euroExpenses != 0" class="euroProfit">{{ euroExpenses }} €</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      <div :class="{ invisible: this.entries.length == 0 }" class="col-lg-6">

        <div class="canvas">
          <div id="total-charts"> 
            <canvas class="total-chart"></canvas>
          </div>

          <div id="type-charts">
            <canvas class="type-chart"></canvas>
          </div>
        </div>

      </div>

      <div class="col-lg-6">
        <div class="entries">
          <SortableList :items="entries" :products="products" :key="key" element="AccountingEntryTile"
            @deleteEntry="deleteEntry($event)" @stopEditingEntry="stopEditingEntry($event)" />

          <!--
          <div v-if="entries.length > 0">
            <div class="list">
              <div v-for="ssItem in entries" v-bind:key="ssItem.id">
                <AccountingEntryTile :data="ssItem" :products="products" @deleteEntry="deleteEntry($event)"></AccountingEntryTile>
              </div>
              <div v-for="index in 2" :key="index"></div>
            </div>
          </div>
          -->
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import TitleDiv from '../components/TitleDiv';
import EditAccountingEntryOverlay from '../components/EditAccountingEntryOverlay';
import SortableList from '@/components/SortableList.vue';
import { supabase } from '@/supabase';
import { computed } from 'vue';
import { useStore } from 'vuex';
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js/auto'
import { reformatDate, cutSecondsFromTime } from '@/helpers';

export default {
  name: 'AccountingView',
  components: {
    TitleDiv,
    EditAccountingEntryOverlay,
    SortableList,
  },
  setup() {
    const store = useStore();

    const companyData = computed(() => store.state.userCompany);

    return {
      store,
      companyData
    }
  },
  mounted() {
    window.jQuery = window.$ = require('jquery');

    window.Popper = require('@popperjs/core');

    require('bootstrap');

    window.$('body').tooltip({
      selector: '[data-bs-toggle="tooltip"]',
    });
  },
  data() {
    return {
      entries: [],
      products: [],
      euroExpenses: 0,
      schilliExpenses: 0,
      expenses: 0,
      euroRevenue: 0,
      schilliRevenue: 0,
      revenue: 0,
      profit: 0,
      euroProfit: 0,
      newEntry: false,
      listKey: 0,
      key: 0,
      totalChart: null,
      typeChart: null
    };
  },
  async created() {
    {
      const { data, error } = await supabase
        .from('products')
        .select()
        .eq('company_id', this.companyData.id);

      if (error) throw error;
      this.products = data.sort((a, b) => a.name.localeCompare(b.name));
    }

    const { data, error } = await supabase
      .from('accounting')
      .select("*, users(name)")
      .eq('company_id', this.companyData.id);

    if (error) throw error;

    this.entries = data

    this.calculateProfit()
    this.updateGraphs()

  },
  methods: {
    downloadCSV() {
      let exportString = 'Titel;Art;Währung;Betrag;Datum;Uhrzeit;Ersteller;Beschreibung'
      const entries = this.entries.sort((a, b) => a.created_at.localeCompare(b.created_at));
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i]
        exportString += `\n${entry.name};${entry.type.replace('+', '').replace('-', '')};${entry.currencyIsEuro ? 'Euro' : 'Schilli'};${entry.amount};${reformatDate(entry.created_at.split('T')[0])};${cutSecondsFromTime(entry.created_at.split('T')[1])};${entry.users.name};${entry.info}`
      }
      let link = document.createElement("a");
      link.textContent = "download";
      link.download = "buchhaltung.csv";
      link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(exportString);
      document.body.appendChild(link);
      link.style.display = "none";
      link.click();
      document.body.removeChild(link);
    },
    deleteEntry(entryData) {
      this.newEntry = false;

      var index = this.entries.findIndex(item => item.id == entryData.id)
      this.entries.splice(index, 1)

      this.store.dispatch('deleteEntry', entryData)

      this.calculateProfit()
      this.updateGraphs()

      this.key++;
    },
    stopEditingEntry(entryData) {
      this.newEntry = false;

      if (entryData != null) {
        const index = this.entries.findIndex((entry) => {
          return entry.id == entryData.id
        })

        console.log(this.entries)
        console.log(index)

        if (index == -1) {
          this.entries.push(entryData);
        } else {
          this.entries[index].type = entryData.type
          this.entries[index].product = entryData.product
          this.entries[index].name = entryData.name
          this.entries[index].amount = entryData.amount
          this.entries[index].info = entryData.info
          this.entries[index].bill_picture = entryData.bill_picture
          this.entries[index].currencyIsEuro = entryData.currencyIsEuro
        }
      }

      this.calculateProfit()
      this.updateGraphs()

      this.key++;
    },
    addEntry() {
      this.newEntry = true;
    },
    calculateProfit() {
      this.euroRevenue = 0
      this.schilliRevenue = 0
      this.revenue = 0
      this.euroExpenses = 0
      this.schilliExpenses = 0
      this.expenses = 0

      this.entries.forEach(entry => {
        if (entry.amount > 0) {

          if(entry.currencyIsEuro) this.euroRevenue += entry.amount
          else this.schilliRevenue += entry.amount

        } else {

          if(entry.currencyIsEuro) this.euroExpenses += Math.abs(entry.amount)
          else this.schilliExpenses += Math.abs(entry.amount)

        }
      })

      this.revenue = this.schilliRevenue + this.euroRevenue * 12.5
      this.expenses = this.schilliExpenses + this.euroExpenses * 12.5

      /*
      this.profit = this.schilliRevenue - this.schilliExpenses
      if(this.euroProfit - this.euroRevenue > 0) {
        this.profit += this.euro
      }
      */

      this.profit = (this.schilliRevenue - this.schilliExpenses) + (this.euroRevenue - this.euroExpenses) * 12.5;

      this.euroProfit = this.profit * 0.08

      this.euroRevenue = this.euroRevenue.toFixed(2);
      this.schilliRevenue = this.schilliRevenue.toFixed(0);

      this.euroExpenses = this.euroExpenses.toFixed(2);
      this.schilliExpenses = this.schilliExpenses.toFixed(0);

      this.revenue = this.revenue.toFixed(0);
      this.expenses = this.expenses.toFixed(0);

      this.profit = this.profit.toFixed(0);
      this.euroProfit = this.euroProfit.toFixed(2);

    },
    updateGraphs() {
      this.updateTotalGraph()
      this.updateTypeGraph()
    },
    updateTotalGraph() {
      const revenueChart = {
        type: 'bar',
        label: 'Einnahmen',
        data: [],
        backgroundColor: "rgba(0, 128, 0, 0.2)",
        borderColor: "rgba(0, 128, 0, 1)",
        order: 2,
        borderSkipped: false,
        borderWidth: 1
      }

      const expensesChart = {
        type: 'bar',
        label: 'Ausgaben',
        data: [],
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        borderColor: "rgba(255, 0, 0, 1)",
        order: 3,
        borderSkipped: false,
        borderWidth: 1
      }

      const profitChart = {
        type: 'line',
        label: 'Gewinn / Verlust',
        data: [],
        backgroundColor: "rgba(13, 110, 253, 1)",
        borderColor: "rgba(13, 110, 253, 1)",
        order: 1,
      }

      var totalEntries = []
      this.entries.forEach((entry) => {
        totalEntries.push(entry)
      })
      totalEntries.sort((a, b) => a.created_at.localeCompare(b.created_at));

      const labels = []

      totalEntries.forEach(entry => {

        var index;

        if (labels.includes(entry.created_at.split('T')[0])) {
          index = labels.indexOf(entry.created_at.split('T')[0])

        } else {
          labels.push(entry.created_at.split('T')[0])

          index = labels.length - 1

          revenueChart.data.push(0)
          expensesChart.data.push(0)
          if (index == 0) profitChart.data.push(0)
          else profitChart.data[index] = profitChart.data[index - 1]
        }

        var amount = entry.currencyIsEuro ? parseInt((entry.amount * 12.5).toFixed(0)) : entry.amount;
        
        if (amount > 0) {
          revenueChart.data[index] += amount;
        } else {
          expensesChart.data[index] += amount;
        }

        profitChart.data[index] += amount;

      })

      if (this.totalChart != null) {
        this.totalChart.destroy()

        const charts = document.getElementsByClassName('total-chart')
        for(var i=0; i<charts.length; i++) {
          charts[i].remove();
        }

        const wrapper = document.getElementById('total-charts')
        const child = document.createElement('canvas')
        child.classList.add('total-chart')
        wrapper.appendChild(child)
        child.style.marginBottom = '50px'
      } 
      this.totalChart = null

      const charts = document.getElementsByClassName('total-chart')
      const ctx = charts[charts.length - 1];
      this.totalChart = new ChartJS(ctx, {
        data: {
          labels: labels,
          datasets: [
            revenueChart,
            expensesChart,
            profitChart
          ]
        },
        options: {
          scales: {
            x: {
              stacked: true
            },
            y: {
              beginAtZero: false,
            }
          },
          responsive: true,
        }
      });

    },
    updateTypeGraph() {

      var typeEntries = []
      this.entries.forEach((entry) => {
        typeEntries.push(entry)
      })
      typeEntries.sort((a, b) => a.type[a.type.length - 1].localeCompare(b.type[b.type.length - 1]));

      const typeChart = {
        type: 'bar',
        data: [],
        backgroundColor: [],
        borderColor: [],
        order: 1,
        borderSkipped: true,
        borderWidth: 1
      }

      const labels = []

      typeEntries.forEach(entry => {

        var index;

        if (labels.includes(entry.type.replace('+', '').replace('-', ''))) {
          index = labels.indexOf(entry.type.replace('+', '').replace('-', ''))

        } else {
          labels.push(entry.type.replace('+', '').replace('-', ''))

          index = labels.length - 1

          typeChart.data.push(0)

          if (entry.amount > 0) {
            typeChart.backgroundColor.push("rgba(0, 128, 0, 0.2)")
            typeChart.borderColor.push("rgba(0, 128, 0, 1)")
          } else {
            typeChart.backgroundColor.push("rgba(255, 0, 0, 0.2)")
            typeChart.borderColor.push("rgba(255, 0, 0, 1)")
          }
        }

        var amount = entry.currencyIsEuro ? parseInt((entry.amount * 12.5).toFixed(0)) : entry.amount;

        typeChart.data[index] += amount;

      })


      var sonstIndex = labels.indexOf('Sonstige Einnahme')
      if (sonstIndex != -1) labels[sonstIndex] = 'Sonst. Einn.'
      sonstIndex = labels.indexOf('Sonstige Ausgabe')
      if (sonstIndex != -1) labels[sonstIndex] = 'Sonst. Ausg.'

      if (this.typeChart != null) {
        this.typeChart.destroy()

        const charts = document.getElementsByClassName('type-chart')
        for(var i=0; i<charts.length; i++) {
          charts[i].remove();
        }

        const wrapper = document.getElementById('type-charts')
        const child = document.createElement('canvas')
        child.classList.add('type-chart')
        wrapper.appendChild(child)
        child.style.marginBottom = '50px'
      } 
      this.typeChart = null

      const charts = document.getElementsByClassName('type-chart')
      const ctx = charts[charts.length - 1];
      this.typeChart = new ChartJS(ctx, {
        data: {
          labels: labels,
          datasets: [
            typeChart
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: false,
            },
          },
          responsive: true,
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });


    }
  }
};
</script>

<style scoped>
h1 {
  font-weight: 600;
  font-size: 2.5rem;
  height: 2.7rem;
  overflow: hidden;
}

h3 {
  font-weight: 400;
  color: black;
  margin-bottom: 20px;
}

.list {
  margin: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10px, 1fr));
}

.add-product {
  font-size: 1.25rem;
}


.card {
  margin: 10px 0;
  width: 100%;
  padding: 10px 0;
}

.row {
  padding: 0;
  width: 90%;
  margin: 0 auto;
}

.equal {
  display: flex;
  display: -webkit-flex;
  flex-wrap: wrap;
}

.entries {
  padding: 30px 0;
  width: 100%;
}

.revenue {
  color: green;
}

.expenses {
  color: red;
}

.euroProfit {
  font-size: 1.4rem;
  display: inline;
  margin-right: 10px;
}

.fa-circle-question {
  color: #0d6efd;
}

#tooltip {
  position: relative;
  bottom: 2px;
}

.total-numbers {
  margin-bottom: 50px;
}

.total-chart {
  width: 100%;
  margin-bottom: 50px;
}

.type-chart {
  width: 100%;
  margin-bottom: 50px;
}

.download {
  position: relative;
  margin: 0 auto;
  margin-top: -20px;
}

.download-title {
  margin: 0 5px 0 0;
  display: inline;
  font-size: 1.2rem;
  position: relative;
  bottom: 8px;
}

.download-button {
  margin: 5px 5px;
}

.hide {
  display: none;
}

.invisible {
  height: 0;
}

</style>

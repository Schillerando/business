<template>
  <div class="row" :class="{ noSearch: noSearch, 'no-margin': element == 'AccountingEntryTile' }">
    <div :class="{'col-md-3 col-xl-4': element == 'ProductTile', 'col-md-2': element == 'AccountingEntryTile' }"></div>
    <div v-if="noSearch" class="search-comp col-12 col-md-6 col-xl-4"></div>
    <div v-else :class="{'col-12 col-md-6 col-xl-4': element == 'ProductTile', 'col-md-8': element == 'AccountingEntryTile'  }">
      <input
        class="search form-control form-control-lg me-2"
        type="search"
        placeholder="Suchen..."
        aria-label="Suchen..."
        on-
        @focus="focus = true"
        @focusout="removeFocus()"
        v-model="searchString"
      />
      <div
        v-if="this.directLinks.length > 0 && this.focus"
        class="alias-wrapper"
      >
        <div class="alias-suggestions">
          <div
            v-for="link in directLinks"
            :key="link.id"
            style="display: block"
          >
            <router-link :to="link.alias">
              <button class="btn btn-light alias-link">
                {{ link.alias }}
                <i class="fa-solid fa-arrow-right"></i>
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div :class="{'col-md-3 col-xl-4': element == 'ProductTile', 'col-md-2': element == 'AccountingEntryTile' }"></div>
    <div :class="{'col-md-3 col-xl-4': element == 'ProductTile', 'col-md-2': element == 'AccountingEntryTile' }"></div>

    <div :class="{'col-12 col-md-6 col-xl-4': element == 'ProductTile', 'col-md-8': element == 'AccountingEntryTile' }">
      <div class="settings">
        <button
          class="direction btn btn-outline-secondary"
          @click="[dir == 'up' ? (dir = 'down') : (dir = 'up')]"
        >
          <i v-if="dir == 'up'" class="fa-solid fa-arrow-down fa-lg"></i>
          <i v-else class="fa-solid fa-arrow-up fa-lg"></i>
        </button>
        <select
          v-if="element == 'AccountingEntryTile'"
          @change="entryCategoryChange"
          id="entryCategory"
          class="form-select form-select-md mb-3"
          aria-label=".form-select-lg example"
        >
        <option value="" selected>Typ</option>
        <option value="Einnahmen">
          Alle Einnahmen
        </option>
        <option value="Ausgaben">
          Alle Ausgaben
        </option>
        <option value="Verkauf+">
          Verkauf
        </option>
        <option value="Einkauf-">Einkauf</option>
        <option value="Gehalt-">Gehalt</option>
        <option value="Miete-">Miete</option>
        <option value="Steuern-">Steuern</option>
        <option value="Sonstige Einnahme+">
          Sonstige Einnahmen
        </option>
        <option value="Sonstige Ausgabe-">Sonstige Ausgaben</option>
        </select>
        <select
          v-else
          @change="productCategoryChange"
          id="productCategory"
          class="form-select form-select-md mb-3"
          aria-label=".form-select-lg example"
        >
          <option value="" selected>Kategorie</option>
          <option value="Essen">Essen</option>
          <option value="Trinken">Trinken</option>
          <option value="Dienstleistung">Dienstleistung</option>
          <option value="Gegenstand">Gegenstand</option>
          <option value="Aktivität">Aktivität</option>
          <option value="Event">Event</option>
          <option value="Sonstiges">Sonstiges</option>
        </select>
        <select
          v-if="element == 'AccountingEntryTile'"
          @change="entrySortChange"
          id="entrySort"
          class="form-select form-select-right form-select-md mb-3"
          aria-label=".form-select-lg example"
        >
          <option value="created_at" selected>Sortieren</option>
          <option value="amount">Betrag</option>
          <option value="created_at">Datum</option>
          <option value="category">Typ</option>
          <option value="name">Name</option>
        </select>
        <select
          v-else
          @change="productSortChange"
          id="productSort"
          class="form-select form-select-right form-select-md mb-3"
          aria-label=".form-select-lg example"
        >
          <option value="relevance" selected>Sortieren</option>
          <option value="price">Preis</option>
          <option value="review">Bewertung</option>
          <option value="category">Kategorie</option>
          <option value="name">Name</option>
        </select>
      </div>
    </div>
  </div>
  <div :class="{'product-list': element == 'ProductTile', 'entry-list': element == 'AccountingEntryTile'}" ref="sortableList">
    <div v-for="ssItem in sortedShownItems" v-bind:key="ssItem.id">
      <component
        v-if="element == 'ProductTile'"
        :is="element"
        :data="ssItem"
        @deleteProduct="deleteProduct($event)"
      ></component>
      <component
        v-else
        :is="element"
        :data="ssItem"
        :products="products"
        :key="ssItem.id"
        @deleteEntry="deleteEntry($event)"
        @stopEditingEntry="stopEditingEntry($event)"
      ></component>
    </div>
    <div v-for="index in 2" :key="index" class="item"></div>
  </div>

  <div v-if="shownItems.length == 0 && !loading" style="margin-bottom: 50px">
    <h4 class="empty" v-if="element == 'AccountingEntryTile'">
      Es wurden keine Einträge gefunden
    </h4>
    <h4 class="empty" v-else>Es wurden keine Produkte gefunden</h4>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import ProductTile from './ProductTile.vue';
import AccountingEntryTile from './AccountingEntryTile.vue';
import router from '@/router';
/* eslint-enable no-unused-vars */

export default {
  name: 'SortableList',
  emits: ['deleteProduct', 'deleteEntry', 'stopEditingEntry'],
  data() {
    return {
      categories: [],
      chosenCategories: [],
      searchString: '',
      shownItems: [],
      sortedShownItems: [],
      sortBy: this.element == 'AccountingEntryTile' ? 'created_at' : '', //empty string if no sort is needed
      dir: 'up', //or 'down'
      directLinks: [],
      focus: false,
    };
  },
  props: [
    'items',
    'element',
    'loading',
    'noSearch',
    'sortByCategories',
    'showCategory',
    'products'
  ],
  methods: {
    sort: function () {
      this.sortedShownItems = this.shownItems;
      if (this.sortBy == '') {
        this.shuffleArray(this.sortedShownItems);
        return;
      } else if (this.sortBy == 'category') {

        var categoryOrder = []
        if(this.element == 'ProductTile') {
          categoryOrder = [
            'Essen',
            'Trinken',
            'Gegenstand',
            'Dienstleistung',
            'Aktivität',
            'Event',
            'Sonstiges',
          ];

          for (var i = 0; i < this.sortedShownItems.length; i++) {
            this.sortedShownItems[i].category = categoryOrder.indexOf(
              this.sortedShownItems[i].categories[0]
            );
          }
        } else {
          categoryOrder = [
            'Verkauf+',
            'Einkauf-',
            'Gehalt-',
            'Miete-',
            'Steuern-',
            'Sonstige Einnahmen+',
            'Sonstige Ausgaben-',
          ];

          for (var j = 0; j < this.sortedShownItems.length; j++) {
            this.sortedShownItems[j].category = categoryOrder.indexOf(
              this.sortedShownItems[j].type
            );
          }
        }
      
      } else if(this.sortBy == 'amount') {

        this.sortedShownItems.sort((a, b) => {
        if(a.currencyIsEuro) a.amount = a.amount * 10
        if(b.currencyIsEuro) b.amount = b.amount * 10 

        if (
          typeof a[this.sortBy] == 'string' &&
          typeof b[this.sortBy] == 'string'
        )
          return a[this.sortBy].localeCompare(b[this.sortBy]);
        if (Math.abs(a[this.sortBy]) > Math.abs(b[this.sortBy])) return 1;
        if (Math.abs(a[this.sortBy]) < Math.abs(b[this.sortBy])) return -1;
        else return 0;
        });
        if (this.dir == 'down') this.sortedShownItems.reverse();
        return;
      }

      this.sortedShownItems.sort((a, b) => {
        if (
          typeof a[this.sortBy] == 'string' &&
          typeof b[this.sortBy] == 'string'
        )
          return a[this.sortBy].localeCompare(b[this.sortBy]);
        if (a[this.sortBy] > b[this.sortBy]) return 1;
        if (a[this.sortBy] < b[this.sortBy]) return -1;
        else return 0;
      });
      if (this.dir == 'up' && this.sortBy == 'created_at') this.sortedShownItems.reverse();
      else if (this.dir == 'down' && this.sortBy != 'created_at') this.sortedShownItems.reverse();
      return;
    },
    searchForString: function (string, object) {
      if (string.startsWith('/')) string = string.substring(1);
      if (object == null) return 0;
      let instances = 0;
      if (typeof object == 'object') {
        if (!(object instanceof Array)) {
          let values = [];
          let searchKeys = [];
          if (this.element == 'AccountingEntryTile')
            searchKeys = ['name', 'type', 'info'];
          else searchKeys = ['name', 'company_name', 'info'];
          searchKeys.forEach((key) => values.push(object[key]));
          object = values;
        }
        for (let i = 0; i < object.length; i++) {
          instances += this.searchForString(string, object[i]);
        }

        return instances;
      }
      if (typeof object != 'string') return 0;
      let match = object.match(new RegExp(string, 'gi'));
      if (match == null) return 0;
      return match.length;
    },
    generateShownItems: function () {
      let newShownItems = [];
      for (let i = 0; i < this.items.length; i++) {
        let item = this.items[i];
        let matches = true;
        if (this.searchForString(this.searchString, item) == 0) matches = false;
        
        else if(this.element == "AccountingEntryTile") {
          
          if(this.chosenCategories.includes(item.type)) {
            matches = true;
          } 
          else if(this.chosenCategories.includes('Einnahmen') && item.type.includes('+')) matches = true;
          else if(this.chosenCategories.includes('Ausgaben') && item.type.includes('-')) matches = true;
          else if(this.chosenCategories.length == 0) matches = true;
          else matches = false;
        }
        else if (item.categories == null && this.chosenCategories.length != 0) {
          matches = false;
        } else {
          for (let j = 0; j < this.chosenCategories.length; j++) {
            if (!item.categories.includes(this.chosenCategories[j]))
              matches = false;
            if (
              item.categories[0] == 'Gastronomie & Dienstleistung' &&
              (this.chosenCategories[j] == 'Gastronomie' ||
                this.chosenCategories[j] == 'Dienstleistung')
            )
              matches = true;
          }
        }
        if (matches) newShownItems.push(item);
      }
      if (newShownItems != this.shownItems) {
        this.shownItems = newShownItems;
        this.sort();
      }
    },
    generateCategories: function () {
      for (let i = 0; i < this.items.length; i++) {
        let item = this.items[i];
        if (item.categories == null) continue;
        for (let j = 0; j < item.categories.length; j++) {
          let category = item.categories[j];
          if (!this.categories.includes(category))
            this.categories.push(category);
        }
      }
    },
    entryCategoryChange() {
      const select = document.getElementById('entryCategory');
      const value = select.value;
      if (value == '') this.chosenCategories = [];
      else this.chosenCategories = [value];
    },
    productCategoryChange() {
      const select = document.getElementById('productCategory');
      const value = select.value;
      if (value == '') this.chosenCategories = [];
      else this.chosenCategories = [value];
    },
    entrySortChange() {
      const select = document.getElementById('entrySort');
      const value = select.value;
      this.sortBy = value;
      console.log(value);
    },
    productSortChange() {
      const select = document.getElementById('productSort');
      const value = select.value;
      this.sortBy = value;
    },
    aliasRoute(alias) {
      router.addRoute({ path: '/' + alias });
      router.forward();
      console.log('/' + alias);
    },
    removeFocus() {
      setTimeout(
        function () {
          this.focus = false;
        }.bind(this),
        200
      );
    },
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    },
    deleteProduct(productData) {      
      this.$emit('deleteProduct', productData)
    },
    deleteEntry(entryData) {      
      this.$emit('deleteEntry', entryData)
    },
    stopEditingEntry(entryData) {
      this.$emit('stopEditingEntry', entryData)
    }
  },
  mounted() {
    if (this.sortByCategories) this.sortBy = 'category';

    this.generateCategories();
    this.generateShownItems();
  },
  watch: {
    items: function () {
      this.generateCategories();
      this.generateShownItems();
    },
    element: function () {
      this.generateShownItems();
    },
    searchString: function () {
      this.generateShownItems();
      this.directLinks = [];
      if (this.element == 'CompanyTile') {
        if (this.searchString.startsWith('/')) {
          for (let i = 0; i < this.items.length; i++) {
            if (
              this.items[i].alias !== undefined &&
              this.items[i].alias.startsWith(this.searchString.substring(1))
            )
              this.directLinks.push(this.items[i]);
          }
        }
      }
    },
    dir: function () {
      this.generateShownItems();
    },
    sortBy: function () {
      this.generateShownItems();
    },
    chosenCategories: function () {
      this.generateShownItems();
    },
  },
  components: { ProductTile, AccountingEntryTile },
};
</script>

<style scoped>
.product-list {
  margin: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
}

.entry-list {
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, 1fr);
}

.row {
  padding-top: 0;
  margin-top: 0;
  margin: 0 20px;
}

.no-margin {
  margin: 0 -10px;
}

.direction {
  border-color: #cfd4da;
  position: absolute;
  right: 0;
  width: 15%;
}

.form-select {
  position: absolute;
  width: 40%;
}

.form-select-right {
  left: 40%;
  margin: 0 2.5%;
}

.settings {
  position: relative;
  margin-bottom: 30px;
  margin-top: 5px;
}

.alias-suggestions {
  background-color: white;
  width: 100%;
  position: absolute;
  z-index: 10;
  border-radius: 0 0 0.375rem 0.375rem;
  border-color: #87b7ff;
  border-width: 0 1px 1px 1px;
  border-style: solid;
  text-align: left;
  padding-top: 10px;
}

.alias-wrapper {
  position: relative;
  bottom: 12px;
}

.alias-link {
  margin: 0 10px 10px 10px;
  font-size: 1.2rem;
  font-weight: 200;
}

.fa-arrow-right {
  margin-left: 5px;
}

.empty {
  margin: 0 10px;
}

.noSearch {
  margin-bottom: 0;
  padding-bottom: 20px;
}
</style>

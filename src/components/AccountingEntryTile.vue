<template>
  <EditAccountingEntryOverlay v-if="edit" :data="entry" :products="products" @stopEditingEntry="stopEditingEntry($event)" @deleteEntry="deleteEntry($event)"/>

  <div class="card" @click="edit = true">
    
    <div class="type">
      <span class="input-group-text"
        >
        <i v-if="entry.type == 'Einkauf-'" class="fa-solid fa-cart-shopping fa-lg"></i>
        <i v-else-if="entry.type == 'Miete-'" class="fa-solid fa-house fa-lg"></i>
        <i v-else-if="entry.type == 'Gehalt-'" class="fa-solid fa-user fa-lg"></i>
        <i v-else-if="entry.type == 'Steuern-'" class="fa-solid fa-gavel fa-lg"></i>
        <i v-else-if="entry.type == 'Verkauf+'" class="fa-solid fa-box-open fa-lg"></i>
        <i v-else class="fa-solid fa-dollar-sign fa-lg"></i>
      
        <i v-if="entry.bill_picture != null" class="fa-solid fa-file"></i>
      </span>

    </div>

    <p class="name">{{ entry.name }}</p>
      
    <p class="price" :class="{ income: entry.amount > 0, expense: entry.amount < 0  }">{{ entry.amount > 0 ? "+" : '' }}{{ entry.amount }} {{ entry.currencyIsEuro ? '€' : '$' }}</p>

    <!--
    <button @click="edit = true" class="btn btn-primary">
      <i class="fa-solid fa-pen-to-square fa-lg"></i>

    </button>
    -->

  </div>
</template>

<script>
import EditAccountingEntryOverlay from "./EditAccountingEntryOverlay.vue"
import { reactive } from 'vue';
import { supabase } from '@/supabase';
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'AccountingEntryTile',
  props: ['data', 'products'],
  components: { EditAccountingEntryOverlay },
  emits: ['deleteEntry', 'stopEditingEntry'],
  data() {
    return {
      edit: false,
      picture: null
    };
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
      extras: [],
      variation: ''
    });

    const store = useStore();

    const companyData = computed(() => store.state.userCompany);

    return {
      entry,
      store,
      companyData
    };
  },
  async mounted() {
    if(this.data != null) {
      this.entry.id = this.data.id;
      this.entry.name = this.data.name;
      this.entry.type = this.data.type;
      this.entry.info = this.data.info;
      this.entry.amount = this.data.amount;
      this.entry.bill_picture = this.data.bill_picture;
      this.entry.currencyIsEuro = this.data.currencyIsEuro;
      this.entry.variation = this.data.variation;
      this.entry.extras = this.data.extras;
      this.entry.product = this.data.product;

      if(this.data.users != undefined) {
        this.entry.userName = this.data.users.name
      } else {
        this.entry.userName = this.data.userName
      }

      this.entry.created_at = this.data.created_at;


      if (this.data.bill_picture != null) {
        const response = await supabase.storage
          .from('bill-pictures/' + this.store.getters.getUserCompany.id)
          .download(this.data.bill_picture);
        if (response.data != null) {
          this.entry.image = await response.data.text();
          this.entry.imageBefore = this.entry.image
          this.picture = this.entry.image
        } 
        if (response.error) console.warn(response.error);
      } else if (this.data.image != null ) {
        this.entry.image = this.data.image;
        this.entry.imageBefore = this.entry.image
        this.picture = this.data.image
      }
    }
  },
  methods: {
    stopEditingEntry(entryData) {
      this.edit = false;

      if(entryData == null) return;

      this.entry = entryData;
      this.picture = entryData.image;

      this.$emit('stopEditingEntry', entryData)
    },
    deleteEntry(entryData) {
      this.edit = false;
      
      this.$emit('deleteEntry', entryData)
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

.btn {
  position: absolute;
  right: 10px;
  top: 8px;
  padding: 2px 5px 3px 5px;
}

.name {
  font-weight: 400;
  font-size: 1.2rem;
  text-align: left;
  margin: 10px 0 0 10px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1; /* number of lines to show */
  line-clamp: 1;
  -webkit-box-orient: vertical;
  max-height: 30px;
  max-width: calc(100vw*0.9 - 240px);
}

.price {
  position: absolute;
  text-align: right;
  bottom: 8px;
  right: 15px;
  color: black;
  font-weight: 400;
}

.row,
.col {
  margin: 0;
  padding: 0;
}

.card {
  flex-direction: row;
  overflow: hidden;
  margin: 5px 2.5%;
  height: 50px;
}

.card:hover {
  color: #0d6efd;
}

.fa-image {
  position: absolute;
  font-size: 4rem;
  top: 50%;
  left: calc(50% - 2rem);
  color: black;
}

.income {
  color: green;
}

.expense {
  color: red;
}

.type {
  width: 50px;
  position: relative;
}

.input-group-text {
  height: 100%;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-width: 0 1px 0 0;
}

.fa-solid {
  position: relative;
}

.fa-user {
  left: 3px;
}

.fa-house {
  left: 1px;
}

.fa-gavel {
  left: 2px;
}

.fa-dollar-sign {
  left: 6px;
}

.fa-file {
  position: absolute;
  color: #0d6efd;
  left: 10px;
  top: 5px;
}

/*   border-radius: 0.375rem 0 0 0.375rem; */
</style>

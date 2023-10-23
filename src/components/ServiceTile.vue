<template>
  <div class="card">
    <div class="title">
      <h4>{{ title }} <span class="emoji">{{ icon }}</span>
      </h4>
    </div>

    <div>
      <p>{{ description }}</p>
    </div>

    <div class="spacer"></div>

    <div class="footer">
      <div>
        <span v-if="price == 0">Kostenlos</span>
        <span :class="{ 'isBusiness': isBusiness  }" v-else>{{ price }} $</span>
        <span class="free" v-if="isBusiness && price != 0">0 $</span>
      </div>
    </div>

    <div v-if="button != false" class="button">
      <button :disabled="disabled" @click="bookService()" class="btn btn-primary">
        Buchen
      </button>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';

export default {
  name: 'ProductTile',
  props: ['title', 'description', 'icon', 'price', 'disabled', 'button'],
  setup() {
    const store = useStore()

    const isBusiness = store.getters.getUserCompany.abo == 'Business'

    return {
      store,
      isBusiness
    }
  },
  methods: {
    bookService() {
      const data = {
        title: this.title,
        description: this.description,
        icon: this.icon,
        price: this.price
      }

      this.$router.push({ name: 'BookServiceView', state: { data }})
    }
  }
};
</script>

<style scoped>
div {
  text-align: left;
}

.card {
  padding: 10px;
  margin: 5px 10px 10px 10px;
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

.spacer {
  height: 30px;
}

.footer {
  position: absolute;
  bottom: 10px;
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

.button {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.btn {
  padding: 3px 8px 3px 8px;
}
</style>

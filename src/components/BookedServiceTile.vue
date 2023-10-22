<template>
  <div v-if="!loading" class="card">
    <div class="title">
      <h4>{{ data.type }} 
        <span v-if="data.type == 'Support'" class="emoji">&#x1F91D;</span>
        <span v-else-if="data.type == 'Müllentsorgung'" class="emoji">&#x1F5D1;&#xFE0F;</span>
        <span v-else-if="data.type == 'Wareneinkauf'" class="emoji">&#128666;</span>
      </h4>
    </div>

    <div>
      <div class="order_info">
        <i class="fa-solid fa-calendar"></i>
        <span>{{ this.day }}</span>

        <div class="order_time">
          <i class="fa-solid fa-clock"></i>
          <span>{{ this.booked_time }}</span>
        </div>
      </div>

      <div class="delivery_info">
        <div>
          <span v-if="this.data.driver == null" class="badge text-bg-warning"
            >In Bearbeitung</span
          >
          <span
            v-else-if="this.data.contact_time == null"
            class="badge text-bg-success"
            >Auf dem Weg</span
          >
          <span
            v-else-if="this.data.finished_time == null"
            class="badge text-bg-success"
            >Wird ausgeführt</span
          >
          <span v-else class="badge text-bg-secondary">Abgeschlossen</span>
        </div>

      </div>
    </div>

    <div class="order_details">
      <span class="order_price">{{ this.data.price }} $</span>
    </div>

    <button
      v-if="this.data.delivery_time == null"
      @click.prevent="$router.push(qrLink)"
      class="btn btn-primary btn-sm"
    >
      <i class="fa-solid fa-qrcode fa-xl"></i>
    </button>
  </div>
</template>

<script>
import { cutSecondsFromTime, reformatDate } from '@/helpers';

export default {
  name: 'BookedServiceTile',
  props: ['data'],
  data() {
    return {
      day: '',
      booked_time: '',
      loading: true,
    };
  },
  mounted() {
    this.day = reformatDate(this.data.date);
    this.booked_time = cutSecondsFromTime(this.data.booked_time);

    this.loading = false;
  },
  computed: {
    qrLink() {
      if (this.data == undefined) return '';
      return `/service/${this.data.id}/qr`;
    },
  }
};
</script>

<style scoped>
.card {
  overflow: hidden;
  text-align: left;
  padding: 10px;
  margin: 5px 10px 10px 10px;
}

.fa-solid {
  margin-right: 10px;
  margin-bottom: 10px;
}

.delivery_info {
  float: right;
}

.delivery_time {
  margin-top: 6px;
}

.order_info {
  float: left;
}

.product_count {
  display: inline;
  margin-right: 20px;
}

.order_details {
  margin-top: 20px;
  margin-bottom: -5px;
}

.deliver_to {
  margin-top: 20px;
}

.badge {
  position: relative;
  bottom: 3px;
}

.btn-primary {
  background-color: #00a100;
  border-color: #00a100;
  position: absolute;
  bottom: 5px;
  right: 10px;
  padding: 7px 7px 5px 7px;
}

.btn-primary:hover {
  background-color: #007400;
  border-color: #007400;
}

.fa-qrcode {
  margin: 0;
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

/*   border-radius: 0.375rem 0 0 0.375rem; */
</style>

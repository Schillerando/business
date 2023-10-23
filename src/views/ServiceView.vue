<template>
  <TitleDiv title="Services" />

  <div v-if="activeService != null" class="list booked">
    <BookedServiceTile :data="activeService"/>
  </div>

  <div class="list">
    <ServiceTile :disabled="activeService != null" title="Support" description="Du hast Probleme mit der Verwaltung deines Unternehmens, dem Einstellen deiner Angebote oder der Buchhaltungssoftware? Rufe einen Schillerando-Mitarbeiter um dir beim Umgang mit Schillerando oder Schillerando Business zu helfen." icon="&#x1F91D;" price="0" />
    <ServiceTile :disabled="activeService != null" title="Müllentsorgung" description="Ein Schillerando-Mitarbeiter entsorgt den Müll deines Unternehmens. Für nicht getrennten Müll fallen 5$ extra Gebühren an. Dies gilt auch für Unternehmen mit Premium Abo!" icon="&#x1F5D1;&#xFE0F;" price="5" />
    <ServiceTile :disabled="activeService != null" title="Wareneinkauf" description="Dir gehen im Verlauf eines Tages die Waren aus und du hast keine Möglichkeit für den nächsten Tag neue zu besorgen? Wir kaufen neue Ware für dein Unternehmen im Ausland ein! Wenn du diesen Service in Anspruch nehmen willst, komme bei unserem Stand auf dem unteren Pausehof vorbei und wir klären alle Details. " icon="&#128666;" price="50" :button="false"/>
  </div>
  
</template>

<script>
import TitleDiv from '@/shared/components/TitleDiv';
import ServiceTile from '../components/ServiceTile';
import { useStore } from 'vuex'
import { computed } from 'vue'
import BookedServiceTile from '@/components/BookedServiceTile.vue';

export default {
  name: 'ServiceView',
  components: {
    TitleDiv,
    ServiceTile,
    BookedServiceTile
},
  setup() {
    const store = useStore();

    const activeService = computed(() => store.state.activeService);

    return {
      store,
      activeService
    }
  },
  data() {
    return {
      icon: ''
    }
  },
};
</script>

<style scoped>
.list {
  margin: 0 10px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
}

.booked {
  margin-bottom: 50px;
}
</style>

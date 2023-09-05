<template>
  <div v-if="companyData != null && companyData != undefined">
    <div v-if="companyData.abo == '' || companyData.abo == null" class="overlay">
      <div class="centered">
        <img class="lock" src="@/assets/lock.png" alt="">
        <button v-if="userData.id == companyData.user_uid" class="btn btn-primary" @click="router.push('updateAbo')" >Abo auswählen</button>
        <h4 v-else class="mt-3">Der Geschäftsführer deines Unternehmens muss ein Abo auswählen um Zugriff zu erhalten!</h4>
      </div>
    </div>
  </div>

</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

export default {
  name: 'LockedOverlay',
  setup() {
    const store = useStore();
    const router = useRouter();

    const companyData = computed(() => store.state.userCompany);
    const userData = computed(() => store.state.user);

    return {
      store,
      router,
      companyData,
      userData
    };
  },
};
</script>

<style scoped>
.overlay {
  overflow: hidden;
  position: fixed; 
  top: 0;
  left: 0;
  width: 100%;
	height: 100%;
	box-shadow: 0 0 1rem 0 rgba(0, 0, 0, .2);	
	border-radius: 5px;
	background-color: rgba(255, 255, 255, .15);
	
	backdrop-filter: blur(5px);
}


.centered {
  position: relative;
  margin: auto;
  top: 35%;
}

.btn {
  top: 20px;
  position: relative;
  font-size: 1.5rem;
  margin: auto;
  display: block;
}

/*
.overlay {
  position: absolute;
  top: 0;
  background-color: white;
  opacity: 50%;
  width: 100%;
	height: 100vh;
}
*/
</style>

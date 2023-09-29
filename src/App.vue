<template>
  <div translate="no">
    <NavBar />
    <router-view></router-view>
    <SocialsFooter v-if="$route.meta.footer == null" />
    <LockedOverlay v-if="$route.meta.locked != null" />
    <NoAccessOverlay v-if="$route.meta.noAccess != null" />
  </div>
</template>

<script>
import NavBar from './components/NavBar';
import SocialsFooter from '@/shared/components/SocialsFooter';
import LockedOverlay from './components/LockedOverlay';
import NoAccessOverlay from './components/NoAccessOverlay';
import { useStore } from 'vuex';

export default {
  name: 'App',
  components: {
    NavBar,
    SocialsFooter,
    LockedOverlay,
    NoAccessOverlay
  },
  setup() {
    const store = useStore();
    store.dispatch('reload');

    return {
      store
    }
  },
};
</script>

<style>
html,
body {
  max-width: 100%;
}

body {
  font-family: 'Merriweather Sans', Arial, sans-serif;
  text-align: center;
  font-weight: 500;
}

h1 {
  font-weight: 900;
}

h2 {
  font-weight: 900;
}

h3 {
  font-weight: 700;
}

a {
  color: #000;
  text-decoration: none;
}

li {
  padding: 10px 0;
}

hr {
  padding: 0;
  margin: 0;
  color: #b1afaf;
}

.row {
  padding: 50px 0;
}

/* Primary Styles */

.btn-primary {
  background-color: #00a100;
  border-color: #00a100;
}

.bg-primary {
  background-color: #00a100;
  color: #00a100;
}

.btn-primary {
  background-color: #00a100;
  border-color: #00a100;
}

.btn-primary:hover {
  background-color: #007400;
  border-color: #007400;
}

.btn-link {
  color: #00a100;
}

.btn-link:hover {
  color: #007400;
}

.bg {
  background-color: #00a100;
}

.bg-sec {
  background-color: white;
  color: #00a100;
}
</style>

import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView';
import ProductView from '../views/ProductView';
import ServiceView from '../views/ServiceView';
import SettingsView from '../views/SettingsView';
import CompanyRegistrationView from '../views/CompanyRegistrationView';
import CompanyRegistratedView from '../views/CompanyRegistratedView';
import AccountingView from '../views/AccountingView';
import AGBView from '../views/AGBView';
import UpdateAboView from '../views/UpdateAboView';
import store from '../store/index';
import { supabase } from '../supabase';

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: HomeView,
  },
  {
    path: '/angebote',
    name: 'ProductView',
    component: ProductView,
    meta: {
      locked: true,
      company: true
    },
  },
  {
    path: '/services',
    name: 'ServiceView',
    component: ServiceView,
    meta: {
      locked: true,
      company: true
    },
  },
  {
    path: '/buchhaltung',
    name: 'AccountingView',
    component: AccountingView,
    meta: {
      locked: true,
      company: true
    },
  },
  {
    path: '/einstellungen',
    name: 'SettingsView',
    component: SettingsView,
    meta: {
      locked: true,
      company: true,
      noAccess: true,
    },
  },
  {
    path: '/companyRegistration',
    name: 'CompanyRegistrationView',
    component: CompanyRegistrationView,
    meta: {
      footer: false,
      company: false,
      auth: true
    },
  },
  {
    path: '/companyRegistrated',
    name: 'CompanyRegistratedView',
    component: CompanyRegistratedView,
    meta: {
      footer: false,
      company: true,
      auth: true
    },
  },
  {
    path: '/agb',
    name: 'AGBView',
    component: AGBView,
  },
  {
    path: '/updateAbo',
    name: 'UpdateAboView',
    component: UpdateAboView,
    meta: {
      footer: false,
      company: true
    },
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    document.getElementById('app').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('navbarToggler').classList.remove('show');
  },
});

router.beforeEach(async (to, from, next) => {


  if (to.query.ext == 'true' && to.query.access_token != null && to.query.access_token != "null") {
    try {
      const { data } = await supabase.auth.setSession({
        access_token: to.query.access_token,
        refresh_token: to.query.refresh_token,
      })
      store.commit('setUser', data.user);
      store.dispatch('startUserCompanySubscription');
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch(e) {
      store.commit('setUser', null);
      store.commit('setUserCompany', null);
    }
    
  } else if(to.query.ext == 'true') {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // get current user info
  const user = store.getters.getUser;
  var userCompany = store.getters.getUserCompany;

  if (userCompany == null) {
    new Promise((resolve) => setTimeout(resolve, 500));
    userCompany = store.getters.getUserCompany;
  }

  if ((to.meta.auth || to.meta.company) && user == null) {
    window.location.replace(process.env.VUE_APP_MAIN_URL + '/auth?redirect=ext_' + to.path)
    next();
  }
  else if (to.meta.company && userCompany == null && user != null && user.email_confirmed_at == null) {
    window.location.replace(process.env.VUE_APP_MAIN_URL + '/account')
    next();
  }
  else if (to.meta.company && userCompany == null && user != null) next({ path: 'companyRegistration' });
  else if (to.meta.company == false && userCompany != null) next({ path: 'einstellungen' })
  else if (to.meta.auth == false && user != null) next({ path: from.path })
  else if (to.name == 'UpdateAboView' && userCompany != null && userCompany.abo != '' && userCompany.abo != null) next({ path: from.path })
  else if(to.name == 'CompanyRegistrationView' && userCompany != null) next({ path: 'einstellungen'})
  else next();

});

export default router;

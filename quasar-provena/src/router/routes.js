const routes = [
  { path: '/', component: () => import('pages/IndexPage.vue') },
  { path: '/notarize', component: () => import('pages/BchNotarizeFlow.vue') },
  { path: '/register-key', component: () => import('pages/RegisterKeyPage.vue') },
  { path: '/verify', component: () => import('pages/ProofViewer.vue') },
  { path: '/verify/:token', component: () => import('pages/ProofViewer.vue') },
  { path: '/about', component: () => import('pages/AboutPage.vue') },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes

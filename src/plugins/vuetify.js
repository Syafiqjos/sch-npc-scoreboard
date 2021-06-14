import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark : true,
        themes: {
            dark: {
                primary: '#121212',
                secondary: '#333333',
                accent: '#8c9eff',
                error: '#b71c1c',
            },
        },
  },
});

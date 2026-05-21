import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import pinia from './store'
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'

// Laravel Echo
import './echo'

// SweetAlert2 CSS
import 'sweetalert2/dist/sweetalert2.min.css'

// SweetAlert composable
import { useAlert } from '@/utils/sweetalert.js'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(VCalendar)

// Registrar alerta global
const alert = useAlert()
app.config.globalProperties.$alert = alert

app.mount('#app')

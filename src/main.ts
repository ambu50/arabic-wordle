import { createApp } from 'vue'
import Game from './Game.vue'
import './game.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faQuestionCircle,faCaretSquareDown } from '@fortawesome/free-regular-svg-icons'
import { faTwitter,faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { VuesticPlugin } from 'vuestic-ui'
import 'vuestic-ui/dist/vuestic-ui.css'
import VueSocialSharing from 'vue-social-sharing'



library.add(faQuestionCircle,faCaretSquareDown,faTwitter,faWhatsapp)
// resize for scaling the board size
window.addEventListener('resize', onResize)
// set size on startup
onResize()

function onResize() {
  // get actual vh on mobile
  document.body.style.setProperty('--vh', window.innerHeight + 'px')
}

const app1 = createApp(Game)

app1.use(VuesticPlugin)
app1.use(VueSocialSharing);
app1.component('font-awesome-icon', FontAwesomeIcon)
//app1.config.globalProperties.window = window;
app1.mount('#app')



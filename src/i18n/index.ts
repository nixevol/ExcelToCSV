import { createI18n } from 'vue-i18n'
import zh from './zh'
import zhTW from './zh-TW'
import en from './en'
import ja from './ja'
import ko from './ko'
import ru from './ru'
import fr from './fr'
import es from './es'
import de from './de'

const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'en',
  messages: { 
    zh, 
    'zh-TW': zhTW, 
    en, 
    ja, 
    ko, 
    ru, 
    fr, 
    es, 
    de 
  }
})

export default i18n

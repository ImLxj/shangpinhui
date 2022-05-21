import Home from '@/views/Home'
import Search from '@/views/Search'
import Login from '@/views/Login'
import Register from '@/views/Register'
import Detail from '@/views/Detail'

export default [
  { path: '/', redirect: '/home' },
  { path: '/home', component: Home, meta: { show: true } },
  {
    // 在params后面加一个问好表示可传可不传
    path: '/search/:keyword?',
    name: 'search',
    component: Search,
    meta: { show: true }
  },
  { path: '/detail/:id?', component: Detail, meta: { show: true } },
  { path: '/login', component: Login, meta: { show: false } },
  { path: '/register', component: Register, meta: { show: false } }
]

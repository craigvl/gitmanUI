import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/pages/Login'
import Repos from '@/components/pages/Repos'
import Issues from '@/components/pages/Issues'
import Contact from '@/components/pages/Contact'
import Dashboard from '@/components/pages/Dashboard'
import ExternalLogin from '@/components/pages/ExternalLogin'

import { auth, database } from '@/firebase'

Vue.use(Router)

const navGuard = (to, from, next) => {
  auth.onAuthStateChanged(user => {
    if (!user) {
      next({ path: '/login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  })
}

// const hashScroll = (to, from, next) => {
//   if (!to.hash && to.name) {
//     next('login')
//   } else {
//     next()
//   }
// }

export default new Router({
  // mode: 'history',
  // scrollBehavior (to, from, savedPosition) {
  //   if (to.hash && to.name === 'register') {
  //     return {
  //       selector: to.hash
  //     }
  //   }
  // },
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter (to, from, next) {
        // console.dir(from)
        // console.dir(to)

        auth.onAuthStateChanged(user => {
          if (!user) {
            next()
          }
          auth.getRedirectResult()
            .then(result => {
              if (result.credential) {
                const token = result.credential.accessToken
                // this.$gitService.getUserOwnedRepos(token).then(_ => {
                // })
                database.ref(`user/${result.user.uid}`).update({
                  name: result.user.displayName,
                  email: result.user.email,
                  photoUrl: result.user.photoURL,
                  gitAccessToken: token,
                  id: result.additionalUserInfo.profile.id,
                  gitUserName: result.additionalUserInfo.username
                })
              }
              next(to.query.redirect || 'issues')
            }).catch(error => {
              next(new Error(error.message ? error.message : error))
            })
        })
      }
    },
    {
      path: '/repos',
      name: 'repos',
      component: Repos,
      beforeEnter (to, from, next) {
        navGuard(to, from, next)
      }
    },
    {
      path: '/repos/:enableId',
      name: 'register',
      props: true,
      component: Repos,
      beforeEnter (to, from, next) {
        navGuard(to, from, next)
      }
    },
    {
      path: '/issues',
      name: 'issues',
      component: Issues,
      beforeEnter (to, from, next) {
        navGuard(to, from, next)
      }
    },
    // {
    //   path: '/issue/:id',
    //   name: 'issue',
    //   component: Issue,
    //   beforeEnter (to, from, next) {
    //     navGuard(to, from, next)
    //   }
    // },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      beforeEnter (to, from, next) {
        navGuard(to, from, next)
      }
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact,
      beforeEnter (to, from, next) {
        navGuard(to, from, next)
      }
    },
    {
      path: '/ext/login',
      name: 'ext-login',
      component: ExternalLogin,
      beforeEnter (to, from, next) {
        navGuard(to, from, next)
      }
    },
    {
      path: '*',
      redirect: '/issues'
    }
  ]
})

import { firebaseConfig } from './config'
import firebase from 'firebase'
import 'firebase/functions'

const firebaseApp = firebase.initializeApp(firebaseConfig)
if (firebaseConfig.emulator) {
  console.warn(`using emulator on ${firebaseConfig.emulator}`)
  firebaseApp.functions().useEmulator('localhost', 5000)
}
const database = firebase.database()
const auth = firebase.auth()
const functions = firebase.functions()
const githubProvider = new firebase.auth.GithubAuthProvider()

// githubProvider.addScope('admin:repo_hook')
githubProvider.addScope('read:org')
githubProvider.addScope('public_repo')
githubProvider.addScope('read:user')

export {
  firebaseApp,
  database,
  auth,
  functions,
  githubProvider
}

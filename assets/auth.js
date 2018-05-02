import settings from '../app-settings.js'

const API_KEY = settings.API_KEY
const OAUTH2_CLIENT_ID = settings.OAUTH2_CLIENT_ID
const SCOPE = 'https://www.googleapis.com/auth/youtube'

let api = document.createElement('script')
let GoogleAuth
let callbacks = {
  onSignIn: () => {},
  onSignOut: () => {}
}

api.src = 'https://apis.google.com/js/api.js'
api.addEventListener('load', () => {
  gapi.load('client:auth2', initClient)
})
document.body.appendChild(api)

function initClient () {
  gapi.client.init({
    'apiKey': API_KEY,
    'clientId': OAUTH2_CLIENT_ID,
    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
    scope: SCOPE
  }).then(function () {
    GoogleAuth = gapi.auth2.getAuthInstance()

    // Listen for sign-in state changes.
    GoogleAuth.isSignedIn.listen(updateSigninStatus)

    // Handle initial sign-in state. (Determine if user is already signed in.)
    // let user = GoogleAuth.currentUser.get()

    setSigninStatus()
  })
}

function handleAuthClick () {
  if (GoogleAuth.isSignedIn.get()) {
    // User is authorized and has clicked 'Sign out' button.
    GoogleAuth.signOut()
  } else {
    // User is not signed in. Start Google auth flow.
    GoogleAuth.signIn()
  }
}

function setSigninStatus () {
  let user = GoogleAuth.currentUser.get()
  let isAuthorized = user.hasGrantedScopes(SCOPE)
  if (isAuthorized) {
    callbacks.onSignIn()
  } else {
    callbacks.onSignOut()
  }
}

function updateSigninStatus (isSignedIn) {
  setSigninStatus()
}

export {handleAuthClick, callbacks}

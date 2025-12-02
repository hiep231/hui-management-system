export const ACCOUNT_SERVICE = {
  name: 'ACCOUNT_SERVICE',
  accounts: 'accounts',
  users: {
    name: 'users',
    controllerName: 'UserController',
    serviceName: 'UserService',
    collectionName: 'user'
  },
  googleTokens: {
    name: 'googleTokens',
    controllerName: 'GoogleTokenController',
    serviceName: 'GoogleTokenService',
    collectionName: 'google_token'
  },
  micorsoftTokens: {
    name: 'micorsoftTokens',
    controllerName: 'MicrosoftTokenController',
    serviceName: 'MicrosoftTokenService',
    collectionName: 'microsoft_token'
  }
}

export const BASE_SERVICE = {
  name: 'BASE_SERVICE',
  serviceName: 'BaseService'
}

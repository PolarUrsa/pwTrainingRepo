export type UserType = 'demo' | 'admin' | 'invalidUserAndPass' | 'invalidUsername' | 'invalidPassword'

interface UserCredentials {
  username: string
  password: string
}

export function getUserCredentials(userType: UserType): UserCredentials {
  const env = process.env

  const credentialMap: Record<UserType, { user: string, pass: string}> ={
    demo: {
        user: env.CI_DEMO_USER_USERNAME || env.DEMO_USER_USERNAME!,
        pass: env.CI_DEMO_USER_PASSWORD || env.DEMO_USER_PASSWORD!,
      },
    admin :{
        user: env.CI_ADMIN_USER_USERNAME || env.ADMIN_USER_USERNAME!,
        pass: env.CI_ADMIN_USER_PASSWORD || env.ADMIN_USER_PASSWORD!,
      },
    invalidUserAndPass:{
        user: 'wrong.username',
        pass: 'invalidPassword',
      },
    invalidUsername:{
        user: env.CI_DEMO_USER_USERNAME || env.DEMO_USER_USERNAME!,
        pass: 'invalidPassword',
      },
    invalidPassword:{
        user: 'wrong.user',
        pass: env.CI_DEMO_USER_PASSWORD || env.DEMO_USER_PASSWORD!,
      },
    }
  
  const creds = credentialMap[userType]

  if(!creds.user || !creds.pass){
    throw new Error (`Missing credentials for user type: ${userType}`)
  }

  return{
    username: creds.user,
    password: creds.pass,
  }
}
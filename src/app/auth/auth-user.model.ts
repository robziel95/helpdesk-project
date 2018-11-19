export interface AuthUser {
  //mongo creates unique id on its own
  id: string,
  name: string,
  surname: string,
  nickname: string,
  email: string,
  userType: string,
  password: string
}

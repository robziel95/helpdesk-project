export interface AuthUser {
  //mongo creates unique id on its own
  id: string,
  name: string;
  surname: string;
  email: string,
  userType: string,
  password: string
}

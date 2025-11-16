export interface User {
  id: string;
  username: string;
}

export interface UserApiResponse<T> {
  message: string;
  data: T;
}
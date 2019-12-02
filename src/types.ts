interface Timestamped {
  inserted_at: string,
  updated_at: string
}

export interface Status extends Timestamped {
  id: number
  user_id: number,
  user: User
  location: string
}

export interface User extends Timestamped {
  id: number,
  email: string,
  username: string,
  avatar: string
}

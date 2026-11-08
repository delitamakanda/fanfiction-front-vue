export interface Profile {
  photo: string
  bio: string
  date_of_birth: string
  location: string
}

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  date_joined: string
  profile: Profile
}

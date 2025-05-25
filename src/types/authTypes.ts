// Request body interfaces
export interface RegisterBody {
  username: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface UpdateProfileBody {
  username: string;
}
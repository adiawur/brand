import {
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

export interface LoginResponse {

  token: string;

  role: string;

  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL =
    'http://localhost:8182/api/auth';

  private readonly TOKEN_KEY =
    'zeco_token';

  private readonly ROLE_KEY =
    'zeco_role';

  private readonly USER_ID_KEY =
    'zeco_user_id';

  constructor(
    private http: HttpClient
  ) {}

  login(
    username: string,
    password: string
  ): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(

      `${this.API_URL}/login`,

      {
        username,
        password
      }

    );
  }

  saveSession(
    response: LoginResponse
  ): void {

    sessionStorage.setItem(
      this.TOKEN_KEY,
      response.token
    );

    sessionStorage.setItem(
      this.ROLE_KEY,
      response.role
    );

    sessionStorage.setItem(
      this.USER_ID_KEY,
      response.userId.toString()
    );
  }

  getToken(): string | null {

    return sessionStorage.getItem(
      this.TOKEN_KEY
    );
  }

  getRole(): string | null {

    return sessionStorage.getItem(
      this.ROLE_KEY
    );
  }

  getUserId(): number | null {

    const id =
      sessionStorage.getItem(
        this.USER_ID_KEY
      );

    return id ? Number(id) : null;
  }

  isLoggedIn(): boolean {

    return !!this.getToken();
  }

  logout(): void {

    sessionStorage.removeItem(
      this.TOKEN_KEY
    );

    sessionStorage.removeItem(
      this.ROLE_KEY
    );

    sessionStorage.removeItem(
      this.USER_ID_KEY
    );
  }
}
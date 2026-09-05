import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
id: number;
fullName: string;
username: string;
email: string;
phone: string;
role: string;
specialization?: string;
zone?: string;
active: boolean;
imageUrl: string | null;
}

export interface CreateUserRequest {
fullName: string;
username: string;
email: string;
phone: string;
password: string;
role: string;
specialization?: string;
zone?: string;
}

export interface UpdateUserRequest {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  specialization?: string;
  zone?: string;
  imageUrl?: string | null;
}

@Injectable({
providedIn: 'root'
})
export class UserService {

private readonly API_URL = 'http://localhost:8182/api/admin/users';

constructor(private http: HttpClient) {}

getAll(): Observable<User[]> {
return this.http.get<User[]>(this.API_URL);
}

getById(id: number): Observable<User> {
return this.http.get<User>(`${this.API_URL}/${id}`);
}

create(data: CreateUserRequest): Observable<User> {
return this.http.post<User>(this.API_URL, data);
}

update(id: number, data: UpdateUserRequest): Observable<User> {
return this.http.put<User>(`${this.API_URL}/${id}`, data);
}

changeStatus(id: number): Observable<User> {
return this.http.patch<User>(`${this.API_URL}/status/${id}`, {});
}

delete(id: number): Observable<string> {
return this.http.delete(`${this.API_URL}/${id}`, {
responseType: 'text'
});
}

uploadImage(id: number, image: File): Observable<User> {

const formData = new FormData();

formData.append('image', image);

return this.http.post<User>(
`${this.API_URL}/${id}/image`,
formData
);

}

getTechnicians(): Observable<User[]> {

  return this.http.get<User[]>(
    'http://localhost:8182/api/supervisor/technicians'
  );

}

getMyProfile(): Observable<User> {

  return this.http.get<User>(
    'http://localhost:8182/api/profile/me'
  );

}

updateMyProfile(data: UpdateUserRequest): Observable<User> {

  return this.http.put<User>(
    'http://localhost:8182/api/profile/me',
    data
  );

}

getSupervisorTechnicians(): Observable<User[]> {

  return this.http.get<User[]>(
    `http://localhost:8182/api/supervisor/technicians`
  );

}

}
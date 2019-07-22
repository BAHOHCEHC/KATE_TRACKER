import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Clients, Message } from "../interfaces";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ClientsService {
  constructor(private http: HttpClient) {}

  fetchAll(): Observable<Clients[]> {
    return this.http.get<Clients[]>("/api/clients");
  }

  getByName(name: string): Observable<Clients> {
    return this.http.get<Clients>(`/api/clients/${name}`);
  }

  create(catName: string, image?: File): Observable<Clients> {
    const formData = new FormData();
    if (image) {
      formData.append("image", image, image.name);
    }
    formData.append("name", catName);
    return this.http.post<Clients>("/api/clients", formData);
  }


// *******************
// *******************
// *******************
  update(id: string, clientName: string,totalHours:string, image?: File): Observable<Clients> {
    const formData = new FormData();
    if (image) {
      formData.append("image", image, image.name);
    }
    formData.append("name", clientName);
    formData.append("totalHours", totalHours);
    return this.http.patch<Clients>(`/api/clients/${id}`, formData);
  }
// *******************
// *******************

  delete(id: string): Observable<Message> {
    return this.http.delete<Message>(`/api/clients/${id}`);
  }
}

import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Agente } from '../models/agente';

@Injectable({
  providedIn: 'root'
})
export class FileXmlUploadService {

  constructor(private http: HttpClient) { }

  // ENVIO DO ARQUIVO XML
  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${environment.apiUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  // ENVIO DO JSON TRATADO
  uploadJsonFile(result: any): Observable<HttpEvent<any>> {

    const req = new HttpRequest('POST', `${environment.apiUrl}/uploadJson`, result as Array<Agente>, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

}

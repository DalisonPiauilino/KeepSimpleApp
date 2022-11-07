import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FileXmlUploadService } from './services/file-xml-upload.service';
import * as xml2js from 'xml2js';
import { Agente } from './models/agente';
import { Regiao } from './models/regiao';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app-front';

  selectedFiles?: FileList;
  selectedFileNames: string[] = [];

  progressInfos: any[] = [];

  //imageInfos?: Observable<any>;

  constructor(private fileXmlUploadService: FileXmlUploadService){}

  selectFiles(event: any): void {
    this.progressInfos = [];
    this.selectedFileNames = [];
    this.selectedFiles = event.target.files;

    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        this.selectedFileNames.push(this.selectedFiles[i].name);
      }
    }
  }

  uploadFiles(): void {
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }

  upload(idx: number, file: File): void {
    if (file) {
      this.progressInfos[idx] = { value: 0, fileName: file.name };

      const reader = new FileReader();
      reader.onload = (evt) => {
        const xmlData: string = (evt as any).target.result;

        const parser = new xml2js.Parser({ trim: true, explicitArray : false});
        parser.parseString( xmlData, (err: any, result: any) => {

          if (result.agentes.agente.length > 0) {
            console.log(result.agentes.agente);
            result.agentes.agente.map((ele: Agente) => {
              return ele.regiao.map((el: Regiao) => {
                delete el.$;
                delete el.precoMedio;
                return el;
              });
            })
          } else {
            result.agentes.agente.regiao.map((el: Regiao) => {
              delete el.$;
              delete el.precoMedio;
              return el;
            });
          }

          this.fileXmlUploadService.uploadJsonFile( (result.agentes.agente.length > 0) ? result.agentes.agente : [result.agentes.agente]).subscribe(
            (event: any) => {
              if (event.type === HttpEventType.UploadProgress) {
                this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
              } else if (event instanceof HttpResponse) {
                console.log('Arquivo enviado com sucesso: ' + file.name);
              }
            },
            (err: any) => {
              this.progressInfos[idx].value = 0;
              console.log("Erro ao enviar arquivo: ", file.name);
              console.log(err);
            }
          );
        });
      };
      reader.readAsText(file);


      // ENVIO DE ARQUIVO XML
      // this.fileXmlUploadService.upload(file).subscribe(
      //   (event: any) => {
      //     if (event.type === HttpEventType.UploadProgress) {
      //       this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
      //     } else if (event instanceof HttpResponse) {
      //       console.log('Arquivo enviado com sucesso: ' + file.name);
      //     }
      //   },
      //   (err: any) => {
      //     this.progressInfos[idx].value = 0;
      //     console.log("Erro ao enviar arquivo: ", file.name);
      //     console.log(err);
      //   }
      // );
    }
  }

}

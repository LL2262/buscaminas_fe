import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
//import { Respuesta } from '../models/respuesta';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, 
    private toastData: ToastrService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const authReq = req.clone({ 
        setHeaders: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.auth.getToken()
        },
         
      });
      
    return next.handle(authReq).pipe(
        tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                // Si queremos hacer algo con la respuesta, éste es el sitio.
               
            }
        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                switch (err.status) {
                    case 400:
                        this.toastData.warning(err.error.message, 'Atención', {timeOut: 3000} )
                        break;
                    case 404:
                        this.toastData.error(err.error.message, 'Error', {timeOut: 3000} )
                        break;
                    case 401:
                        this.toastData.warning(err.error.message, 'Atención', {timeOut: 3000} )
                        break;
                    default:
                        this.toastData.error(err.error.message, 'Error', {timeOut: 3000});
                        this.auth.logout();
                        break;
                }
            }
        })
    );
  }
}
import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, 
        HttpHandler,
        HttpResponse,
        HttpRequest} from '@angular/common/http';

import { Observable } from 'rxjs';


 
@Injectable()
export class MyHttp2Interceptor implements HttpInterceptor {
     
    constructor(){}
     
    intercept(req: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {
        console.log('Interceptor2 ran..');
        const started = Date.now();  // เวลาเริ่มต้นที่ request          
        
       // copy the body and trim whitespace from the name property
        //const newBody = { ...req.body, name: req.body.name.trim() };
        const newBody = { ...req.body, name: 'rawee' };

        // clone request and set its body
        const newReq = req.clone({ body: newBody });
        // send the cloned request to the next handler.


    // send cloned request with header to the next handler.
    return next.handle(newReq);
 
    }
 
}
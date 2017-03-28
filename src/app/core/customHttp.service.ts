/**
 * Created by dhl on 2016/12/14.
 */
import {Injectable}    from '@angular/core';
import {Http, URLSearchParams, RequestOptionsArgs, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class CustomHttp extends Http {

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    options = options || {};
    options.search = options.search || new URLSearchParams();
    var timestamp = (new Date()).getTime().toString();
    if (typeof options.search === 'string') {
      if ((<String>options.search).indexOf('?') < 0) {
        options.search = '?ts=' + timestamp;
      } else {
        options.search = '&ts=' + timestamp;
      }
    } else {
      (<URLSearchParams>options.search) .set('ts', timestamp);
    }

    return super.get(url, options);
  }
}

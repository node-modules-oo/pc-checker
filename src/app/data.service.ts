import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {NgxIndexedDB} from 'ngx-indexed-db';
import {from} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  data: any = {};
  db: NgxIndexedDB;

  constructor(private http: HttpClient) {
    this.db = new NgxIndexedDB('pcdb', 1);
    this.db.openDatabase(1, evt => {
      let objectStore = evt.currentTarget.result.createObjectStore('pc', {keyPath: 'id', autoIncrement: true});
      objectStore.createIndex('pcno', 'pcno', {unique: false});
    });
  }

  refresh() {
    return this.db.delete('pc', 'pcno').then(
      success => {
        // return this.http.get('./assets/data.json').pipe(
        return this.http.get('https://github.com/police-github/police-github.github.io/raw/master/data.json').pipe(
          map(res => {
            let promises = [];
            for (let key in res) {
              if (res.hasOwnProperty(key)) {
                promises.push(this.db.add('pc', {pcno: key, data: res[key]}));
              }
            }
            return from(Promise.all(promises));
          })
        );
      }
    );
  }

  search(pcNumber: string) {
    return from(this.db.getByIndex('pc', 'pcno', '' + pcNumber).then(
      pc => {
        console.debug('pc', pc);
        if (typeof pc !== 'undefined') {
          return pc.data;
        } else {
          return [];
        }
      },
      error => {
        //  do sth
      }
    ));
  }
}

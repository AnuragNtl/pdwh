import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable, Subject, ReplaySubject, from, of, range } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

path:string[]=[];
accessibleNodes:string[]=[];
  constructor(private http:HttpClient) { }

  ngOnInit() {
  this.reload();
  }
  reload()
  {
  this.http.get("http://localhost:8084/getSub?path="+encodeURIComponent(JSON.stringify(this.path)))
  //.pipe(map((response)=>JSON.parse(response)))
  .subscribe((data)=>{this.accessibleNodes=data;});
  }
  navigateToPath(e)
  {
  var s=parseInt(e.target.id.match(/[0-9]+?/));
  this.path.splice(s+1);
  this.reload();
  }
  navigateToAccessible(e)
  {
  this.path.push(e.target.innerText);
  this.reload();
  }
}

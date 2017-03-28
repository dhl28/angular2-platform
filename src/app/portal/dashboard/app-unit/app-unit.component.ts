import { Component ,Input} from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-unit',
  templateUrl:'./app-unit.component.html',
  styleUrls:['./app-unit.component.css']
})
export class AppUnitComponent {
  constructor(  private route: ActivatedRoute,  private router: Router) {
  }
  @Input() app;
  ngOnInit() {
    console.log(this.app);
    if(this.getStrLength(this.app.appName) > 13){
      this.app.appName = this.getSubStr(this.app.appName,13) + '...';
    }
    if(this.getStrLength(this.app.description) > 31){
      this.app.description = this.getSubStr(this.app.description,31) + '...';
    }
  }
  run(){
    console.log(this.app);
  }
  getStrLength(data){
  var sum = 0;
  for(var j = 0;j < data.length;j++){
    if(data.charCodeAt(j) > 255){
      sum += 2;
    }else{
      sum +=1;
    }
  }
  return sum;
}
  getSubStr(data,max){
  var sum = 0;
  var j = 0;
  for(;j < data.length && sum < max;j++){
    if(data.charCodeAt(j) > 255){
      sum += 2;
    }else{
      sum +=1;
    }
  }
  return data.substring(0,j);
}
  viewDetail(){
    let url = window.location.href;
    if (url.indexOf("portal") != -1) {
      this.router.navigate(['/portal/app',this.app.pk]);
    }else if (url.indexOf('workbench/app-market')!=-1){
      this.router.navigate(['/workbench/app-market/app',this.app.pk]);
    }else{
      this.router.navigate(['/workbench/app',this.app.pk]);
    }
  }
}

import { Component ,Input} from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';


@Component({
  selector: 'service-unit',
  templateUrl:'./service-unit.component.html',
  styleUrls:['./service-unit.component.css']
})
export class ServiceUnitComponent {
  toastr:any =  require("toastr");
  constructor(private route: ActivatedRoute,  private router: Router) {
  }
  @Input() service;
  ngOnInit() {

  }
  run(){
    console.log(this.service);
    var msg = this.service.name +"已启动。。";
    this.toastr.success(msg,'系统提示');

  }
  viewDetail(){
    this.router.navigate(['/portal/dataservice',this.service.apiPk]);
  }
}

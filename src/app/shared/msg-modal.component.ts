/**
 * Created by dhl on 2016/10/28.
 */
import {Component, ViewChild, EventEmitter, Output, Input} from '@angular/core';

// todo: change to ng2-bootstrap
import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';

@Component({
  selector: 'msg-modal',
  templateUrl: './msg-modal-component.html'
})
export class MsgModalComponent {
  @Output() msgModalBtnEvent = new EventEmitter<String>();
  @Input() msg:string = '确定要删除吗？';
  @Input() options:any = {type:'delete'};//delete|warning|info

  @ViewChild('staticModal') public childModal:ModalDirective;

  public showChildModal():void {
    this.childModal.show();
  }

  public hideChildModal():void {
    this.childModal.hide();
  }
  confirm(){
    this.msgModalBtnEvent.emit('confirm');
  }
  cancel(){
    this.hideChildModal();
    this.msgModalBtnEvent.emit('cancel');
  }
  getConfirmBtnLabel(){
    return this.options.type === 'delete'?'删除':'确定';
  }
}

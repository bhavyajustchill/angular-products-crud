import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-my-table',
  templateUrl: './my-table.component.html',
  styleUrls: ['./my-table.component.css'],
})
export class MyTableComponent {
  @Input() columnHeadingArray: any[] = [];
  @Input() gridData: any[] = [];
  @Input() editModal: string = '';
  @Input() deleteModal: string = '';
  @Output() editCallback = new EventEmitter<any>();
  @Output() confirmDeleteCallback = new EventEmitter<any>();

  onEdit(data: any): void {
    this.editCallback.emit(data);
  }

  onDelete(data: any): void {
    this.confirmDeleteCallback.emit(data);
  }
}

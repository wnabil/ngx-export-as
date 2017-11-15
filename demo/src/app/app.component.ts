import { Component } from '@angular/core';
import { ExportAsService, ExportAsOptions } from '../../../index'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  options: ExportAsOptions = {
    type: 'pdf',
    tableID: "mytable"
  };

  constructor(
    private exportAsService: ExportAsService
  ) {}

  exportAs(type) {
    this.options.type = type;
    this.exportAsService.getFile(this.options).subscribe(file => {
      console.log(file);
    });
  }

}


import { Component } from '@angular/core';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  config: ExportAsConfig = {
    type: 'pdf',
    elementId: 'mytable',
  };

  constructor(
    private exportAsService: ExportAsService
  ) {}

  exportAs(type) {
    this.config.type = type;
    this.exportAsService.save(this.config, 'myFile');
    // this.exportAsService.get(this.config).subscribe(content => {
    //   console.log(content);
    // });
  }

}


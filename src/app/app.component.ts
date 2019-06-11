import { Component } from '@angular/core';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  config: ExportAsConfig = {
    type: 'pdf',
    elementId: 'mytable',
    options: {
      jsPDF: {
        orientation: 'landscape'
      }
    }
  };

  constructor(
    private exportAsService: ExportAsService
  ) { }

  exportAs(type: SupportedExtensions, opt?: string) {
    this.config.type = type;
    if (opt) {
      this.config.options.jsPDF.orientation = opt;
    }
    this.exportAsService.save(this.config, 'myFile');
    // this.exportAsService.get(this.config).subscribe(content => {
    //   console.log(content);
    // });
  }

}


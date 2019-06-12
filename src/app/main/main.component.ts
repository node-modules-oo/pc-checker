import {Component, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import {Subject} from 'rxjs';
import {MatDialog} from '@angular/material';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  loading = false;
  pcNumber = '';
  result$: Subject<any> = new Subject<any>();

  constructor(private dataService: DataService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.result$.subscribe(next => {
      console.debug(next);
    });

  }

  search(pcNumber) {
    this.dataService.search(pcNumber).subscribe(result => this.result$.next(result));
  }

  refresh() {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.debug('[Load] ', (new Date()).toUTCString());
        this.loading = true;
        this.dataService.refresh().then(
          success => {
            success.subscribe(next => {
              next.subscribe(next => {
                console.debug('[Loaded] ', (new Date()).toUTCString());
                console.debug('[Loaded] ', next);
                this.loading = false;
              });
            });
          }
        );
      }
    });
  }
}

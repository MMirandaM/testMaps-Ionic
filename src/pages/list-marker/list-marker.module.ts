import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListMarkerPage } from './list-marker';

@NgModule({
  declarations: [
    ListMarkerPage,
  ],
  imports: [
    IonicPageModule.forChild(ListMarkerPage),
  ],
})
export class ListMarkerPageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MarkerDetailPage } from './marker-detail';

@NgModule({
  declarations: [
    MarkerDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(MarkerDetailPage),
  ],
})
export class MarkerDetailPageModule {}

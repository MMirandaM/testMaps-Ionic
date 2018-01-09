import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RouterDetailPage } from './router-detail';

@NgModule({
  declarations: [
    RouterDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(RouterDetailPage),
  ],
})
export class RouterDetailPageModule {}

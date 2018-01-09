import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { Geolocation } from '@ionic-native/geolocation';
import { IonicStorageModule } from '@ionic/storage';
import { ListMarkerPage } from '../pages/list-marker/list-marker'
import { AddRoutesPage } from '../pages/add-routes/add-routes';
//import { RouterDetailPage } from '../pages/router-detail/router-detail'
import { ConfigStorageProvider } from '../providers/config-storage/config-storage';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListMarkerPage,
    AddRoutesPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListMarkerPage,
    AddRoutesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ConfigStorageProvider
  ]
})
export class AppModule {}

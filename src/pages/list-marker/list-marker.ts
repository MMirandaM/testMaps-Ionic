import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ListMarkerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list-marker',
  templateUrl: 'list-marker.html',
})
export class ListMarkerPage {
  places:any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
  	this.storage.get('places').then((val) => {
      console.log(val);
    });

  }

  ionViewDidLoad() {
    //console.log(this.places);
  }

}

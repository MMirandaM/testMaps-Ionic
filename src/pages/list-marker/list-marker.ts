import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
//import { MarkerDetailPage } from '../marker-detail/marker-detail'

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
  places:Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
  	this.storage.get('places').then((data) => {
      for (var i in data) {
      	this.places.push(data[i]);
      }
    });
  }

  details(place:string) {
   let profileModal = this.modalCtrl.create("MarkerDetailPage",{data:place});
   profileModal.present();
 }
}

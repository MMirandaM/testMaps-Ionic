import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ConfigStorageProvider, Place } from '../../providers/config-storage/config-storage';

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
  places:Array<Place> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public placePvdr: ConfigStorageProvider, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
  	this.places = this.placePvdr.getConfigStorage().reverse();
  }

  details(place:string) {
   let description:string;
   let date:string;
   let lat:number;
   let lng:number; 

   for (var i in this.places) {
   	if (place == this.places[i].place) {
   		description = this.places[i].description;
   		date = this.places[i].date;
   		lat = this.places[i].latitude;
   		lng = this.places[i].longitude;
   	}
   }

   let profileModal = this.modalCtrl.create("MarkerDetailPage",{place:place, description:description, date:date, latitude:lat, longitude:lng});
   profileModal.present();
 }
}

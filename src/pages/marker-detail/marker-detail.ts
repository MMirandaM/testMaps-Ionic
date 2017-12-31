import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';

/**
 * Generated class for the MarkerDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 declare var google;

@IonicPage()
@Component({
  selector: 'page-marker-detail',
  templateUrl: 'marker-detail.html',
})
export class MarkerDetailPage {
  @ViewChild('map') mapElement: ElementRef;
  map:any;

  places:Array<any> = [];
  place:string = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private storage: Storage, public geolocation: Geolocation) {
  	this.place = navParams.get('data');
  }

  loadMap(){
  	console.log('miranda');
  	this.geolocation.getCurrentPosition().then((position) => {
  			let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  			let mapOption = {
  				center: latLng,
  				zoom: 15,
  				mapTypeId: google.maps.MapTypeId.TERRAIN
  			}
  			console.log('passou miranda ');
  			this.map = new google.maps.Map(this.mapElement.nativeElement, mapOption);
  			console.log('passou miranda ');
  		},
  		(err) => {
  			console.log('erro miranda');
  			console.log(err);
  		}
  		);
  	console.log('miranda');
  	}

  ionViewDidLoad() {
    this.loadMap();
    this.storage.get('places').then((data) => {
      for (var i in data) {
      	this.places.push(data[i]);
      }
    });
    
  }

  goBack(){
  	this.viewCtrl.dismiss();
  }

}

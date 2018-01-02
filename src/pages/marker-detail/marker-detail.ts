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

  place:string;
  description:string;
  date:string;
  lat:number;
  lng:number; 
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, public geolocation: Geolocation) {
  	this.place = navParams.get('place');
  	this.description = navParams.get('description');
  	this.date = navParams.get('date');
  	this.lat = navParams.get('latitude');
  	this.lng = navParams.get('longitude');
  }

  loadMap(){
  	let latLng = new google.maps.LatLng(this.lat, this.lng);
  	let mapOption = {
  		center: latLng,
  		zoom: 17,
  		mapTypeId: google.maps.MapTypeId.TERRAIN
  	}
  	this.map = new google.maps.Map(this.mapElement.nativeElement, mapOption);

  	let marker = new google.maps.Marker({
  		map: this.map,
  		animation: google.maps.Animation.DROP,
  		position: this.map.getCenter()
  	});
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  goBack(){
  	this.viewCtrl.dismiss();
  }

}

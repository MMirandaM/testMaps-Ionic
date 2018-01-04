import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { ConfigStorageProvider, Place } from '../../providers/config-storage/config-storage';

/**
 * Generated class for the AddRoutesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 declare var google;

@IonicPage()
@Component({
  selector: 'page-add-routes',
  templateUrl: 'add-routes.html',
})
export class AddRoutesPage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  map:any;

  lat:string;
  lng:string;

  places:Array<Place> = [];
  origem:string;
  destino:string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation, private alertCtrl: AlertController, public placePvdr: ConfigStorageProvider) {
    this.lat = this.navParams.get('lat');
    this.lng = this.navParams.get('lng');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddRoutesPage');
    this.loadMap();
    //this.startNavigating();
    this.places = this.placePvdr.getConfigStorage().reverse();
    //console.log(this.places);
  }

  loadMap(){

    let latLng = new google.maps.LatLng(-3.091584, -60.017973);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
   
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  startNavigating(){
    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer;
   
    directionsDisplay.setMap(this.map);
    directionsDisplay.setPanel(this.directionsPanel.nativeElement);
   
    directionsService.route({
      origin: 'Amazonas Shopping',
      destination: 'Manauara Shopping',
      travelMode: google.maps.TravelMode['DRIVING']
       }, (res, status) => {
         if(status == google.maps.DirectionsStatus.OK){
            directionsDisplay.setDirections(res);
         } else {
            console.warn('? ' + status);
         }
       });
  }
  onChange(s:string){
  	console.log(s);
  }
}

import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Geolocation} from '@ionic-native/geolocation';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map:any;

  constructor(public navCtrl: NavController, public geolocation: Geolocation, private alertCtrl: AlertController, private storage: Storage) {

  }

  places:any = [];

  place = {
    lugar: "",
    descricao: "",
    longitude:0,
    latitude: 0,
    data: ""
  }

  lat: number;
  lng: number;

  loadMap(){
  	this.geolocation.getCurrentPosition().then((position) => {
  			//let latLng = new google.maps.LatLng(-3.091584, -60.017973);
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
  			let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  			let mapOption = {
  				center: latLng,
  				zoom: 15,
  				mapTypeId: google.maps.MapTypeId.ROADMAP
  			}
  			this.map = new google.maps.Map(this.mapElement.nativeElement, mapOption);
  		},
  		(err) => {
  			console.log(err);
  		}
  		);
  	}

  ionViewDidLoad(){
  	this.loadMap();
  }

  AddInfoWindow(marker){
    this.addPlace();
  }

  addMarker(){
  	let marker = new google.maps.Marker({
  		map: this.map,
  		animation: google.maps.Animation.DROP,
  		position: this.map.getCenter()
  	});

  	this.AddInfoWindow(marker);
  }

  saveRegister(place:string, description:string){
    this.place.lugar = place;
    this.place.descricao = description;
    this.place.latitude = this.lat;
    this.place.longitude = this.lng;
    this.place.data = new Date(new Date().getTime() + 3600);

    this.places.push(this.place);
    console.log(this.places);
  }

  confirmationAlert(place:string, description:string){
    let create = this.alertCtrl.create({
      title:'Confirmação',
      subTitle: 'Dados redistrados',
      buttons:[{
        text:'Ok',
        handler: data => {
          this.saveRegister(place, description)
        }
      }]
    });

    create.present();
  }

  addDescription(place:string){
    let create = this.alertCtrl.create({
      title: 'Informação de Atividade',
      inputs:[
      {
        name: 'description',
        placeholder: 'O que você está fazendo?'
      }],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Register',
          handler: data => {
           console.log('Registered');
           this.confirmationAlert(place, data.description);
          }
        }
      ]
    });

    create.present();
  }
  addPlace() {
    let create = this.alertCtrl.create({
      title: 'Informação do Local',
      inputs: [
        {
          name: 'place',
          placeholder: 'Onde você está?'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Register',
          handler: data => {
           console.log('Registered');
           this.addDescription(data.place);
          }
        }
      ]
    });
    create.present();
  }
}


import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Geolocation} from '@ionic-native/geolocation';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ListMarkerPage } from '../list-marker/list-marker'

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map:any;

  constructor(public navCtrl: NavController, public geolocation: Geolocation, private alertCtrl: AlertController, public storage: Storage) {
  }

  places:any = [];

  place = {
    lugar: "",
    descricao: "",
    data:"",
    longitude:0,
    latitude: 0
  }

  lat: number;
  lng: number;

  // carregar 'googlemaps' na tela
  loadMap(){
  	this.geolocation.getCurrentPosition().then((position) => {
  			//let latLng = new google.maps.LatLng(-3.091584, -60.017973);
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
  			let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  			let mapOption = {
  				center: latLng,
  				zoom: 15,
  				mapTypeId: google.maps.MapTypeId.TERRAIN
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

  // ####*** Funções para adicionar marcadores ***###

  // função que chama um Prompt para adicionar
  //   informações sobre o lugar
  AddInfoWindow(marker){
    // AddListener -> gerenciador de eventos
    // event -> click sobre o marcador
    google.maps.event.addListener(marker, 'click', () =>{
      this.addPlace();
    });
  }

  // adiciona um marcador no centro do mapa
  addMarker(){
  	let marker = new google.maps.Marker({
  		map: this.map,
  		animation: google.maps.Animation.DROP,
  		position: this.map.getCenter()
  	});

  	this.AddInfoWindow(marker);
  }

  // switch para transforma o dia da semana:
  //   número -> string (1 -> domingo)
  getDayWeek(day:number){
    let week = "";

    switch (day) {
      case 1:
        week = 'Domingo';
        break;
      case 2:
        week = 'Segunda';
        break;
      case 3:
        week = 'Terça';
        break;
      case 4:
        week = 'Quarta';
        break;
      case 5:
        week = 'Quinta';
        break;
      case 6:
        week = 'Sexta';
        break;
      default:
        week = 'Sabado';  
        break;
    }

    return week;
  }

  // salva os dados capturados pelos Prompt's
  saveRegister(place:string, description:string){
    let today = new Date();
    let day_week = this.getDayWeek(today.getUTCDay());

    

    this.place.lugar = place;
    this.place.descricao = description;
    this.place.latitude = this.lat;
    this.place.longitude = this.lng;
    this.place.data = day_week + ' ' + today.getDate().toString() + '/' + today.getMonth().toString() + '/' + today.getFullYear().toString() + ' ' + today.getHours().toString() + ':' + today.getMinutes().toString() + ':' + today.getSeconds().toString();

    this.places.push(this.place);
    this.storage.set('places', this.places);
    console.log(this.places);
  }

  // Prompt: confirma o registro
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

  // Prompt: adiciona o nome do lugar e a descrição
  addPlace() {
    let create = this.alertCtrl.create({
      title: 'Informação do Local',
      inputs: [
        {
          name: 'place',
          placeholder: 'Onde você está?'
        },
        {
          name: 'description',
          placeholder: 'O que você está fazendo?'
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
           this.confirmationAlert(data.place, data.description);
          }
        }
      ]
    });
    create.present();
  }

  goToPageListMarker(){
    this.navCtrl.push(ListMarkerPage, {places:this.places});
  }
}

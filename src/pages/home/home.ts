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
    switch (day) {
      case 1:
        return 'Domingo'
        break;
      case 2:
        return 'Segunda'
        break;
      case 3:
        return 'Terça'
        break;
      case 4:
        return 'Quarta'
        break;
      case 5:
        return 'Quinta'
        break;
      case 6:
        return 'Sexta'
        break;
      case 7:
        return 'Sabado'
        break;
    }
  }

  // salva os dados capturados pelos Prompt's
  saveRegister(place:string, description:string){
    let today = new Date();
    let day_week = this.getDayWeek(today.getUTCDay());

    

    this.place.lugar = place;
    this.place.descricao = description;
    this.place.latitude = this.lat;
    this.place.longitude = this.lng;
    this.place.data = day_week + ' ' + today.getDate().toString() + '/' + today.getMonth().toString() + '/' + today.getYear().toString() + ' ' + today.getHours().toString() + ':' + today.getMinutes().toString() + ':' + today.getSeconds().toString();

    this.places.push(this.place);
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

  // Prompt: adiciona a descrição do lugar
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

  // Prompt: adiciona o nome do lugar
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

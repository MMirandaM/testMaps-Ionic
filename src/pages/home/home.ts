import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { ListMarkerPage } from '../list-marker/list-marker';
import { AddRoutesPage } from '../add-routes/add-routes';
import { ConfigStorageProvider, Place } from '../../providers/config-storage/config-storage';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map:any;

  constructor(public navCtrl: NavController, public geolocation: Geolocation, private alertCtrl: AlertController, public placePvdr: ConfigStorageProvider) {
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
  	this.loadMap();  }

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

  // date formato
  getDayWeek(){
    let days = ["Domingo","Segunda-Feira","Terça-Feira","Quarta-Feira","Quinta-Feira","Sexta-Feira","Sábado"];
    let today = new Date();
    let day = days[today.getUTCDay()];

    return day + ' - ' + today.getDate().toString() + '/' + (today.getMonth()+1).toString() + '/' + today.getFullYear().toString() + ' ' + today.getHours().toString() + ':' + today.getMinutes().toString() + ':' + today.getSeconds().toString();;
  }

  // salva os dados capturados pelos Prompt's
  saveRegister(place:string, description:string){
    let date = this.getDayWeek();
    let local = new Place();
    
    local.place = place;
    local.description = description;
    local.date = date;
    local.latitude = this.lat;
    local.longitude = this.lng;

    this.placePvdr.setConfigStorage(local);
  }

  // Prompt: confirma o registro
  confirmationAlert(place:string, description:string){
    let create = this.alertCtrl.create({
      title:'Confirmação',
      subTitle: 'Dados registrados',
      buttons:[{
        text:'Ok'
      }]
    });

    this.saveRegister(place, description);
    create.present();
  }

  fillAlert(){
    let alert = this.alertCtrl.create({
      title: 'Dados Incompletos',
      message: 'Preencha todos os campos!',
      buttons:[{
        text:'Ok',
        handler: data => {
          this.addPlace();
        }
      }]
    });

    alert.present();
  }

  // Prompt: adiciona o nome do lugar e a descrição
  addPlace() {
    let create = this.alertCtrl.create({
      title: 'Informação do Local',
      inputs: [
        {
          name: 'place',
          placeholder: 'Nome do Local'
        },
        {
          name: 'description',
          placeholder: 'Descrição da Atividade'
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
           if (data.place == "" || data.description == "") { 
             this.fillAlert();
           } else {
             this.confirmationAlert(data.place, data.description);
           }
          }
        }
      ]
    });
    create.present();
  }

  // ir para a page: list-maker
  goToPageListMarker(){
    this.navCtrl.push(ListMarkerPage);
  }

  goToPageAddRoutes(){
    this.navCtrl.push(AddRoutesPage,{lat:this.lat,lng:this.lng});
  }
}

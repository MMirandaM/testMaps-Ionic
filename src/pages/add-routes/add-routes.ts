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
  rota:Array<Place> = [];

  date_inicio:any = "";
  date_fim:any = "";
  sDate_inicio:string = "";
  sDate_fim:string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation, private alertCtrl: AlertController, public placePvdr: ConfigStorageProvider) {
    this.lat = this.navParams.get('lat');
    this.lng = this.navParams.get('lng');
  }

  ionViewDidLoad() {
    this.places = this.placePvdr.getPlaceConfigStorage();
    this.loadMap();
  }

  loadMap(){
    let latLng = new google.maps.LatLng(this.lat, this.lng);
    let mapOptions = {  
      center: latLng,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
   
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  //Prompt: Alerta de todos os tipos
  Alert(title:string, message:string, booll:boolean){
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons:[{
        text:'Ok'
      }]
    });
    if(booll == true) {
      this.sDate_inicio = "";
      this.sDate_fim = "";
    }
    
    alert.present();
  }

  createRouter(){
    for (var i in this.places) {
      let date_place = ((this.places[i].date).split(" ")[2]).split("/");
      let date_aux = new Date(Number(date_place[2]), Number(date_place[1]) - 1, Number(date_place[0]));
      
      if (date_aux >= this.date_inicio && date_aux <= this.date_fim) {
        this.rota.push(this.places[i]);
      }
    }
  }

  showRouter(){
    this.createRouter();

    if (this.rota.length != 0) {
      this.placePvdr.setRouteConfigStorage([this.sDate_inicio + ' à ' + this.sDate_fim ,this.date_inicio, this.date_fim]);
      if (this.rota.length > 1) {
        let place = this.rota.shift();
        let lat = place.latitude;
        let lng = place.longitude;

        let origem = {lat:Number(lat), lng:Number(lng)};

        place = this.rota.pop();
        lat = place.latitude;
        lng = place.longitude;

        let fim = {lat:Number(lat), lng:Number(lng)};

        let way_points:Array<any> = [];
        for (var i in this.rota) {
          let lt = this.rota[i].latitude;
          let lg = this.rota[i].longitude;
          let ltLg = {lat:lt, lng:lg};
          way_points.push({location:ltLg});
        }

        let renderOptions = {
          draggable: true
        };
        let directionsService = new google.maps.DirectionsService;
        let directionsDisplay = new google.maps.DirectionsRenderer(renderOptions);
        
        directionsDisplay.setMap(this.map);
        //directionsDisplay.setPanel(this.directionsPanel.nativeElement);
        
        directionsService.route({
          origin: origem,
          destination: fim,
          waypoints:way_points,
          travelMode: google.maps.TravelMode['DRIVING']
           }, (res, status) => {
             if(status == google.maps.DirectionsStatus.OK){
                directionsDisplay.setDirections(res);
             } else {
                console.warn('? ' + status);
             }
        });

        this.Alert('Informação','Rota adicionada com sucesso!',false);
      
      } else {
        this.Alert('Informação', 'Existe apenas um marcador no intervalo de tempo escolido',false)
        let place = this.rota.pop();

        let lat = Number(place.latitude);
        let lng = Number(place.longitude);

        let latLng = new google.maps.LatLng(lat, lng);
        this.map.setCenter(latLng);

        let marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: {lat:lat, lng:lng}
        });

        this.Alert('Informação', 'Rota adicionada com sucesso!',false)
        
      }
      this.rota = [];

    } else {
      this.Alert('Not Found', 'Nao existem marcadores no intervalo de tempo estabelecido!', true);
    }
  }
  
  addRouter(){
    if(this.sDate_inicio != "" && this.sDate_fim != ""){
      let aux_inicio = this.sDate_inicio.split("-");
      let aux_fim = this.sDate_fim.split("-");

      this.date_inicio = new Date(Number(aux_inicio[0]), Number(aux_inicio[1]) - 1, Number(aux_inicio[2]));
      this.date_fim = new Date(Number(aux_fim[0]), Number(aux_fim[1]) - 1, Number(aux_fim[2]));
      
      if (this.date_fim >= this.date_inicio) {
        this.showRouter();
      } else {
        this.Alert('Dados Incoerentes', 'Verifique se o intervalo de tempo é válido!', true);
      }
    }else{
      this.Alert('Dados Incompletos', 'Selecione um intervalo de tempo (Inicio e Fim)!', false);
    }
  }
}

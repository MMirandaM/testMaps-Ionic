import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController  } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';


declare var google;

@IonicPage()
@Component({
  selector: 'page-router-detail',
  templateUrl: 'router-detail.html',
})


export class RouterDetailPage {
  @ViewChild('map') mapElement: ElementRef;
  
  map:any;  // contém o mapa - Google Maps
  rota:Array<any> = []; // contém a rota selecionada

  constructor(public navCtrl: NavController, private alertCtrl: AlertController, public navParams: NavParams, private viewCtrl: ViewController, public geolocation: Geolocation) {
  	this.rota = navParams.get('rota');
  }


  /*
    Função de inicialização da page
      -chamada da função para apresentação do mapa
  */
  ionViewDidLoad() {
    this.loadMap();
  }


  /*
    Função onde irá carregar o mapa na page
  */
  loadMap(){
    this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      
      // configurações do mapa
      let mapOption = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      // atribui o mapa para variável
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOption);
      
      // chama a função que irá apresentar a rota
      this.showRouter();
    },
    (err) => {
      console.log(err);
    }
    );
  }


  //Prompt: Alerta de todos os tipos
  Alert(title:string, message:string){
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons:[{
        text:'Ok'
      }]
    });
    
    alert.present();
  }


  /*
    Função onde carrega a rota no mapa
  */
  showRouter(){
    // se existe mais de um marcador na rota
    if (this.rota.length > 1) {

      // captura o primeiro marcador
      let place = this.rota.shift();
      let lat = place.latitude;
      let lng = place.longitude;

      let origem = {lat:Number(lat), lng:Number(lng)};

      // capura o último marcador
      place = this.rota.pop();
      lat = place.latitude;
      lng = place.longitude;

      let fim = {lat:Number(lat), lng:Number(lng)};

      // seleciona os pontos intermediários da rota
      let way_points:Array<any> = [];
      for (var i in this.rota) {
        let lt = this.rota[i].latitude;
        let lg = this.rota[i].longitude;
        let ltLg = {lat:Number(lt), lng:Number(lg)};
        way_points.push({location:ltLg});
      }

      let directionsService = new google.maps.DirectionsService;
      let directionsDisplay = new google.maps.DirectionsRenderer;
      
      directionsDisplay.setMap(this.map);
      //directionsDisplay.setPanel(this.directionsPanel.nativeElement);
      
      directionsService.route({
        origin: origem,
        destination: fim,
        waypoints: way_points,
        travelMode: google.maps.TravelMode['DRIVING']
         }, (res, status) => {
           if(status == google.maps.DirectionsStatus.OK){
              directionsDisplay.setDirections(res);
           } else {
              console.warn('? ' + status);
           }
      });
    
    // caso existe apenas um marcador
    } else {
      this.Alert('Informação', 'Existe apenas um marcador no intervalo de tempo escolido');
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
    }
  }
  

  /*
  Função que retorna a page anterior
  */
  goBack(){
  	this.viewCtrl.dismiss();
  }
}

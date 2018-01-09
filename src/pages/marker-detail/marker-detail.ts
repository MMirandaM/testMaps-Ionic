import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';


declare var google;

@IonicPage()
@Component({
  selector: 'page-marker-detail',
  templateUrl: 'marker-detail.html',
})


export class MarkerDetailPage {
  @ViewChild('map') mapElement: ElementRef;
  
  map:any;  // contém o mapa - Google Maps
  place:any;  // contém o local selecionado
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, public geolocation: Geolocation) {
    this.place = navParams.get('place');
  }


  /*
    Função de inicialização da page
      -chamada da função para apresentação do mapa
  */
  ionViewDidLoad(){
    this.loadMap();
  }

  /*
    Função onde irá carregar o mapa na page
  */
  loadMap(){
  	let latLng = new google.maps.LatLng(this.place.latitude, this.place.longitude);
  	
    // configurações do mapa
    let mapOption = {
  		center: latLng,
  		zoom: 17,
  		mapTypeId: google.maps.MapTypeId.TERRAIN
  	}

    // atribui o mapa para variável
  	this.map = new google.maps.Map(this.mapElement.nativeElement, mapOption);

  	// adiciona um marcador no centro do mapa
    let marker = new google.maps.Marker({
  		map: this.map,
  		animation: google.maps.Animation.DROP,
  		position: this.map.getCenter()
  	});
  }


  /*
  Função que retorna a page anterior
  */
  goBack(){
  	this.viewCtrl.dismiss();
  }

}

import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { ListMarkerPage } from '../list-marker/list-marker';
import { AddRoutesPage } from '../add-routes/add-routes';
import { ConfigStorageProvider, Place } from '../../providers/config-storage/config-storage';


declare var google;  // varável global para o Google Maps

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  
  map:any;  // contém o mapa - Google Maps

  // contém a posição (lat,lng) do marcador selecionado
  lat: number;
  lng: number;

  // contém a posição (lat,lng) atual do usuário
  lat_current: number;
  lng_current: number;

  constructor(public navCtrl: NavController, public geolocation: Geolocation, private alertCtrl: AlertController, public placePvdr: ConfigStorageProvider) {
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
    this.geolocation.getCurrentPosition().then((position) => {
      
      // captura a posição atual do usuário
      this.lat_current = position.coords.latitude;
      this.lng_current = position.coords.longitude;

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      
      // configurações do mapa
      let mapOption = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      // atribui o mapa para variável
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOption);
    },
    (err) => {
      console.log(err);
    }
    );
  }


  /*
    Função que adiciona o marcador a lista 'places'
  */
  AddInfoWindow(marker){

    // evento sobre o marcador ao ser clicado salva a posição (lat,lng)
    //   e acionar uma janela para salvar o marcador
    google.maps.event.addListener(marker, 'click', () =>{
      this.lat = marker.position.lat();
      this.lng = marker.position.lng();

      this.addPlace();
    });

  }


  /*
    Função que adiciona um marcador no centro do mapa
  */
  addMarker(){
    let marker = new google.maps.Marker({
      draggable: true,
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    this.AddInfoWindow(marker);
  }

  
  /*
    Função onde é gerado a data em um determinado formato
  */
  getDayWeek(){
    let days = ["Domingo","Segunda-Feira","Terça-Feira","Quarta-Feira","Quinta-Feira","Sexta-Feira","Sábado"];
    let today = new Date();
    let day = days[today.getUTCDay()];

    return day + ' - ' + today.getDate().toString() + '/' + (today.getMonth()+1).toString() + '/' + today.getFullYear().toString() + ' ' + today.getHours().toString() + ':' + today.getMinutes().toString() + ':' + today.getSeconds().toString();;
  }


  /*
    Função que salva os dados passados sobre um marcador
      *é feita a chama de um 'provider' onde salva
        os dados em um 'Storage'
  */
  saveRegister(place:string, description:string){
    let date = this.getDayWeek();
    let local = new Place();
    
    local.place = place;
    local.description = description;
    local.date = date;
    local.latitude = this.lat;
    local.longitude = this.lng;

    this.placePvdr.setPlaceConfigStorage(local);
  }

  
  /*
    Função Alert Controller - confirma os dados salvos
  */
  confirmationAlert(place:string, description:string){
    let create = this.alertCtrl.create({
      title:'Confirmação',
      subTitle: 'Dados registrados',
      buttons:[{
        text:'Ok'
      }]
    });

    // envia os dados para serem salvos
    this.saveRegister(place, description);
    create.present();
  }

  
  /*
    Função Alert Controller - dados incompletos
  */
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
  

  /*
    Função Alert Controller - captura atravéz de 'textBox' a descrição
      e o nome do local
  */
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
          }
        },
        {
          text: 'Register',
          handler: data => {
           
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

  
  /*
    Função de transição de pages -> Lista de Marcadores/Rotas
  */
  goToPageListMarker(){
    this.navCtrl.push(ListMarkerPage);
  }

  
  /*
    Função de transição de pages -> Adicionar uma Rota
  */
  goToPageAddRoutes(){
    this.navCtrl.push(AddRoutesPage,{lat:this.lat_current,lng:this.lng_current});
  }

  
  /*
    Função que atualiza e posiciona no centro do mapa
      a posição atual do usuário
  */
  current_Position(){
    var infowindow = new google.maps.InfoWindow({
      content: 'Posição Atual'
    });

    // adicionar um pop-up de informação no posição atual 
    infowindow.setPosition({lat:Number(this.lat_current), lng:Number(this.lng_current)});
    infowindow.open(this.map);
    
    this.map.setCenter({lat:Number(this.lat_current), lng:Number(this.lng_current)});
    setTimeout(()=> {infowindow.close();}, '1500');
  }
}

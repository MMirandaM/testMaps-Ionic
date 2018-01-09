import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { ConfigStorageProvider, Place } from '../../providers/config-storage/config-storage';


declare var google;  // varável global para o Google Maps

@IonicPage()
@Component({
  selector: 'page-add-routes',
  templateUrl: 'add-routes.html',
})


export class AddRoutesPage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  
  map:any;  // contém o mapa - Google Maps

  places:Array<Place> = [];  // contém todos marcadores salvos
  rota:Array<Place> = [];  // contém os marcadores em uma rota

                    // variáveis criadas para se trabalhar dentro do '.ts'
  date_inicio:any;  // data de inicio, recebe sDate_inicio na forma de 'Date'
  date_fim:any;     // date de fim, recebe sDate_fim na forma de 'Date'
  
                              // variáveis que recebe o valor selecionado no '.html'
  sDate_inicio:string = "";   // data de inicio
  sDate_fim:string = "";      // data de fim


  constructor(public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation, private alertCtrl: AlertController, public placePvdr: ConfigStorageProvider) {
  }


  /*
    Função de inicialização da page
      
      -carrega todos os marcadores salvos
      -chamada da função para apresentação do mapa
  */
  ionViewDidLoad() {
    this.places = this.placePvdr.getPlaceConfigStorage();
    
    this.loadMap();
  }


  /*
    Função onde irá carregar o mapa na page
  */
  loadMap(){
    this.geolocation.getCurrentPosition().then((position) => {

      // captura a posição atual do usuário
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
    Função Alert Controller que apresenta uma mensagem
      na tela de acordo com os parâmetros

      parâmetros:
        -title: título da mensagem
        -message: corpo da mensagem
        -booll: *parâmetro de controle ( casos específicos )
  */
  Alert(title:string, message:string, booll:boolean){
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons:[{
        text:'Ok'
      }]
    });

    // caso o valor booleano seja 'true'
    //   as variáveis irão 'reiniciar'
    if(booll == true) {
      this.sDate_inicio = "";
      this.sDate_fim = "";
    }
    
    alert.present();
  }


  /*
    Função onde cria a rota de acordo com o intervalo
      de tempo estabelecido e salva numa variável 'this.rota'
  */
  createRouter(){
    for (var i in this.places) {

      // captura a string que representa a data e
      //   transforma-a em um 'Date'
      let date_place = ((this.places[i].date).split(" ")[2]).split("/");
      let date_aux = new Date(Number(date_place[2]), Number(date_place[1]) - 1, Number(date_place[0]));
      
      if (date_aux >= this.date_inicio && date_aux <= this.date_fim) {
        this.rota.push(this.places[i]);
      }
    }
  }
  
  
  /*
    Função onde carrega a rota no mapa
  */
  showRouter(){
    this.createRouter();

    // se existe rota no intervalo de tempo
    if (this.rota.length != 0) {
      this.placePvdr.setRouteConfigStorage([this.sDate_inicio + ' à ' + this.sDate_fim ,this.date_inicio, this.date_fim]);
      
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
          let ltLg = {lat:lt, lng:lg};
          way_points.push({location:ltLg});
        }

        let directionsService = new google.maps.DirectionsService;
        let directionsDisplay = new google.maps.DirectionsRenderer;
        
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
      
      // caso existe apenas um marcador
      } else {
        this.Alert('Informação', 'Existe apenas um marcador no intervalo de tempo escolido',false);
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
      // *caso não exista marcadores no intervalo de tempo
      //    as variáveis sDate_inicio e sDate_fim serão 'reiniciadas'
      this.Alert('Not Found', 'Nao existem marcadores no intervalo de tempo estabelecido!', true);
    }
  }
  
  /*
    Função de validação do intervalo de tempo
  */
  addRouter(){
    if(this.sDate_inicio != "" && this.sDate_fim != ""){

      // captura a data em forma de string
      let aux_inicio = this.sDate_inicio.split("-");
      let aux_fim = this.sDate_fim.split("-");

      // transforma a data 'string' em data 'Date'
      this.date_inicio = new Date(Number(aux_inicio[0]), Number(aux_inicio[1]) - 1, Number(aux_inicio[2]));
      this.date_fim = new Date(Number(aux_fim[0]), Number(aux_fim[1]) - 1, Number(aux_fim[2]));
      
      if (this.date_fim >= this.date_inicio) {
        this.showRouter();
      } else {

        // *caso os valores sejam inválidos, as variáveis sDate_inicio
        //    e sDate_fim serão 'reiniciadas'
        this.Alert('Dados Incoerentes', 'Verifique se o intervalo de tempo é válido!', true);
      }
    }else{
      this.Alert('Dados Incompletos', 'Selecione um intervalo de tempo (Inicio e Fim)!', false);
    }
  }
}

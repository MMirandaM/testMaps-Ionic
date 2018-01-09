import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ConfigStorageProvider, Place } from '../../providers/config-storage/config-storage';


@IonicPage()
@Component({
  selector: 'page-list-marker',
  templateUrl: 'list-marker.html',
})


export class ListMarkerPage {

  places:Array<Place> = [];  //  contém todos os marcadores
  rotas:Array<Place> = [];  // contém todas as rotas
  rota:Array<Place> = [];  // contém a rota selecionada

  constructor(public navCtrl: NavController, public navParams: NavParams, public placePvdr: ConfigStorageProvider, public modalCtrl: ModalController) {
  }


  /*
    Função de inicialização da page
      -carrega todos os marcadores
      -carrega todas as rotas
  */
  ionViewDidLoad() {
    this.places = this.placePvdr.getPlaceConfigStorage().reverse();
    this.rotas = this.placePvdr.getRouteConfigStorage().reverse();
  }


  /*
    Função que carrega os dados do lugar selecionado e envia
      para um ModelControlle
  */
  detailsPlace(place) {
   let lugar = new Place();

   lugar.place = place.place;
   lugar.description = place.description;
   lugar.date = place.date;
   lugar.latitude = place.latitude;
   lugar.longitude = place.longitude;

   console.log(place);

   let profileModalMarker = this.modalCtrl.create("MarkerDetailPage",{place:lugar});
   profileModalMarker.present();
 }


 /*
    Função que carrega os dados da rota selecionado
  */
 createRouter(date_inicio, date_fim){
   console.log(date_inicio, date_fim);
   for (var i in this.places) {
     let date_place = ((this.places[i].date).split(" ")[2]).split("/");
     let date_aux = new Date(Number(date_place[2]), Number(date_place[1]) - 1, Number(date_place[0]));
     
     if(date_aux >= date_inicio && date_aux <= date_fim) {
       this.rota.push(this.places[i]);
     }
   }
 }


 /*
   Função que envia os dados carregados para um ModelControlle
 */
 detailsRoute(date){
   this.createRouter(date[1], date[2]);
   let profileModalRouter = this.modalCtrl.create("RouterDetailPage",{rota: this.rota});
   profileModalRouter.present();
   this.rota = [];
 }
}

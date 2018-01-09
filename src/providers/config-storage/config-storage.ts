import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
  Generated class for the ConfigStorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConfigStorageProvider {
  private key_place = 'configPlace';
  private place:Array<Place> = [];
  private key_rota = 'configRota'
  private rota:Array<any> = [];


  constructor(public storage: Storage) {
    this.loadData();
  }

  loadData(){
  	this.storage.get(this.key_place).then((data) => {
      console.log(data);
      for (var i in data) {
        this.place.push(data[i]);
      }
    });

    this.storage.get(this.key_rota).then((data) => {
      console.log(data);
      for (var i in data) {
        this.rota.push(data[i]);
      }
    });

  }

  setPlaceConfigStorage(data){
    this.place.push(data);

    this.storage.set(this.key_place, this.place);
  }

  getPlaceConfigStorage(){
    return this.place;
  }

  setRouteConfigStorage(data){
    console.log(data);
    this.rota.push(data);

    console.log(this.rota);

    this.storage.set(this.key_rota, this.rota);
  }

  getRouteConfigStorage(){
    return this.rota;
  }

}

export class Place{
  place: string;
  description: string;
  date: string;
  latitude: number;
  longitude: number;
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
  Generated class for the ConfigStorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConfigStorageProvider {
  private key = 'configPlace';
  private place:Array<Place> = [];


  constructor(public storage: Storage) {
    this.loadData();
  }

  loadData(){
  	this.storage.get(this.key).then((data) => {
  		console.log(data);
  		for (var i in data) {
  			this.place.push(data[i]);
  		}
  	});

  }

  setConfigStorage(data){
  	this.place.push(data);

  	this.storage.set(this.key, this.place);
  }

  getConfigStorage(){
  	return this.place;
  }

}

export class Place{
  place: string;
  description: string;
  date: string;
  latitude: number;
  longitude: number;
}
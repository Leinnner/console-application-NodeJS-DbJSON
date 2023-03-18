import fs from 'fs';
import axios from 'axios';




export default class Busquedas {

historial = [];

dbPATH = './db/database.json';

constructor(){
    //TODO: leer DB si existe
    this.leerDB();
   
}

get historialCapitalizado(){
    //Cada una de las palabras debe ir en mayuscula
    return this.historial.map(lugar=>{
        let palabras = lugar.split(' ');
        palabras = palabras.map(p=>p[0].toUpperCase() + p.substring(1));
        return palabras.join(' ');
    })
    
}

get paramsMapBox(){
    return{
        'access_token': process.env.MAPBOX_KEY || '',
        'limit':5,
        'language': 'es'
    }
}



get paramsOpenWeather(){
    return{
        'appid': process.env.OPENWEATHER || '',
        'units':'metric',
        'lang': 'es'
    }
}


async ciudad(lugar=''){


    try {
        //Peticion http
        const instance = axios.create({
            baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
            params: this.paramsMapBox
        });

        const resp  = await instance.get();
   return resp.data.features.map(lugar=>({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1],
   }));

    return [];
    } catch (error) {
        return [];
    }

    return []; //Return los lugares que coinciden

}

async climaLugar(lat, lon){
    try {
        //Crear la instance de axios.create
        const instance = axios.create({
            baseURL: `https://api.openweathermap.org/data/2.5/weather`,
            params: {...this.paramsOpenWeather, lat, lon}
        });

        //Resp, extraer la informacion en la data
        const resp = await instance.get();

        //Retorna un objeto, con descripcion, temp minima, temp maxima y normal


        const {weather, main} = resp.data
        return {
            desc: weather[0].description,
            temp: main.temp,
            temp_maxima: main.temp_max,
            temp_minima: main.temp_min
        };
        
        return [];

    } catch (error) {
        console.log(error);
    }
    return [];
}

agregarHistorial(lugar=''){
    //TODO: prevenir duplicado


    if(this.historial.includes(lugar.toLocaleLowerCase() ) ){
        return;
    }

    this.historial =this.historial.slice(0,5);
    this.historial.unshift(lugar.toLocaleLowerCase());

    //Grabar en DB
    this.guardarDB();
}


guardarDB(){
    const payload = {
        historial: this.historial
    }


    fs.writeFileSync(this.dbPATH, JSON.stringify(payload));
}


leerDB(){
    //Verificar que exista

    //Si existe carga la informacion, readFileSync manda el path, encoding UTF-8

    const archivo = this.dbPATH;
    if(!fs.existsSync(archivo)) return;
    

    const info = fs.readFileSync(archivo, {encoding: 'utf-8'});
    const data = JSON.parse(info);
   

   this.historial = data.historial;
}

}
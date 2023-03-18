import inquirer from "inquirer";
import { inquirerMenu, leerInput, listarLugares, pausa } from "./helpers/inquirer.js"
import Busquedas from "./models/busquedas.js";
import * as dotenv from 'dotenv';
dotenv.config()


const main = async() =>{
    let opt = 0;

    const busquedas = new Busquedas();
    
    do{
         opt = await inquirerMenu();
    
    switch (opt) {
        case 1:
            //Mostrar mensaje
            const termino = await leerInput('Ciudad: ');
           //Buscar los lugares
           const lugares = await busquedas.ciudad(termino);
           
           //Seleccionar el lugar
           const id = await listarLugares(lugares);

           if(id==='0')continue;


           const lugarSeleccionado = lugares.find(l => l.id === id);
           //Guardar en DB
           busquedas.agregarHistorial(lugarSeleccionado.nombre);
            
           //Datos del clima
            const clima = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng);
            
           //Mostrar resultados

           console.log('\nInformacion de la ciudad\n'.green);
           console.log('Ciudad: ', lugarSeleccionado.nombre);
           console.log('Lat: ', lugarSeleccionado.lat);
           console.log('Lng: ', lugarSeleccionado.lng);
           console.log('Temperatura: ', clima.temp);
           console.log('Temp Minima: ', clima.temp_minima);
           console.log('Temp Maxima: ', clima.temp_maxima);
           console.log('Como esta el clima: ', clima.desc.green);
            break;

        case 2:
            busquedas.historialCapitalizado.forEach((lugar, i)=>{
                const idx = `${i+1}.`.green;
                console.log(`${idx} ${lugar}`);

            })

            break;
           
    }

   opt !==0 ? await pausa() : '';
}while(opt !== 0);

    



}


main();
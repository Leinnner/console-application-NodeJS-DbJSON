import inquirer from "inquirer";
import colors from "colors";

const menuOpts = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {value: 1, name: `${'1.'.green} Buscar ciudad`},
            {value: 2, name: `${'2.'.green} Historial`},
            {value: 0, name: `${'3.'.green} Salir`},
        ]
    }

];

export const inquirerMenu = async()=>{
    console.clear();
    console.log('=========================='.green);
    console.log('  Seleccione una opción'.white);
    console.log('==========================\n'.green);

    const {opcion} = await inquirer.prompt(menuOpts);

    return opcion;
}


export const pausa = () => {
    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${'ENTER'.green} para continuar`
        }
    ];
    console.log('\n');
    return inquirer.prompt(question);
}


export const leerInput = async(message) =>{
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value){
                if(value.length === 0){
                    return 'Porfavor ingrese un valor';
                }
                return true;
            }
        }

    ];

    const {desc} = await inquirer.prompt(question);

    return desc;
}



export const listarLugares = async(lugares = []) =>{
   const choices = lugares.map((lugar,i) =>{
    const idx = `${i +1}.`.green;
    return{
        value: lugar.id,
        name: `${idx} ${lugar.nombre}`
    }
    
   });

   choices.push(
    {
        value: '0',
        name: '0.'.green + ' Cancelar'
    }
   );

   const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar: ', 
            choices
        }
   ] 
    const {id } = await inquirer.prompt(preguntas);
    return id
}

export const confirmar = async (message) =>{
    const question = [{
        type: 'confirm',
        name: 'ok',
        message
    }];
    const {ok} = await inquirer.prompt(question);
    return ok
}


export const mostrarListadoCheckList = async(tareas = []) =>{
    const choices = tareas.map((tarea,i) =>{
     const idx = `${i +1}.`.green;
     return{
         value: tarea.id,
         name: `${idx} ${tarea.desc}`,
         checked: (tarea.completadoEn) ? true : false
     }
    });
 
    const preguntas = [
         {
             type: 'checkbox',
             name: 'ids',
             message: 'Selecciones', 
             choices
         }
    ] 
     const {ids } = await inquirer.prompt(preguntas);
     return ids
 }

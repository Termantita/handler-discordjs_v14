require("dotenv").config();
require("colors");


const Bot = require("./structures/Client");

// const start = async () => { 
//   try {
//     await instance.login(process.env.REST_USER, process.env.REST_PASSWORD, process.env.REST_EMAIL);
//   } catch (err) {
//     if (err.ok === false) {
//       console.log(err);
//       throw new Error('No se pudo iniciar sesión en el REST');  
//     }
//   }
// }

// console.clear();
// const instance = new Rest();
// start();


// await instance.postMessage({username: 'admin', id: 2, message: 'test', token: instance.token});

new Bot();

import http  from "http";
import {Readable}  from "stream";

// funcao generator
// essa funcao nao espera a finalizacao dela para mandar o valor, conforme e processada ela vai entregando o valor enquanto continua a ser executada
function* run() {
  for (let index = 0; index <= 99; index++) {
    const data = {
      id: index,
      name: `Iago-${index}`,
    };
    yield data;
  }
}

async function handler(request, response) {
  const readable = new Readable({
    read() {
      for (const data of run()) {
        console.log(`sending`, data);
        this.push(JSON.stringify(data) + "\n");
      }
      // dados acabaram? entao realizar push no valor null
      this.push(null);
    },
  });

  readable.pipe(response);
}

// servidor criado com http
http
  .createServer(handler)
  .listen(3000)
  .on("listening", () => {
    console.log("server running on port 3000");
  });

import  axios from "axios";
import  {Transform, Writable} from "stream";

const url = "http://localhost:3000";

async function consume() {
  const response = await axios({
    url,
    method: "get",
    responseType: "stream",
  });

  return response.data;
}

const stream = await consume();

// Transform e o responsavel por alterar o dado recebido ou enviado
stream
  .pipe(
    new Transform({
      transform(chunk, encoded, callback) {
        const item = JSON.parse(chunk);
        const [name, myNumber] = item.name.split("-");

        if (Number(myNumber) % 2 === 0) {
          item.name = item.name.concat(" e par");
        } else {
          item.name = item.name.concat(" e impar");
        }

        callback(null, JSON.stringify(item));
      },
    })
  )
  .pipe(
    // Writable e o responsavel por dar vazao/saida do valor alterado no Transform
    new Writable({
      write(chunk, encoded, callback) {
        console.log(chunk.toString());
        callback();
      },
    })
  );


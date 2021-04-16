import express from 'express';
import fs from 'fs';
import {add, subtract, multiply,divide, randomNumber} from './operations.js';

const app = express();

const PORT = process.env.PORT || 8080;
app.set('PORT', PORT);
const server = app.listen(app.get('PORT'), () => {
    console.log(`Server listening on port ${app.get('PORT')}`);
});

app.get('/' , (req , res)=>{
    let date = new Date();
    if(date.getHours() >= 6 && date.getHours() <= 12){
        res.end('Buenos dias!');
    }
    if(date.getHours() >= 13 && date.getHours() <= 19){
        res.end('Buenos tardes!');
    }
    if (date.getHours() >= 20 && date.getHours() <= 5) {
        res.end('Buenos noches!');
    }
});

app.get('/random' , (req , res)=>{
    let obj = {};
    for (let index = 0; index < 10000; index++) {
        let num = randomNumber(1,20);
        if(obj.hasOwnProperty([num])){
            obj[num]++;
        }else{
            obj = {...obj, [num]: 1};
        }
    }
    res.json(obj);
});

app.get('/info' , async (req , res)=>{
    let file = './package.json';
    let info = {};

    try {
        let data = await fs.promises.readFile(file);

        let json = JSON.parse(data);
        info.contenidoStr = JSON.stringify(json, null, 2);
        info.contenidoObj = json;
        info.size = fs.statSync(file).size;
        console.log(info);

        await fs.promises.writeFile('./info.txt', JSON.stringify(json, null, 2));

        res.json(info);

    } catch (error) {
        res.status(500).send(`Error reading file/writing ${file}`);
    }
})

app.get('/operaciones' , (req , res)=>{
    let data = req.query;
    let num1 = Number(data.num1);
    let num2 = Number(data.num2);
    let operation = data.operacion;

    if(typeof num1 != 'number' || typeof num2 != 'number' || typeof operation != 'string' || num1 == null || num2 == null || operation == null){
        res.json({
            error: {
                num1: {
                    valor: num1,
                    tipo: typeof num1
                },
                num2: {
                    valor: num2,
                    tipo: typeof num2
                },
                operacion: {
                    valor: operation,
                    tipo: typeof operation
                }
            }
        })
    }else{
        switch (operation) {
            case 'suma':
                res.json({
                    num1,
                    num2,
                    operacion: operation,
                    resultado: add(num1,num2)
                });
                break;
            case 'resta':
                res.json({
                    num1,
                    num2,
                    operacion: operation,
                    resultado: subtract(num1,num2)
                });
                break;
            case 'multiplicacion':
                res.json({
                    num1,
                    num2,
                    operacion: operation,
                    resultado: multiply(num1,num2)
                });
                break;
            case 'divicion':
                if(num2 == 0){
                    res.json({
                        error: {
                            num1: {
                                valor: num1,
                                tipo: typeof num1
                            },
                            num2: {
                                valor: num2,
                                tipo: typeof num2
                            },
                            operacion: {
                                valor: operation,
                                tipo: typeof operation
                            }
                        }
                    });
                }
                res.json({
                    num1,
                    num2,
                    operacion: operation,
                    resultado: divide(num1,num2)
                });
                break;
            default:
                res.json({
                    error: {
                        num1: {
                            valor: num1,
                            tipo: typeof num1
                        },
                        num2: {
                            valor: num2,
                            tipo: typeof num2
                        },
                        operacion: {
                            valor: operation,
                            tipo: typeof operation
                        }
                    }
                });
                break;
        }
    }
})

server.on('error', error => console.log(`Server error: ${error}`));

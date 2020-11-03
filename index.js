import express from 'express';
import { nanoid } from 'nanoid';
import dotenv from 'dotenv';
import redis from 'redis';
import { v4 } from 'uuid';

dotenv.config();

let client = redis.createClient();
let app = express();

app.use(express.static('public'));
app.use(express.json());

app.get('/:url', function(req, res){
    
    let vals = new Array();

    vals = client.hgetall(req.params.url, function(err, reply){
        console.log(reply);
        return JSON.parse(reply);
    });

    console.log(vals);
    
    res.writeHead(302, {
        'Location': vals[2]
    })
});

app.post('/url/create', function (req, res){

    let url = String;

    if(req.body.url){
        url = req.body.url;
    }

    const id = v4();
    const shortUrl = nanoid(10);

    client.hmset(shortUrl, id, url);

    res.json({
        id: id,
        url: url,
        shortUrl : process.env.APP_URL+'/'+shortUrl
    });
});

const PORT = process.env.APP_PORT;

app.listen(PORT, function (req, res){
    console.log('Server listening on PORT', PORT);
});
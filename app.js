var express = require('express'),
path = require('path'),
bodyParser = require('body-parser'),
cons = require('consolidate'),
dust = require('dustjs-helpers'),
 pg = require('pg'),
 app = express();
 myParser = require("body-parser");

var conn="postgres://amina:1234567@localhost/Questionnaire"

app.engine('express', cons.dust);
app.set('view engine', 'express');
app.set('views', __dirname +'/views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  pg.connect(conn,function(err, client, done) {
      if(err) {
            return console.error('error fetching client from pool', err);
        }

    client.query('SELECT * FROM testovi', function(err, result) {

      if(err) {
            return console.error('error running query', err);
        }
      res.render('index',{testovi: result.rows});
          done();
          });
      });
});


app.get('/questions',function(req,res){

var querpit='SELECT * FROM pitanja WHERE pitanja.testid='+req.param('testid');
pg.connect(conn,function(err, client, done) {
    if(err) {
        return console.error('error fetching client from pool', err);
      }
client.query(querpit,function(err,result){
    if(err) {
        return console.error('error fetching client from pool', err);
      }
      res.render('questions',{pitanja: result.rows});
      done();
        });
    });
});


app.get('/answers',function(req,res){

var quer='SELECT * FROM odgovori WHERE odgovori.pitanjeid='+req.param('pitanjeid');
pg.connect(conn,function(err, client, done) {
  if(err) {
      return console.error('error fetching client from pool', err);
  }
  client.query(quer,function(err,result){
    if(err) {
          return console.error('error fetching client from pool', err);
        }
    var model=result.rows;
    var brojtacnihOdgovora=0;
    for (var i = 0; i <model.length; i++) {
        if(model[i].tacan){
              brojtacnihOdgovora++;
            }
      }

      if(brojtacnihOdgovora>1){
          res.render('answerM',{odgovori:model});
}
      else if(brojtacnihOdgovora==0){
          res.render('answerT',{odgovori:model});
        }
      else {
        res.render('answers',{odgovori:model});
        }
          done();
          });
      });
});
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.post('/add',function(req,res){

var reqBody = req.body.data;
var korisnik=reqBody.korisnik;
var pitanja=reqBody.pitanja;
var korisnikid;
pg.connect(conn,function(err, client, done) {
if(err) {
    return console.error('error fetching client from pool', err);
    }
client.query('INSERT INTO public.korisnici (ime,prezime,email) VALUES($1,$2,$3) RETURNING korisnikid',
[korisnik.imeKorisnika,korisnik.prezimeKorisnika,korisnik.emailKorisnika],
            function(err, result) {
                    if (err) {
                      console.log(err);
                    }
                    else {
                             korisnikid=result.rows[0].korisnikid;
                             for (var i = 0; i < pitanja.length; i++) {
                             if (typeof pitanja[i].odgovorTekst == 'undefined') {
                                 client.query('INSERT INTO public.odgovorikorisnika (pitanjeid,odgovorid,korisnikid,tekstodgovora) VALUES($1,$2,$3,$4)',
                                   [pitanja[i].pitanjeid,pitanja[i].odgovorid,korisnikid,null],
                                                     function(err, result) {
                                                       if (err) {
                                                         console.log(err);
                                                       } else {

                                                         console.log('radi sve radii mina napravilaaa jeeeeeee! jos sad samo napravii da pitanja spremi i eto ');
                                                       }

                                                });
                                              }
                 else{
                      client.query('INSERT INTO public.odgovorikorisnika (pitanjeid,odgovorid,korisnikid,tekstodgovora) VALUES($1,$2,$3,$4)',
                       [pitanja[i].pitanjeid,pitanja[i].odgovorid,korisnikid,pitanja[i].odgovorTekst],
                                         function(err, result) {
                                           if (err) {
                                             console.log(err);
                                           } else {
                                             console.log('radi sve radii mina napravilaaa jeeeeeee! jos sad samo napravii da pitanja spremi i eto ');
                                           }
                                       });
                                     }
                                 }
                               }
          res.json({success : "Updated Successfully", status : 200});
              });
          });
    });



app.listen(3000, function () {
    console.log('Server started on port 3000');
});

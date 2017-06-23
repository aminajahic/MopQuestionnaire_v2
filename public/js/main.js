
$(document).ready(function(){
$('.get-questions').on('click',function(){

  var testid=$(this).data('testid');
  var url='/questions?testid='+testid;
  location.href=url;
    });
});

$(document).ready(function(){
$('.get-answers').on("click",function(){
var pitanjeid=$(this).data('pitanjeid');
var tipitanjaid=$(this).data('tippitanjaid');
var url='/answers?pitanjeid='+pitanjeid;
$.ajax({
  type:'GET',
  url:url,
success: function(result){
      $('#tagOdgovori_'+pitanjeid).html(result);
        }
      });
    });
});



$(document).ready(function(){
$('.odg-snimi').on("click",function(){
var odgovoriCheckbox=$("input[type='checkbox']:checked");
var odgovoriButton=$("input[type='radio']:checked");
var odgovoriTekst=$("input[tagName='odg']")
var ime=$("input[name='uname']");
var prezime=$("input[name='lname']");
var email=$("input[name='email']");
var pitanjaSva=$("h4");

var pitanja=new Array();

for (var i = 0; i <odgovoriCheckbox.length; i++) {
  pitanja.push({
        odgovorid:odgovoriCheckbox.get(i).id,
        pitanjeid:odgovoriCheckbox.get(i).name
          });
        }
for (var i = 0; i <odgovoriButton.length; i++) {
  pitanja.push({
      odgovorid:odgovoriButton.get(i).id,
      pitanjeid:odgovoriButton.get(i).name
    });
  }
for (var i = 0; i < odgovoriTekst.length; i++) {
  pitanja.push({
      odgovorid:odgovoriTekst.get(i).id,
      pitanjeid:odgovoriTekst.get(i).name,
      odgovorTekst:odgovoriTekst.get(i).value
    });
  }
var korisnik=new Object();
korisnik.imeKorisnika=ime[0].value;
korisnik.prezimeKorisnika=prezime[0].value;
korisnik.emailKorisnika=email[0].value;

var data=new Object();
data.pitanja=pitanja;
data.korisnik=korisnik;

validKorisnik=true;
if(korisnik.imeKorisnika=="" || korisnik.prezimeKorisnika=="" || korisnik.emailKorisnika=="")
{
  validKorisnik=false;
}

var validAll=true;
for (i=0;i<pitanjaSva.length;i++){
  var imaPitanje=false;
    for (j=i;i<data.pitanja.length;i++){
      if(pitanjaSva[i].id==data.pitanja[j].pitanjeid)
          imaPitanje=true;
        }
        if(!imaPitanje)
        validAll=false;
}
if(validAll==true && validKorisnik==true){
$.ajax({

type:"POST",
global:false,
url:'/add',
success : function(response) {
        alert('Uspješno ste završili test!');
          window.location='/';
 },
data: JSON.stringify({ data : data}),
   contentType:"application/json; charset=utf-8",
   dataType:"json",
 });
}
else{
    alert('Niste unijeli sve podatke');
    }
  });
});

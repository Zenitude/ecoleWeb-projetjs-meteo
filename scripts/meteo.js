let donneesAPI;
const cleAPI = "cc805b94763f12a71588c1db269528ab";
const ciel = document.querySelector('.ciel'); 
const temp = document.querySelector('.temperature');
const region = document.querySelector('.region');
const cadreLogo = document.querySelector('.meteo-logo');
const heureH = document.querySelectorAll('.heure');
const heureT = document.querySelectorAll('.temp-heure');
const jourJ = document.querySelectorAll('.jour');
const jourT = document.querySelectorAll('.temp-jour');
const ImgChargement = document.querySelector('.icone-chargement');
let jourActuel = new Date().getDay();
let jourSuivant;
let heureActuelle = new Date().getHours();

if(navigator.geolocation)
{
  navigator.geolocation.getCurrentPosition(position => 
  {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    appelAPI(latitude,longitude);
    
  },() => 
  {
    alert(`Vous avez refusé la géolocalisation, l'application ne peut pas fonctionner, veuillez l'activer !`);
  });
}

function appelAPI(lat, long)
{
  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=${cleAPI}`)
    .then(response => response.json())
    .then(data =>
    {
      donneesAPI = data;
      console.log(donneesAPI);

      meteoDuJour(donneesAPI);
      meteoHeuresSuivantes(donneesAPI);
      meteoJoursSuivants(donneesAPI, jourActuel);
    });
}

function meteoDuJour(donneesAPI)
{
  let logoMeteo = document.createElement('img');
  logoMeteo.classList.add('logo-meteo');
  cadreLogo.appendChild(logoMeteo);

  logoMeteo.setAttribute('src', '');
  // logoMeteo.setAttribute('alt', 'logo meteo du jour');
      
  if(heureActuelle >= 8 && heureActuelle <= 23)
  {
    logoMeteo.setAttribute('src', `ressources/logoMeteo/${donneesAPI.current.weather[0].icon}.svg`);
  }
  else
  {
    logoMeteo.setAttribute('src', `ressources/logoMeteo/${donneesAPI.current.weather[0].icon}.svg`);
  }
  
  ciel.innerText = `${donneesAPI.current.weather[0].description}`;
  temp.innerText = `${Math.trunc(donneesAPI.current.temp)}°`;
  region.innerText = `${donneesAPI.timezone}`;
  ImgChargement.classList.add('disparition');

}

function meteoHeuresSuivantes(donneesAPI)
{
  let heureActuelle = new Date().getHours();

  /* Heures H*/
  for(let h = 0; h < heureH.length; h++)
  {
    let heurePlus3 = heureActuelle + h*3;

    if(heurePlus3 > 24)
    {
      heureH[h].innerText = `${heurePlus3 - 24} h`;
    }
    else if(heurePlus3 === 24)
    {
      heureH[h].innerText = `00 h`;
    }
    else
    {
      heureH[h].innerText = `${heurePlus3} h`;
    }

    /* Heures Températures */
    heureT[h].innerText = `${Math.trunc(donneesAPI.hourly[h * 3].temp)}°`;
  }
}

function jourQuiSuit(jourSuivant)
{
  switch(jourSuivant)
      {
        case 0 :
          jourSuivant = 'dimanche';
        break;

        case 1 :
          jourSuivant = 'lundi';
        break;

        case 2 :
          jourSuivant = 'mardi';
        break;

        case 3 :
          jourSuivant = 'mercredi';
        break;

        case 4 :
          jourSuivant = 'jeudi';
        break;

        case 5 :
          jourSuivant = 'vendredi';
        break;

        case 6 :
          jourSuivant = 'samedi';
        break;

        default:
          jourSuivant = `???`;
      }
  return jourSuivant;
}

function meteoJoursSuivants(donneesAPI)
{
  for(let j = 0; j < jourJ.length; j++)
  {
    jourSuivant = jourActuel + (j+1); 

    if(jourSuivant >= 7)
    {
      jourSuivant -= 7;
        
      jourJ[j].innerText = `${jourQuiSuit(jourSuivant)}`;
      jourT[j].innerText = `${Math.trunc(donneesAPI.daily[jourSuivant].temp.day)}°`;
    }
    else
    {    
      jourJ[j].innerText = `${jourQuiSuit(jourSuivant)}`;
      jourT[j].innerText = `${Math.trunc(donneesAPI.daily[jourSuivant].temp.day)}°`;
    }
  }
}
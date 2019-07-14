const csv = require('csvtojson')
const fetch = require("node-fetch")

csv().fromFile('../csv/property.csv')
.then((jsonObj)=>{
  geolocate(jsonObj)

})

function sleep(ms){
  return new Promise(resolve=>{
    setTimeout(resolve,ms)
  })
}

async function geolocate(json) {
  for(let i = 0; i<json.length; i++ ) {
    let raw_geo_data = await fetch("https://nominatim.openstreetmap.org/search?q=" + json[i].place + "&format=json")
    let geo_data = await raw_geo_data.text()
    let geo_json = JSON.parse(geo_data)

    if(geo_json[0] != undefined) {
      console.log(json[i].place + ", " + json[i].quantity + ", " + geo_json[0].lat + ", " + geo_json[0].lon)
    }
    else {
      console.log(json[i].place + ", " + json[i].quantity + ", " + "null" + ", " + "null")
    }

    await sleep(1000)
  }
}

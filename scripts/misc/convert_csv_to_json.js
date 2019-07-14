const csv = require('csvtojson')
const fetch = require("node-fetch")
const fs = require("fs")

csv().fromFile('../csv/property.csv')
.then((jsonObj)=>{

  fs.writeFile("../../view/js/charts/data/properties.json", JSON.stringify(jsonObj), (err) => {
    if (err) console.log(err);
    console.log("Successfully Written to File.")
  });

})

const axios = require('axios');
const express = require('express');
const cors = require('cors')
const app = express();
app.use(cors({
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));
app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
      next();
});

let clothing ={
    accessories:['sunglasses', 'umbrella'],
    outterwear:['wind breaker', 'sweater', 'rain coat'],
    top:['t-shirt','long-sleeve','tanktop'],
    pants:['shorts', 'pants'],
    shoes:['sandles','sneakers']
}
let weatherData = {}
let urlData = []

app.get('/weather/getWeather', (req, res) => {
    getWeatherByCity(req.headers.city).then(function(){
        let weather = {
            description: weatherData.weather[0].description,
            temp: weatherData.main.temp,
            wind: weatherData.wind.speed
        }
        res.send(weather)
    })
});

app.get('/attire/getRecommendedAttire', (req, res) => {
    res.send(recommendOutfit(req.headers.temp, req.headers.description))
});

app.get('/purchase/getPurchasableItem', (req, res)=> {
    searchByClothingType(req.headers.clothingitem).then(function(){
        res.send(urlData)
    })
})

app.get('/clear', (req, res)=>{
    console.log('clearing server data')
    weather = {}
    urlData = []
})


// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

async function getWeatherByCity(city){
    var apiKey = 'f09a7f99e8f4c7d0749c934661732d8e'
    try{
        await axios.get('https://api.openweathermap.org/data/2.5/weather?q='+city+'&units=imperial&appid='+apiKey).then(result =>{
            weatherData = result.data
        })
    } catch (error){
        console.error(error);
    }
}

function recommendOutfit(temp, description){
    console.log(temp)
    console.log(description)
    let outfit = []
    if(description.includes('rain') || description.includes('mist') || description.includes('drizzle')){
        outfit.push(clothing.accessories[1])
        outfit.push(clothing.outterwear[2])
    }else if(description.includes('sun')){
        outfit.push(clothing.accessories[0])
    }else if(description.includes('wind')){
        outfit.push(clothing.outterwear[0])
    }

    if(temp > 90){
        outfit.push(clothing.top[2])
        outfit.push(clothing.pants[0])
        outfit.push(clothing.shoes[0])
    } else if((temp < 90) && (temp >= 80)){
        outfit.push(clothing.top[0])
        outfit.push(clothing.pants[0])
        outfit.push(clothing.shoes[0])
    } else if((temp <= 80) && (temp >= 60)){
        outfit.push(clothing.top[0])
        outfit.push(clothing.pants[1])
        outfit.push(clothing.shoes[1])
    } else if((temp < 60) && (temp >= 40)){
        outfit.push(clothing.top[1])
        outfit.push(clothing.pants[1])
        outfit.push(clothing.shoes[1])
        outfit.push(clothing.outterwear[1])
    } else if(temp < 40){
        outfit.push(clothing.top[1])
        outfit.push(clothing.pants[1])
        outfit.push(clothing.shoes[1])
        outfit.push(clothing.outterwear[1])
    }

    outfit.forEach(item =>{
        console.log(item)
    })

    return outfit
}

async function searchByClothingType(clothingItem){
    console.log(clothingItem)
    var token = 'v^1.1#i^1#f^0#r^0#p^1#I^3#t^H4sIAAAAAAAAAOVYa2wUVRTu9mWxVCQQMEhkHTABy8zemd3Zx9DduH0gW/rCbcsjgXUed9uhszPTuXdsl0go1VSFqCgxMWLkYaIQfkg0MRAeEhNiwg8TRRMiNGiMCWKq4Ye8DMQ7u6VsK4GWrrGJ+2M2995zzj3fd8859wH6Sqc9PbBi4GqF66HCPX2gr9DlYsvBtNKSykeKCueVFIAcAdeevkV9xf1FF6uQmNJM4TmITENH0N2b0nQkZDrDlG3pgiEiFQm6mIJIwLIQjzY2CBwDBNMysCEbGuWO1YYpGbJB0S8nIZS8fJL1kV79ts1WI0xxPPD5/AEWAMCGQNIZR8iGMR1hUcdkHHAcDXw0F2gFXoHzCVyA8QXYdZS7HVpINXQiwgAqknFXyOhaOb7e21URIWhhYoSKxKLL483RWG1dU2uVJ8dWZJiHOBaxjUa3agwFuttFzYb3ngZlpIW4LcsQIcoTyc4w2qgQve3MA7ifoZqXZL9P9gYB5IDEA5AXKpcbVkrE9/bD6VEVOpkRFaCOVZy+H6OEDWkjlPFwq4mYiNW6nb9VtqipSRVaYaquOro22tJCReoN1GmLcZnugSLuhJZIx6vX0AEuxPFSyA9ohZc5CYa8wxNlrQ3TPGamGkNXVIc05G4ycDUkXsOx3LA53BChZr3Ziiax41GuHH+bQz+/zlnU7CrauFN31hWmCBHuTPP+KzCijbGlSjaGIxbGDmQoClOiaaoKNXYwE4vD4dOLwlQnxqbg8fT09DA9XsawOjwcSTPPmsaGuNwJUyJFZJ1cz8qr91eg1QwUGRJNpAo4bRJfekmsEgf0DiriDfoDPnaY99FuRcb2/qMjB7NndEbkK0N8STnk52SJDya5EPnkI0Miw0HqcfyAkpimU6LVBbGpiTKkZRJndgpaqiKQ8sd5g0lIK/5QkvaFkkla4hU/zZLaCEh5lORQ8P+UKOMN9TiULYjzEut5i/NYdxfP1tdIK7vV7oYVm9r4tat99Z2xXrEjWqcaDeyzgUBlS0P7qqBvVXi82XBX8DWaSphpJfPngwAn1/NHwgoDYahMCl5cNkzYYmiqnJ5aC+y1lBbRwulqO03acahp5G9SUKOmGctPxc4byAkWiwfDnb+d6j/ape6KCjmBO7VQOfqIGBBNlSH7kJPraUY2Uh5DJIcQpzuR8do9RvCuQh7JTjMdNkSYeKKQc+C4lVRSzBmypSnjV8lumATE+FXIJUOxZfxAE2V2ZoawqXZ0YjShOXsnQ4pka12TCjqVXB6mVMgRuFncqpI99TMZ8Ax6QWYsiAzbIhceptk5BLcaXVAnRwpsGZoGrfbJpZ9TTFMpG4uSBqdaVc1DdVHFiZ13ivtdp/91XKyfZwEXIugmhU3OnGgSU21PyPdeOIG7jWf0S0ukIPNj+13HQb/rSKHLBQKAZivBktKituKi6RQi1YRBoq5IRi+jikmGFDJdxLYFmS6YNkXVKix1qT98J1/LeePZsx48NvLKM62ILc958gHz74yUsDPmVnAc8HEB4OXIdx1YeGe0mJ1TPHvpksTWl7fNfPLCJ4OHvp6/6Y2zxuUEqBgRcrlKCkhAFjy/+9zRZz765sqyxNX9XbcqjiemFy8uvnX+8JDPPXjgVXwkUHn9522bb85a2nbJv5LZuuGpmWXN7VcrriHrK+vE26d+u3Lhxr6P975+6vrZ7l/nWG99O6+i4o8djdUtaumh5NwnTi84Xrb64hfWn8oHhf0Lmwp2H7hSVvPTpkDZjRfLCx6/VJ7wRFeePHPwpv7o7581f/7OXtRe/V7L++bBE8GdmxcPzezvWr2Aqi7ys19q4fo3b74262HL9cqZ7Rt/NJMbQv1S6t0dbXX1bbVDzMktL+096933/dFd6vb9H/L8p5f/OnUiVpKefW5w18DpncsaF7VumTc4YPkOW+urZpw/VH6stOqXoW3H9rdll/Fv+eknqH0TAAA='
    try{
        const response = await axios.get('https://api.sandbox.ebay.com/buy/browse/v1/item_summary/search?q='+clothingItem+'&access_token=', {
            headers: {
                Authorization: 'Bearer ' + token
            }
           }).then(results =>{
               console.log(results.data.itemSummaries[0].itemWebUrl)
               urlData.push({clothing:clothingItem, url: results.data.itemSummaries[0].itemWebUrl})
               
           })
    } catch (error){
        console.error(error);
    }
}
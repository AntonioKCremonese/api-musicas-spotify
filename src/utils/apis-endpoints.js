module.exports = {
    apiWeather:{
        url:'http://api.openweathermap.org/data/2.5/weather',
        APPID:'8737ccee146a116f4c5ba63de1e7dcb2'
    },
    apiTokenSpotify:{
        url:'https://accounts.spotify.com/api/token',
        grant_type:'client_credentials',
        client_id:'96070e91703e49f6a929a579929da871',
        client_secret:'e557657d66704017a6b0ded58ea324ee'
    },
    apiSeachPlaylist:{
        url:'https://api.spotify.com/v1/search',
        type:'playlist'
    }
}
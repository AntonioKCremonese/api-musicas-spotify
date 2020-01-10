const api = require('../utils/apis-endpoints');
const axios = require('axios');
const qs = require('qs');
const convertTemp = require('../utils/kelvinToCelsius');
const getEstilos = require('../utils/retornaEstilosMusicais');

class AppController {

    async index(req, res) {

        const params = {
            q: req.query.city,
            APPID: api.apiWeather.APPID
        }

        // Chama Api weather para obter temperatura local.
        const response = await axios.get(api.apiWeather.url, { params });
        const { temp } = response.data.main;

        if (!temp) {
            res.json({ error: 'Não foi possivel retornar dados de temperatura' });
        }

        // Converte temperatura de Kelvin para Celsius
        const tempConverted = Math.round(convertTemp.convertKelvinToCelsius(temp));

        // Retorna o estilo musical conforme a temperatura
        const estiloMusical = getEstilos.retornaEstilosMusicais(tempConverted);

        const objeto = {
            temperatura: tempConverted,
            estilo: estiloMusical
        }
        // Transforma as credenciais do spotify em buffer para enviar no header da api.
        const credentialsEncoded = Buffer.from(`${api.apiTokenSpotify.client_id}:${api.apiTokenSpotify.client_secret}`).toString('base64');

        // Chama Endpoint do Spotify para obter um Token válido 
        const postOptions = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Basic ' + credentialsEncoded },
            data: qs.stringify({ 'grant_type': api.apiTokenSpotify.grant_type }),
            url: api.apiTokenSpotify.url,
        };

        const token = await axios(postOptions);
        const { access_token } = token.data;

        if (!access_token) {
            return res.json({ error: 'Token not provided' })
        }

        // Chama Endpoint do Spotify para retornar playlist conforme genero
        const getOptions = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + access_token },
            params: {
                q: estiloMusical,
                type: api.apiSeachPlaylist.type
            },
            url: api.apiSeachPlaylist.url
        }
        const playlist = await axios(getOptions);

        res.json(playlist.data);
    }



}

module.exports = new AppController();
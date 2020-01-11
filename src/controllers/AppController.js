const api = require('../utils/apis-endpoints');
const axios = require('axios');
const qs = require('qs');
const convertTemp = require('../utils/kelvinToCelsius');
const getEstilos = require('../utils/retornaEstilosMusicais');

class AppController {

    async index(req, res) {


        if (!req.query.cidade) {
            return res.status(400).json({ error: 'Query Parameter cidade está faltando' })
        }

        const params = {
            q: req.query.cidade,
            APPID: api.apiWeather.APPID
        }

        // Chama Api weather para obter temperatura local.
        const retornoApiTemp = await axios.get(api.apiWeather.url, { params }).catch(err => {
            return err;
        })

        if (!retornoApiTemp.status) {
            return res.status(404).json({ error: 'Cidade não encontrada' });
        }
        const { temp } = retornoApiTemp.data.main;

        // Converte temperatura de Kelvin para Celsius
        const tempConverted = Math.round(convertTemp.convertKelvinToCelsius(temp));

        // Retorna o estilo musical conforme a temperatura
        const estiloMusical = getEstilos.retornaEstilosMusicais(tempConverted);

        // Transforma as credenciais do spotify em buffer para enviar no header da api.
        const credentialsEncoded = Buffer.from(`${api.apiTokenSpotify.client_id}:${api.apiTokenSpotify.client_secret}`).toString('base64');

        // Chama Endpoint do Spotify para obter um Token válido 
        const tokenRequest = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Basic ' + credentialsEncoded },
            data: qs.stringify({ 'grant_type': api.apiTokenSpotify.grant_type }),
            url: api.apiTokenSpotify.url,
        };

        const retornoApiTokenRequest = await axios(tokenRequest).catch(err => {
            return err;
        });

        if (!retornoApiTokenRequest.status) {
            return res.status(400).json({ error: 'Não foi possivel retornar token para autenticação' });
        }
        const { access_token } = retornoApiTokenRequest.data;

        // Chama Endpoint do Spotify para retornar playlist conforme genero
        const playlistRequest = {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + access_token },
            params: {
                q: estiloMusical,
                type: api.apiSearchPlaylist.type,
                limit: 1
            },
            url: api.apiSearchPlaylist.url
        }
        const retornoApiPlaylist = await axios(playlistRequest).catch(err => {
            return err;
        });

        if (!retornoApiPlaylist.status) {
            return res.status(404).json({ error: 'Não foi encontrada nenhuma playlist' });
        }
        // Trata retorno da api trazendo somente descricao, nome e link da playlist
        const resposta = retornoApiPlaylist.data.playlists.items.map(playlist => {
            return {
                descricao: playlist.description,
                nome: playlist.name,
                playlist: playlist.external_urls.spotify,
                temperatura: tempConverted + '°C',
                estilo: estiloMusical
            }

        })
        res.json(resposta[0]);
    }
}

module.exports = new AppController();
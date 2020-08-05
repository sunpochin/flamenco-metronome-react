import axios from 'axios';

const serverapi = axios.create({
    baseURL: 'https://flamenco-metronome-js.firebaseio.com/'
});

const postCompas = datas => serverapi.put('compas.json', datas)
    .then(res => {
        console.log('axios res.data: ', res);
        if (200 === res.status) {
            const wording = 'Successfully save a compas table of ' 
                + datas.length + ' compases to server.';
            alert(wording);
        }
    })
    .catch((error) => { console.error(error) });


const getCompas = () => serverapi.get('compas.json' )
    .then(res => {
        console.log('axios res.data: ', res);
        if (200 === res.status) {
            const wording = 'Got a compas table of ' + res;
            return res;
        }
    })
    .catch((error) => { console.error(error) });

//export default instance;
export {serverapi, postCompas, getCompas};
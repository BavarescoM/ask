const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const connection = require('./database/database');
const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta');
//banco
connection.authenticate().then(() => {
    console.log('conexão feita com o banco de dados')
}).catch(error => {
    console.log('erro ao conectar' + error)
})

app.set("view engine", "ejs") //usar ejs
app.use(express.static('public')) //acessar pasta public e permitir usa o bootrap

app.use(bodyParser.urlencoded({ extended: false })) //pegar o corpo do html
app.use(bodyParser.json());

app.get('/', (req, res) => {
    Pergunta.findAll({ raw: true, order: [['id', 'DESC']] }).then((perguntas) => {
        console.log(perguntas);
        res.render('index', { perguntas })
    });

})

app.get('/perguntar', (req, res) => {
    res.render('perguntar');
})

app.post('/salvarpergunta', (req, res) => {

    var titulo = req.body.titulo;
    var descricao = req.body.descricao
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect('/');
    }).catch(error => {
        console.log('erro ao salvar')
    })


})

app.get('/pergunta/:id', (req, res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where: { id: id }
    }).then((pergunta) => {
        if (pergunta != undefined) {
            Resposta.findAll({ where: { perguntaid: pergunta.id }, order: [['id', 'DESC']] }).then((respostas) => {
                res.render('pergunta', { pergunta, respostas });
            })
        } else {
            res.redirect('/');
        }
    })
})

app.post('/responder', (req, res) => {
    var corpo = req.body.corpo;
    var perguntaid = req.body.pergunta;

    Resposta.create({
        corpo: corpo,
        perguntaid: perguntaid
    }).then(() => {
        res.redirect('/pergunta/' + perguntaid)
    })

})
app.listen(8080, () => { console.log('App Rodando!') })
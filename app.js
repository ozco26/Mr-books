const express =require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const { save } = require('./controllers/controller.js');

const upload = multer({dest: 'uploads/'})

app.post('/images/single', upload.single('imagen'), (req,res)=>{
saveImage(req.file);

});
app.post('/submit-review', (req, res) => {
    save
});



app.set('view engine','ejs');
app.use(express.urlencoded({extended:false}));
app.use(express(JSON));



app.use('/',require('./router.js'));

app.use(express.static('public'));
/* 
*****************************************************************************************************
---- liberar hasta que el proyecto se termine para poder ver mensajes de error!!!!!!!!!!!!! ------
*****************************************************************************************************
app.use((req, res) => {
    res.status(404).render('pagNoEncontrada');
});
*/
app.listen(5000,()=>
    console.log('SERVER corriendo en http://localhost:5000')
)


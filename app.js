const express =require('express');
const app = express();
const path = require('path');

app.set('view engine','ejs');
app.use(express.urlencoded({extended:false}));
app.use(express(JSON));

app.use('/',require('./router.js'));

app.use(express.static('public'));

app.listen(5000,()=>
    console.log('SERVER corriendo en http://localhost:5000')
)
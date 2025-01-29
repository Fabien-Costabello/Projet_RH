const express = require('express')

const entrepriseRouter = require('./router/entrepriseRouter')
const userRouter = require('./router/userRouter')
const computerRouter = require('./router/computerRouter')
const session = require('express-session')





const app = express()
app.use(express.static('./public'))
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret:'mozzarela',
    resave: true,
    saveUninitialized:true
}))
app.use(computerRouter)
app.use(entrepriseRouter)
app.use(userRouter)


app.listen(3000,()=>{
    console.log("Ecoute sur le port 3000");
    
})
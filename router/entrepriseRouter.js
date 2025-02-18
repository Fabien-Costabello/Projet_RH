const {PrismaClient} = require('@prisma/client')
const bcrypt = require('bcrypt')
const hashPasswordExtension = require("../services/extensions/hashPasswordExtension");
const entrepriseRouter = require ('express').Router()
const prisma = new PrismaClient().$extends(hashPasswordExtension)


entrepriseRouter.get("/getstarted", (req, res) => {
    res.render("./pages/getStarted.html.twig", { title: "Inscription" });
  });

//Accès page inscription
  entrepriseRouter.get("/subscribe", (req, res) => {
    res.render("./pages/subscribe.html.twig", { title: "Inscription" });
  });

  //Inscription 
  entrepriseRouter.post("/subscribe", async (req, res) => {
    try {
      const {raisonSociale,siret,email,password,cpassword,lastName} = req.body
      if (password !== cpassword){
        throw{confirmPassword : "Les mots de passes doivent être identique"}
      } else{
        const user = await prisma.entreprise.create({
          data:{
            raisonSociale:raisonSociale,
            siret: parseInt(siret),
            lastName:lastName,
            email:email,
            password:password
          }
        })

        const entreprise = await prisma.entreprise.findUnique({
          where: { siret: parseInt (siret)}
        })
        req.session.entreprise = entreprise;
        res.render("./pages/index.html.twig", { title: "Inscription" });
      }
    } catch (error) {
      console.log(error);
      
      if(error.code ==="P2002"){
        error ={mail : "Cette adresse mail est déjà utilisé"}
      }
      res.render("./pages/index.html.twig", { title: "Inscription",error });
    }
  });



//Accès page login
  entrepriseRouter.get("/login", (req, res) => {
    res.render("./pages/login.html.twig", { title: "Login" });
  });


  //Connexion 
  entrepriseRouter.post("/login",async (req, res) => {
    try {
      const entreprise = await prisma.entreprise.findUnique({
        where: {
          siret: parseInt (req.body.siret),
        },
      });
 
     
      if (entreprise) {
        if (await bcrypt.compare(req.body.password, entreprise.password)) {
          req.session.entreprise = entreprise;
          res.redirect("/");
        } else throw { password: "Mot de passe incorect" };
      } else throw { siret: "Siret incorrect" };
    } catch (error) {
      console.log(error);
      res.render("./pages/login.html.twig", { title: "Login" });
    }
  });



  //Accès index
  entrepriseRouter.get("/", async (req, res) => {
    try {
      const entreprise = await prisma.entreprise.findUnique({
        where: {
          siret: req.session.entreprise.siret,
        },
        include: {
          employes: {
            include: {
              ordinateur: true, 
            },
          },
        },
      });
  
 
      console.log(entreprise); 
    
  
      res.render("pages/index.html.twig", {
        title: "Accueil",
        entreprise: req.session.entreprise,
        employes: entreprise.employes, 
      });
    } catch (error) {
      console.error("Erreur lors de la récupération de l'entreprise :", error);
      res.status(500).send("Erreur interne du serveur");
    }
  });
  


  //deconnexion admin

  entrepriseRouter.get("/logOut", (req, res) => {
    req.session.destroy();
    res.render("pages/login.html.twig");
  });
  

module.exports = entrepriseRouter
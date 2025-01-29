const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const hashPasswordExtension = require("../services/extensions/hashPasswordExtension");
const entrepriseRouter = require("./entrepriseRouter");
const userRouter = require("express").Router();
const prisma = new PrismaClient().$extends(hashPasswordExtension);

//Suppression utilisateur
userRouter.get("/deleteUser/:id", async (req, res) => {
  try {
    const deleteUser = await prisma.employe.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.redirect("/");
  } catch (error) {
    console.log(error);

    res.render("./pages/index.html.twig");
  }
});

//Ajouter utilisateur
userRouter.post("/addUser", async (req, res) => {
  console.log(req.body);
  try {
    const { firstName, lastName, mail, age, Genre, password } = req.body;
    const employe = await prisma.employe.create({
      data: {
        firstName,
        lastName,
        mail,
        age: parseInt(age),
        Genre,
        password,
        entrepriseId: req.session.entreprise.siret,
      },
    });
    sendWelcomeEmail(mail, firstName);
    res.redirect("/");
  } catch (error) {
    console.log(error);

    res.render("./pages/index.html.twig");
  }
});

//Afficher champ modification
userRouter.get("/modifyUser/:id", async (req, res) => {
  const user = await prisma.employe.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  const entreprise = await prisma.entreprise.findUnique({
    where: {
      siret: req.session.entreprise.siret, // Utilisation du siret de la session pour rechercher l'entreprise
    },
    include: {
      employes: {
        include: {
          ordinateur: true, // Inclure l'ordinateur associé à chaque employé
        },
      },
    },
  });
  try {
    console.log(user);

    res.render("pages/index.html.twig", {
      
      employe: await prisma.employe.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      }),
      user,
      employes: entreprise.employes,
    });
  } catch (error) {
    res.render("/pages/index.html.twig", {
      
      user: await prisma.employe.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      }),
      user,
      error,
    });
  }
});

////Modifier user
userRouter.post("/modifyUser/:id", async (req, res) => {
  try {
    const user = await prisma.employe.update({
      where: { id: parseInt(req.params.id) },
      data:{
       lastName: req.body.lastName, 
       firstName: req.body.firstName, 
       mail: req.body.mail, 
       age : parseInt( req.body.age), 
       Genre: req.body.Genre, 
       
      
      
      
      }
    });
    console.log(req.body);

    res.redirect("/");
  } catch (error) {
    console.log(error);

    res.render("pages/index.html.twig", {
      entreprise: await prisma.entreprise.findUnique({
        where: { siret: req.session.entreprise.siret },
      }),
        error,
    });
  }
});

////Annuler modificaiton

userRouter.get("/cancelEditUser", (req, res) => {
  try {
    res.redirect("/");
  } catch (error) {
    console.log(error);

    res.render("./pages/index.html.twig");
  }
});









//////////////////////////////////////////Envoi Mail////////////////////////////////////////////

const nodemailer = require('nodemailer');

// Créer un transporteur pour envoyer les emails
const transporter = nodemailer.createTransport({
  service: 'gmail', // Exemple avec Gmail
  auth: {
    user: 'costabellobis@gmail.com', // Ton email
    pass: 'croustille19' // Ton mot de passe (ou un mot de passe d'application si tu utilises Gmail)
  }
});

// Fonction pour envoyer l'email
const sendWelcomeEmail = (userEmail, userName) => {
  const mailOptions = {
    from: 'costabellobis@gmail.com', // L'email de l'expéditeur
    to: userEmail, // L'email du destinataire
    subject: 'Bienvenue sur notre site', // Sujet de l'email
    text: `Bonjour ${userName},\n\nBienvenue sur notre plateforme ! Nous sommes heureux de vous compter parmi nous.\n\nCordialement,\nL'équipe.` // Corps de l'email
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Erreur lors de l\'envoi de l\'email: ', error);
    } else {
      console.log('Email envoyé: ' + info.response);
    }
  });
};








module.exports = userRouter;

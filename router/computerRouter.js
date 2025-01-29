const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const hashPasswordExtension = require("../services/extensions/hashPasswordExtension");

const computerRouter = require("express").Router();
const prisma = new PrismaClient().$extends(hashPasswordExtension);

computerRouter.get("/computersList", async (req, res) => {
  const entreprise = await prisma.entreprise.findUnique({
    where: {
      siret: req.session.entreprise.siret,
    },
    include: {
      ordinateurs: {
        include: {
          employe: true,
        },
      },
    },
  });

  console.log(entreprise.ordinateurs);

  res.render("pages/computers.html.twig", {
    title: "Accueil",
    entreprise: req.session.entreprise,
    ordinateurs: entreprise.ordinateurs,
  });
});

//Afficher champ modif
computerRouter.get("/modifyComputer/:id", async (req, res) => {
  const mComputer = await prisma.ordinateur.findFirst({
    where: { id: parseInt(req.params.id) },
  });
  const employeesWithoutComputers = await prisma.employe.findMany({
    where: {
      ordinateurID: null, // Filtre pour les employés sans ordinateur associé
    },
    include: {
      entreprise: true, // Inclure des informations sur l'entreprise si nécessaire
    },
  });

  const entreprise = await prisma.entreprise.findUnique({
    where: { siret: req.session.entreprise.siret },
    include: {
      ordinateurs: {
include : 
        {employe: true,}
      }
    },
  });

  
  try {
    console.log(employeesWithoutComputers);

    res.render("pages/computers.html.twig", {
      title: "Modifier un ordinateur",
      employe: await prisma.employe.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      }),
      mComputer,
      ordinateurs: entreprise.ordinateurs,
      employes: entreprise.employes,
      listEmploye: employeesWithoutComputers,
    });
  } catch (error) {
    res.render("/pages/computers.html.twig", {
      title: "Modifier un ordinateur",
      user: await prisma.employe.findUnique({
        where: {
          id: parseInt(req.params.id),
        },
      }),
      entreprise,
      error,
    });
  }
});

//Valider modif ordi

computerRouter.post("/modifyComputer/:id", async (req, res) => {
  const { freeUsers, Working } = req.body;

  try {
    // Trouver l'employé correspondant au nom de famille donné dans le formulaire
    const employe = await prisma.employe.findFirst({
      where: { lastName: freeUsers },
    });

    if (!employe) {
      throw new Error("Aucun employé trouvé avec ce nom de famille");
    }

    // Mettre à jour l'ordinateur avec l'employé sélectionné et son état
    const ordinateur = await prisma.ordinateur.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        Working: Working === "on", 
        employe: {
          connect: { id: employe.id }, 
        },
      },
    });

    await prisma.ordinateur.update({
      where: {
        id: parseInt(req.params.id), 
      },
      data: {
        employeId: employe.id, 
      },
    });

    console.log("Ordinateur mis à jour :", ordinateur);
    res.redirect("/computersList");
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);

    res.render("pages/computers.html.twig", {
      entreprise: await prisma.entreprise.findUnique({
        where: { siret: req.session.entreprise.siret },
      }),
      error: "Erreur lors de la mise à jour de l'ordinateur",
    });
  }
});

//dissocier l'ordinateur de l'employé
computerRouter.post("/retirerUser/:id", async (req, res) => {
  try {
   
    const ordinateurId = parseInt(req.params.id);

    const ordinateur = await prisma.ordinateur.findUnique({
      where: { id: ordinateurId },
      include: { employe: true } 
    });

    if (ordinateur && ordinateur.employe) {

      await prisma.employe.update({
        where: {
          id: ordinateur.employe.id, 
        },
        data: {
          ordinateurID: null, 
        },
      });

     
      await prisma.ordinateur.update({
        where: {
          id: ordinateurId, 
        },
        data: {
          employeId: null, 
        },
      });
    }

    res.redirect("/computersList");
  } catch (error) {
    console.error(error);
    res.render("pages/computers.html.twig", {
      error,
      entreprise: await prisma.entreprise.findUnique({
        where: { siret: req.session.entreprise.siret },
      }),
    });
  }
});

///Ajout ordinateur
computerRouter.post("/addComputer", async (req, res) => {

  try {

    const ordi = await prisma.ordinateur.create({
      data: {
       macAdress:  req.body.macAdress,
        entrepriseId: req.session.entreprise.siret,
      },
    });
    res.redirect("/computersList");
  } catch (error) {
    console.log(error);

    res.render("./pages/index.html.twig");
  }
});




//Delete computer

computerRouter.get("/deleteComputer/:id", async (req, res) => {
  try {
    const deleteComputer = await prisma.ordinateur.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.redirect("/computersList");
  } catch (error) {
    console.log(error);

    res.render("./pages/index.html.twig");
  }
});

module.exports = computerRouter;

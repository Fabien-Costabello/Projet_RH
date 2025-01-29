const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const hashPasswordExtension = require("../services/extensions/hashPasswordExtension");
const entrepriseRouter = require("./entrepriseRouter");
const userRouter = require("express").Router();
const prisma = new PrismaClient().$extends(hashPasswordExtension);
const multer = require("multer");
const path = require("path");

// Définir le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets/img"); // Dossier où stocker les images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Nom unique pour éviter les conflits
  },
});

const upload = multer({ storage: storage });

/////// Uploader avatar

userRouter.post("/upload-avatar", upload.single("avatar"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Aucun fichier envoyé." });
  }

  try {
    await prisma.employe.update({
      where: { id: req.session.user.id },
      data: { avatar: `/assets/img/${req.file.filename}` },
    });

    res.json({
      message: "Avatar mis à jour",
      avatar: `/assets/img/${req.file.filename}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

////Supprimer un avatar
const fs = require("fs"); // Pour gérer les fichiers

userRouter.get("/delete-avatar", async (req, res) => {
  try {
    const user = await prisma.employe.findUnique({
      where: { id: req.session.user.id },
    });

    if (!user || !user.avatar) {
      return res.status(404).json({ message: "Aucun avatar trouvé" });
    }

    const avatarPath = path.join(__dirname, "../public", user.avatar);

    if (fs.existsSync(avatarPath)) {
      fs.unlinkSync(avatarPath);
    }

    await prisma.employe.update({
      where: { id: req.session.user.id },
      data: { avatar: "/assets/img/default.png" },
    });

    const Muser = await prisma.employe.findUnique({
      where: { id: req.session.user.id },
    });
    console.log(Muser);

    res.render("./pages/userProfile.html.twig", { user: Muser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

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
      siret: req.session.entreprise.siret,
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
      data: {
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        mail: req.body.mail,
        age: parseInt(req.body.age),
        Genre: req.body.Genre,
      },
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

///Accès page login

userRouter.get("/loginUser", (req, res) => {
  res.render("./pages/loginUser.html.twig", { title: "Login" });
});

//////Connexion profil perso

userRouter.post("/loginUser", async (req, res) => {
  try {
    const user = await prisma.employe.findUnique({
      where: {
        mail: req.body.mail,
      },include :{
        ordinateur : true
      }
    });
    const events = await prisma.event.findMany();

    if (user) {
      if (await bcrypt.compare(req.body.password, user.password)) {
        req.session.user = user;
        res.render("./pages/userProfile.html.twig", { user, events });
      } else throw { password: "Mot de passe incorect" };
    } else throw { mail: "Mail incorrect" };
  } catch (error) {
    console.log(error);
    res.render("./pages/login.html.twig", { title: "Login" });
  }
});

//////////////////////////////////////////Envoi Mail////////////////////////////////////////////






//Moodifier profil

userRouter.post("/modifyProfil/:id", async (req, res) => {
  try {
    const user = await prisma.employe.update({
      where: { id: parseInt(req.params.id) },
      data: {
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        mail: req.body.mail,
        age: parseInt(req.body.age),
        Genre: req.body.Genre,
      },
    });
console.log(req.body);

const ordinateur = await prisma.ordinateur.update({
  where: {
    id: parseInt(user.ordinateurID),
  },
  data: {
    Working: req.body.Working === "on",
    employe: {
      connect: { id: user.id },
    },
  },
});

    const mUser = await prisma.employe.findUnique({
      where: {
        mail: req.body.mail,
      },include :{
        ordinateur : true
      }
    });
    console.log(req.body);

    res.render('pages/userProfile.html.twig',{user:mUser})
  } catch (error) {
    console.log(error);

    res.render("pages/userProfile.html.twig", {
      entreprise: await prisma.entreprise.findUnique({
        where: { siret: req.session.entreprise.siret },
      }),
      error,
    });
  }
});

module.exports = userRouter;

const sgMail = require('@sendgrid/mail')sgMail.setApiKey(process.env.SENDGRID_API_KEY)const msg = {  to: mail,  // Destinataire  from: 'costabellofabien@gmail.com',  // Expéditeur vérifié  subject: 'Connexion à votre profil personnel',  text: `Cliquez sur le lien pour vous connecter : http://localhost:3000/loginUserVotre adresse email : ${mail}Votre mot de passe : ${password}`,  html: `<p>
	<strong>
		<a href="http://localhost:3000/loginUser">Cliquez ici pour vous connecter</a>
	</strong>
</p>
<p>
	<strong>Vos identifiants :</strong>
</p>
<p>Email : ${mail}</p>
<p>Mot de passe : ${password}</p>`,}sgMail  .send(msg)  .then(() => {    console.log('Email sent')  })  .catch((error) => {    console.error(error)  })

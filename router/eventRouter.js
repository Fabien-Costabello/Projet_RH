const eventRouter = require("express").Router();
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()




// Récupérer tous les événements
eventRouter.get('/events', async (req, res) => {
    try {
        const events = await prisma.event.findMany();
        res.render('pages/events.html.twig',{events : events})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Ajouter un événement
eventRouter.post('/events', async (req, res) => {
    try {
        
        
        const { title, start, end, allDay } = req.body;
       
        
        const event = await prisma.event.create({
            data: { title, start: new Date(start), end: end ? new Date(end) : null, allDay}
        });
        res.json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Supprimer un événement
eventRouter.delete('/events/:id', async (req, res) => {
    try {
        await prisma.event.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: 'Événement supprimé' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});




module.exports = eventRouter;
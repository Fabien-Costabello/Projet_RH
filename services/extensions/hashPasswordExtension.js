const {Prisma} = require("@prisma/client")
const bcrypt = require('bcrypt')


module.exports = Prisma.defineExtension({
    name:'hashPasswordExtension',
    query : {
        entreprise:{
            create:async ({args,query}) =>{
                const hash = await bcrypt.hash(args.data.password,10)
           args.data.password = hash;
           return query(args)
            }
        }
    }
})
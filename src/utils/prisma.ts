import { PrismaClient } from "@prisma/client";
import { env } from 'process';

class Prisma extends PrismaClient {
    constructor() {
        super({
            datasources: {
                db: { url: env.DATABASE_URL }
            }
        })
        this.$connect()
        console.log("🎇 Database connected successfully !")
    }

}


const prisma  = new Prisma();
export default prisma ;
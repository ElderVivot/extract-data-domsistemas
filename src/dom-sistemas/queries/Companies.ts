import fs from 'fs'
import { Connection } from 'odbc'
import path from 'path'

import DB from '../db'

export default class Companies {
    private db: DB
    private connection: Connection | void
    private sql: string

    constructor () {
        this.db = new DB()
        this.sql = fs.readFileSync(path.resolve(__dirname, './sql/companies.sql')).toString()
    }

    async export (): Promise<any> {
        try {
            this.connection = await this.db.connectToDatabase()
            if (this.connection) {
                const companies = await this.connection.query(this.sql)
                if (companies) {
                    delete companies.statement
                    delete companies.return
                    delete companies.parameters
                    delete companies.count
                    delete companies.columns
                }
                console.log(`- [dom-sistemas_queries_Companies_exportCompanies] --> Sucess --> ${companies.length} length`)
                return companies
            }
        } catch (error) {
            console.log(`- [dom-sistemas_queries_Companies_exportCompanies] --> Error --> ${error}`)
        } finally {
            await this.db.disconnectToDatabase()
        }
    }
}

// const companies = new Companies()
// companies.export().then(result => console.log(result))
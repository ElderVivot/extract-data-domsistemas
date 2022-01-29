import { Connection } from 'odbc'

import DB from '../db'

export default class StatesQuery {
    private db: DB
    private connection: Connection | void
    private sql: string

    constructor () {
        this.db = new DB()
        this.sql = `
            SELECT nome_uf AS name, sigla_uf AS acronym
              FROM bethadba.geestado
             WHERE codigo_uf <> 9
        `
    }

    async export (): Promise<any> {
        try {
            this.connection = await this.db.connectToDatabase()
            if (this.connection) {
                const fetch = await this.connection.query(this.sql)
                if (fetch) {
                    delete fetch.statement
                    delete fetch.return
                    delete fetch.parameters
                    delete fetch.count
                    delete fetch.columns
                }
                console.log(`- [dom-sistemas_queries_state] --> Sucess --> ${fetch.length} length`)
                return fetch
            }
        } catch (error) {
            console.log(`- [dom-sistemas_queries_state] --> Error --> ${error}`)
        } finally {
            await this.db.disconnectToDatabase()
        }
    }
}
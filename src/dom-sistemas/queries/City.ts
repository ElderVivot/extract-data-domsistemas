import { Connection } from 'odbc'

import DB from '../db'

export default class StatesQuery {
    private db: DB
    private connection: Connection | void
    private sql: string

    constructor () {
        this.db = new DB()
        this.sql = `
        SELECT mun.NOME_MUNICIPIO_ACENTUADO_MINUSCULO AS name, estado.sigla_uf AS acronymState, mun.codigo_ibge AS idIbge
        FROM bethadba.gemunicipio AS mun
             INNER JOIN bethadba.geestado as estado
                  ON    estado.codigo_uf = mun.codigo_uf
        WHERE mun.codigo_municipio <> 0
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
                console.log(`- [dom-sistemas_queries_city] --> Sucess --> ${fetch.length} length`)
                return fetch
            }
        } catch (error) {
            console.log(`- [dom-sistemas_queries_city] --> Error --> ${error}`)
        } finally {
            await this.db.disconnectToDatabase()
        }
    }
}
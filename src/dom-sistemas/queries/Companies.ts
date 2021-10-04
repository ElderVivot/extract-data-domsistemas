import { Connection } from 'odbc'

import DB from '../db'

export default class Companies {
    private db: DB
    private connection: Connection | void
    private sql: string

    constructor () {
        this.db = new DB()
        this.sql = `
            SELECT  emp.codi_emp AS code,
                    emp.nome_emp AS name,
                    emp.apel_emp AS nickName,
                    emp.tins_emp AS typeCgce,
                    COALESCE(TRIM(emp.cgce_emp), '') AS cgce,
                    emp.stat_emp AS status,
                    emp.dddf_emp AS ddd,
                    emp.fone_emp AS fone,
                    emp.email_emp AS email,
                    emp.ramo_emp AS ramo,
                    emp.dtinicio_emp AS dateInicialAsCompanie,
                    emp.dcad_emp AS dateInicialAsClient,
                    emp.dina_emp AS dateFinalAsClient,
                    emp.iest_emp AS inscricaoEstadual,
                    emp.imun_emp AS inscricaoMunicipal,
                    emp.esta_emp AS uf,
                    COALESCE( (SELECT vig.RFED_PAR
                        FROM bethadba.EFPARAMETRO_VIGENCIA AS vig
                       WHERE vig.CODI_EMP = emp.codi_emp 
                         AND vig.VIGENCIA_PAR = (SELECT max(vig2.VIGENCIA_PAR )
                                                   FROM bethadba.EFPARAMETRO_VIGENCIA AS vig2
                                                  WHERE vig2.codi_emp = emp.codi_emp 
                                                    AND vig2.VIGENCIA_PAR <= today() )), 99 ) AS regimeFiscal
            
               FROM bethadba.geempre AS emp
            
            ORDER BY emp.codi_emp
        `
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

const companies = new Companies()
companies.export().then(result => console.log(result))
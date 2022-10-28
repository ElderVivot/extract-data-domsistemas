import { Connection } from 'odbc'

import DB from '../db'

export class CompaniesDomSistemas {
    private db: DB
    private connection: Connection | void
    private sql: string

    constructor () {
        this.db = new DB()
        this.sql = `
            SELECT  emp.codi_emp AS codeCompanieAccountSystem,
                    emp.nome_emp AS name,
                    emp.apel_emp AS nickName,
                    emp.tins_emp AS typeFederalRegistration,
                    COALESCE(TRIM(emp.cgce_emp), '') AS federalRegistration,
                    emp.stat_emp AS status,
                    emp.dddf_emp AS dddPhone,
                    emp.fone_emp AS phone,
                    emp.email_emp AS email,
                    emp.dtinicio_emp AS dateInicialAsCompanie,
                    emp.dcad_emp AS dateInicialAsClient,
                    emp.dina_emp AS dateFinalAsClient,
                    emp.iest_emp AS stateRegistration,
                    emp.imun_emp AS cityRegistration,
                    emp.esta_emp AS uf,
                    COALESCE(emp.i_cnae20, '') || ',' ||
                       COALESCE( ( SELECT LIST(cnae_sec.codigo_cnae)
                           FROM bethadba.geatvsecundaria AS cnae_sec
                          WHERE cnae_sec.codi_emp = emp.codi_emp ), '' ) AS cnaes, 
                    COALESCE( ( SELECT mun.codigo_ibge
                                  FROM bethadba.gemunicipio AS mun
                                 WHERE mun.codigo_municipio = emp.codigo_municipio ) , '' ) AS idIbgeCity,
                    COALESCE( (SELECT vig.RFED_PAR
                        FROM bethadba.EFPARAMETRO_VIGENCIA AS vig
                       WHERE vig.CODI_EMP = emp.codi_emp 
                         AND vig.VIGENCIA_PAR = (SELECT max(vig2.VIGENCIA_PAR )
                                                   FROM bethadba.EFPARAMETRO_VIGENCIA AS vig2
                                                  WHERE vig2.codi_emp = emp.codi_emp 
                                                    AND vig2.VIGENCIA_PAR <= today() )), 99 ) AS taxRegime,
                    ( SELECT count( distinct fun.i_empregados )
                        FROM bethadba.foempregados AS fun
                        WHERE fun.CODI_EMP = emp.CODI_EMP 
                            AND fun.tipo_epr = 1
                            AND NOT EXISTS ( SELECT 1
                                            FROM bethadba.forescisoes AS res
                                            WHERE res.codi_emp = fun.codi_emp
                                                AND res.i_empregados = fun.i_empregados
                                                AND res.tipo in (1,2,3) ) ) AS employeesActive,
                    ( SELECT count( distinct fun.i_empregados )
                        FROM bethadba.foempregados AS fun
                        WHERE fun.CODI_EMP = emp.CODI_EMP 
                            AND fun.tipo_epr = 2
                            AND fun.tipo_contrib = 'E'
                            AND NOT EXISTS ( SELECT 1
                                            FROM bethadba.foafastamentos AS afa
                                            WHERE afa.codi_emp = fun.codi_emp
                                                AND afa.i_empregados = fun.i_empregados
                                                AND afa.i_afastamentos = 8 ) ) AS employersActive,
                    ( SELECT COUNT(1)
                        FROM bethadba.FOESOCIAL_DADOS_EVENTOS AS esocial                
                        WHERE esocial.codi_emp = emp.codi_emp
                            AND esocial.i_evento_esocial = 1000
                            AND esocial.tipo_envio not in (3) /* nao eh exclusao */            
                            AND esocial.validado = 1
                            AND NOT EXISTS ( SELECT 1
                                            FROM bethadba.foesocial_dados_eventos AS esocial2
                                            WHERE esocial2.codi_emp = esocial.codi_emp
                                                AND esocial2.i_evento_esocial = 3000
                                                AND esocial2.tipo_envio = 3
                                                AND esocial2.i_evento_esocial_excluido = esocial.i_evento_esocial
                                                AND esocial2.numero_recibo_excluido = esocial.numero_recibo ) ) AS qtdEventsS1000
            
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
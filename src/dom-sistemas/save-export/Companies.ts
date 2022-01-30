
import axios from 'axios'

import { ICompanie } from '../../models/i-companie'
import { api } from '../../services/api'
import { correlationStatus, correlationTaxRegime, correlationTypeCgce } from '../../services/functions'
import CompaniesQuerie from '../queries/Companies'

export default class Companies {
    private companies: CompaniesQuerie

    constructor () {
        this.companies = new CompaniesQuerie()
    }

    async save (): Promise<any> {
        try {
            const resultQuerie: ICompanie[] = await this.companies.export()
            for (const companie of resultQuerie) {
                try {
                    companie.typeFederalRegistration = correlationTypeCgce(companie.typeFederalRegistration)
                    companie.status = correlationStatus(companie.status)
                    companie.taxRegime = correlationTaxRegime(companie.taxRegime.toString())
                    companie.neighborhood = ''
                    companie.street = ''
                    companie.zipCode = ''
                    companie.complement = ''
                    companie.referency = ''
                    companie.cnaes = ''
                    await api.post('/companie', { ...companie }, { headers: { tenant: process.env.TENANT } })
                    console.log(`\t- Salvo empresa ${companie.codeCompanieAccountSystem} - ${companie.federalRegistration} - ${companie.name}`)
                } catch (error) {
                    console.log(`\t- erro ao salvar empresa ${companie.codeCompanieAccountSystem} - ${companie.federalRegistration} - ${companie.name}`)
                    if (axios.isAxiosError(error)) console.log(error.response?.data || error.response, { ...companie })
                    else console.log(error)
                }
            }
        } catch (error) {
            console.log(`- [dom-sistemas_save-export_Companies_exportCompanies] --> Error --> ${error}`)
        }
    }
}

const companies = new Companies()
companies.save().then(_ => console.log('- [dom-sistemas_save-export_Companies_exportCompanies] Empresas Exportadas com sucesso.'))
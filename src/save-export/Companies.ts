
import axios from 'axios'

import { CompaniesDomSistemas } from '../dom-sistemas/queries/Companies'
import { CompaniesExcel } from '../excel/read/companies'
import { ICompanie } from '../models/i-companie'
import { api } from '../services/api'
import { correlationStatus, correlationTaxRegime, correlationTypeCgce } from '../services/functions'

const CHECK_DATE_FINAL_COMPANIE_AS_INATIVE = !process.env.CHECK_DATE_FINAL_COMPANIE_AS_INATIVE ? true : process.env.CHECK_DATE_FINAL_COMPANIE_AS_INATIVE === 'true'

export class Companies {
    private companies: CompaniesDomSistemas | CompaniesExcel

    constructor (accountSystem: string) {
        if (accountSystem === 'dominio_sistemas') this.companies = new CompaniesDomSistemas()
        else if (accountSystem === 'excel') this.companies = new CompaniesExcel()
        else this.companies = null
    }

    async save (): Promise<any> {
        try {
            const resultQuerie: ICompanie[] = await this.companies.export()
            for (const companie of resultQuerie) {
                // if (companie.codeCompanieAccountSystem.toString() !== '272') continue
                try {
                    companie.codeCompanieAccountSystem = companie.codeCompanieAccountSystem.toString()
                    companie.typeFederalRegistration = correlationTypeCgce(companie.typeFederalRegistration.toString())
                    if (companie.dateFinalAsClient && CHECK_DATE_FINAL_COMPANIE_AS_INATIVE) { companie.status = 'I' }
                    companie.status = correlationStatus(companie.status)
                    companie.taxRegime = correlationTaxRegime(companie.taxRegime.toString())
                    companie.phone = companie.phone || null
                    companie.email = companie.email || null
                    companie.cnaes = companie.cnaes || null
                    companie.neighborhood = ''
                    companie.street = ''
                    companie.zipCode = ''
                    companie.complement = ''
                    companie.referency = ''
                    companie.stateRegistration = companie.stateRegistration ? companie.stateRegistration.toString() : ''
                    companie.cityRegistration = companie.cityRegistration ? companie.cityRegistration.toString() : ''
                    await api.post('/companie', { ...companie }, { headers: { tenant: process.env.TENANT } })
                    console.log(`\t- Salvo empresa ${companie.codeCompanieAccountSystem} - ${companie.federalRegistration} - ${companie.name} - ${companie.status}`)
                } catch (error) {
                    console.log(`\t- erro ao salvar empresa ${companie.codeCompanieAccountSystem} - ${companie.federalRegistration} - ${companie.name}`)
                    if (axios.isAxiosError(error)) console.log(error.response?.data || error.toJSON(), { ...companie })
                    else console.log(error)
                }
            }
        } catch (error) {
            console.log(`- [dom-sistemas_save-export_Companies_exportCompanies] --> Error --> ${error}`)
        }
    }
}
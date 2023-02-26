
import axios from 'axios'

import { CompaniesDataQuerie } from '../dom-sistemas/queries/CompaniesData'
import { ICompanieData } from '../models/ICompanieData'
import { api } from '../services/api'

export class CompaniesData {
    private companiesData: CompaniesDataQuerie

    constructor (accountSystem: string) {
        if (accountSystem === 'dominio_sistemas') this.companiesData = new CompaniesDataQuerie()
        else this.companiesData = null
    }

    async save (): Promise<any> {
        try {
            const resultQuerie: ICompanieData[] = await this.companiesData.export()
            for (const companieData of resultQuerie) {
                const {
                    codeCompanieAccountSystem, lastDateEmployeeResignation, lastDateContribuinteResignation, markedFolhaModule,
                    existParameterFolha, markedFolhaParameterToSendEsocial
                } = companieData

                try {
                    companieData.codeCompanieAccountSystem = codeCompanieAccountSystem.toString()
                    companieData.markedFolhaModule = markedFolhaModule.toString()
                    companieData.existParameterFolha = existParameterFolha.toString()
                    companieData.markedFolhaParameterToSendEsocial = markedFolhaParameterToSendEsocial.toString()
                    companieData.lastDateEmployeeResignation = !lastDateEmployeeResignation ? null : lastDateEmployeeResignation
                    companieData.lastDateContribuinteResignation = !lastDateContribuinteResignation ? null : lastDateContribuinteResignation

                    await api.post('/companies_data', { ...companieData }, { headers: { tenant: process.env.TENANT } })
                    console.log(`\t- Salvo empresa ${companieData.codeCompanieAccountSystem} - ${companieData.federalRegistration} - ${companieData.name}`)
                } catch (error) {
                    console.log(`\t- erro ao salvar empresa ${companieData.codeCompanieAccountSystem} - ${companieData.federalRegistration} - ${companieData.name}`)
                    if (axios.isAxiosError(error)) console.log(error.response?.data || error.toJSON(), { ...companieData })
                    else console.log(error)
                }
            }
        } catch (error) {
            console.log(`- [dom-sistemas_save-export_CompaniesData_exportCompanies] --> Error --> ${error}`)
        }
    }
}
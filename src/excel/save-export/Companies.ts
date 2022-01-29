import { api } from '../../services/api'
import { Companies as CompaniesExcel } from '../read/companies'

export class Companies {
    private companies: CompaniesExcel

    constructor () {
        this.companies = new CompaniesExcel()
    }

    async save (): Promise<any> {
        try {
            const resultQuerie = this.companies.export()
            return await api.put('/companies', { resultQuerie })
        } catch (error) {
            console.log(`- [excel_Companies_exportCompanies] --> Error --> ${error}`)
        }
    }
}

const companies = new Companies()
companies.save().then(_ => console.log('- [excel_Companies_exportCompanies] Empresas Exportadas com sucesso.'))
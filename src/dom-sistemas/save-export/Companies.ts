import api from '../../services/api'
import CompaniesQuerie from '../queries/Companies'

export default class Companies {
    private companies: CompaniesQuerie

    constructor () {
        this.companies = new CompaniesQuerie()
    }

    async save (): Promise<any> {
        try {
            const resultQuerie = await this.companies.export()
            return await api.put('/companies', { resultQuerie })
        } catch (error) {
            console.log(`- [dom-sistemas_save-export_Companies_exportCompanies] --> Error --> ${error}`)
        }
    }
}

const companies = new Companies()
companies.save().then(result => console.log(result))
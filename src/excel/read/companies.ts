import { format, zonedTimeToUtc } from 'date-fns-tz'
import xlsx from 'xlsx'

import 'dotenv/config'
import { ICompanie } from '../../models/i-companie'

export class Companies {
    private companies: Array<ICompanie> = []

    export (): any {
        try {
            const workbook = xlsx.readFile(process.env.WAY_EXCEL, { cellText: false, cellDates: true })
            const sheetNameList = workbook.SheetNames
            const sheetToJson: Array<ICompanie> = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]])
            for (const companie of sheetToJson) {
                const { dateInicialAsCompanie, dateInicialAsClient, dateFinalAsClient } = companie
                companie.dateInicialAsCompanie = dateInicialAsCompanie ? format(zonedTimeToUtc(dateInicialAsCompanie, 'America/Sao_Paulo'), 'yyyy-MM-dd', { timeZone: 'America/Sao_Paulo' }) : null
                companie.dateInicialAsClient = dateInicialAsClient ? format(zonedTimeToUtc(dateInicialAsClient, 'America/Sao_Paulo'), 'yyyy-MM-dd', { timeZone: 'America/Sao_Paulo' }) : null
                companie.dateFinalAsClient = dateFinalAsClient ? format(zonedTimeToUtc(dateFinalAsClient, 'America/Sao_Paulo'), 'yyyy-MM-dd', { timeZone: 'America/Sao_Paulo' }) : null
                companie.ddd = null
                companie.fone = null
                companie.email = null
                companie.ramo = null
                companie.inscricaoEstadual = null
                companie.nickName = companie.name
                this.companies.push(companie)
            }
            return this.companies
        } catch (error) {
            console.log(`- [excel_Companies_exportCompanies] --> Error --> ${error}`)
        }
    }
}
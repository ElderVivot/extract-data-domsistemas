import { CronJob } from 'cron'
import 'dotenv/config'

import CompaniesDomSistemas from '../../dom-sistemas/save-export/Companies'
import { Companies as CompaniesExcel } from '../../excel/save-export/Companies'

async function processExport () {
    if (process.env.ACCOUNT_SYSTEM === 'excel') {
        const companies = new CompaniesExcel()
        companies.save()
    } else {
        const companies = new CompaniesDomSistemas()
        companies.save()
    }
}

const job = new CronJob(
    '30 18 * * *',
    async function () {
        await processExport()
    },
    null,
    true,
    'America/Sao_Paulo'
)

export default job
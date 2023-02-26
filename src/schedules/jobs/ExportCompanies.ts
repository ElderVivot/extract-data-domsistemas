import { CronJob } from 'cron'

import 'dotenv/config'
import { Companies } from '../../save-export/Companies'
import { CompaniesData } from '../../save-export/CompaniesData'

async function processExport () {
    let accountSystem = 'dominio_sistemas'
    if (process.env.ACCOUNT_SYSTEM === 'excel') accountSystem = 'excel'

    const companies = new Companies(accountSystem)
    await companies.save()

    const companiesData = new CompaniesData(accountSystem)
    await companiesData.save()
}

processExport().then(_ => console.log(_))

const job = new CronJob(
    '10 */3 * * *', // each 3 hours in minute 10
    async function () {
        await processExport()
    },
    null,
    true,
    'America/Sao_Paulo'
)

export default job
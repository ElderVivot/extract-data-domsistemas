import { CronJob } from 'cron'
import 'dotenv/config'

import { Companies } from '../../save-export/Companies'

async function processExport () {
    let accountSystem = 'dominio_sistemas'
    if (process.env.ACCOUNT_SYSTEM === 'excel') accountSystem = 'excel'

    const companies = new Companies(accountSystem)
    await companies.save()
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
import { CronJob } from 'cron'

import Companies from '../../dom-sistemas/save-export/Companies'

async function process () {
    const companies = new Companies()
    companies.save()
}

const job = new CronJob(
    '30 18 * * *',
    async function () {
        await process()
    },
    null,
    true,
    'America/Sao_Paulo'
)

export default job
import express from 'express'

import ExportCompanies from './jobs/ExportCompanies'

const app = express()

ExportCompanies.start()

export default app
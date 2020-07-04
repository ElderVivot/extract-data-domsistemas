import odbc, { Connection } from 'odbc'
import 'dotenv/config'

export default class DB {
    private readonly dsn: string
    private readonly port: number
    private readonly user: string
    private readonly password: string
    private readonly charset: string
    private readonly urlConnection: string
    private connection: Connection | null

    constructor () {
        this.dsn = process.env.CONNECTION_ODBC || 'Contabil'
        this.port = Number(process.env.PORT) || 2638
        this.user = process.env.USER || 'EXTERNO'
        this.password = process.env.PASSWORD || 'EXTERNO'
        this.charset = process.env.CHARSET || 'UTF-8'
        this.urlConnection = `DSN=${this.dsn};UID=${this.user};PWD=${this.password};PORT=${this.port};charset=${this.charset}`
        this.connection = null
    }

    async connectToDatabase (): Promise<Connection | void> {
        try {
            if (!this.connection) {
                this.connection = await odbc.connect(this.urlConnection)
                console.log('- [dom-sistemas_db_connectToDatabase] --> Success --> Connected')
            }

            return this.connection
        } catch (error) {
            console.log(`- [dom-sistemas_db_connectToDatabase] --> Error --> ${error}`)
        }
    }

    async disconnectToDatabase (): Promise<void | string> {
        try {
            if (this.connection) {
                await this.connection.close()
                console.log('- [dom-sistemas_db_disconnectToDatabase] --> Success --> Disconnected')
            }
        } catch (error) {
            console.log(`- [dom-sistemas_db_disconnectToDatabase] --> Error --> ${error}`)
        }
    }
}

// const db = new DB()
// db.connectToDatabase().then(result => console.log(result))
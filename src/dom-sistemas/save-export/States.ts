
import axios from 'axios'
import 'dotenv/config'

import { api } from '../../services/api'
import StatesQuerie from '../queries/States'

interface IStates {
    name: string
    acronym: string
}

export default class States {
    private querie: StatesQuerie

    constructor () {
        this.querie = new StatesQuerie()
    }

    async save (): Promise<any> {
        try {
            const resultQuerie: IStates[] = await this.querie.export()
            for (const result of resultQuerie) {
                try {
                    await api.post('/state', { ...result })
                    console.log(`\t- Salvo estado ${result.name} - ${result.acronym}`)
                } catch (error) {
                    console.log(`\t- Erro ao salvar estado ${result.name} - ${result.acronym}`)
                    if (axios.isAxiosError(error)) console.log(error.response?.data || error.toJSON())
                    else console.log(error)
                }
            }
        } catch (error) {
            console.log(`- [dom-sistemas_save-export_state] --> Error --> ${error}`)
        }
    }
}

const states = new States()
states.save().then(_ => console.log('- [dom-sistemas_save-export_state] Estados Exportadas com sucesso.'))
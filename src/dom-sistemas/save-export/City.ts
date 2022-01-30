
import axios from 'axios'
import 'dotenv/config'

import { api } from '../../services/api'
import CityQuerie from '../queries/City'

interface ICity {
    name: string
    acronymState: string
    idIbge: number
}

export default class City {
    private querie: CityQuerie

    constructor () {
        this.querie = new CityQuerie()
    }

    async save (): Promise<any> {
        try {
            const resultQuerie: ICity[] = await this.querie.export()
            for (const result of resultQuerie) {
                try {
                    await api.post('/city', { ...result })
                    console.log(`\t- Salvo cidade ${result.name} - ${result.acronymState} - ${result.idIbge}`)
                } catch (error) {
                    console.log(`\t- Erro ao salvar cidade ${result.name} - ${result.acronymState} - ${result.idIbge}`)
                    if (axios.isAxiosError(error)) console.log(error.response?.data || error.toJSON())
                    else console.log(error)
                }
            }
        } catch (error) {
            console.log(`- [dom-sistemas_save-export_city] --> Error --> ${error}`)
        }
    }
}

const city = new City()
city.save().then(_ => console.log('- [dom-sistemas_save-export_city] Cidades Exportadas com sucesso.'))
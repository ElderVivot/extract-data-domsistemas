import { format, zonedTimeToUtc } from 'date-fns-tz'

export function correlationTypeCgce (typeCgce: string): string {
    if (typeCgce === '1') return 'cnpj'
    else if (typeCgce === '2') return 'cpf'
    else if (typeCgce === '3') return 'cei'
    else if (typeCgce === '6') return 'caepf'
    else return 'cnpj'
}

export function correlationStatus (status: string): string {
    if (status === 'A') return 'ACTIVE'
    else if (status === 'I') return 'INACTIVE'
    else return 'ACTIVE'
}

export function correlationTaxRegime (taxRegime: string): string {
    if (taxRegime === '2' || taxRegime === '4') return '01'
    else if (taxRegime === '5') return '02'
    else if (taxRegime === '1') return '03'
    else return '99'
}

export function formatDate (dateString: Date | null): string | null {
    try {
        if (dateString) return format(zonedTimeToUtc(dateString, 'America/Sao_Paulo'), 'yyyy-MM-dd', { timeZone: 'America/Sao_Paulo' })
        else return null
    } catch (error) {
        // console.log(error)
        return null
    }
}
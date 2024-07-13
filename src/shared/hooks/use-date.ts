import dayjs from 'dayjs';
import 'dayjs/locale/fr'

export const useDate = () => {

    const format = 'YYYY-MM-DD HH:mm:ss'

    const getDateTimeFormat = (date: string | number): string => {
        return dayjs(Number(date)).format(format)
    }

    return {
        getDateTimeFormat
    }
}
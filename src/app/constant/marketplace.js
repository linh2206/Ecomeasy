import { toAbsoluteUrl } from "../../_metronic/utils/utils";

export const MARKET_PLACE = {
    shopee: {
        key: 'shopee',
        name: 'Shopee',
        image: toAbsoluteUrl('/media/platform-logos/shopee.png'),
        color: '#FFA500',
    },
    sendo: {
        key: 'sendo',
        name: 'Sendo',
        image: toAbsoluteUrl('/media/platform-logos/sendo.png'),
        color: '#DC143C'
    },
    lazada: {
        key: 'lazada',
        name: 'Lazada',
        image: toAbsoluteUrl('/media/platform-logos/lazada.png'),
        color: '#9932CC'
    },
    // tiki: {
    //     key: 'tiki',
    //     name: 'Tiki',
    //     image: toAbsoluteUrl('/media/platform-logos/tiki.png'),
    //     color: '#00BFFF'
    // },
    googleSheet: {
        key: 'googleSheet',
        name: 'Google Sheet',
        image: toAbsoluteUrl('/media/logos/google-sheet.svg'),
        color: '#91dd47'
    },
    uploadSource: {
        key: 'uploadSource',
        name: 'Others',
        image: toAbsoluteUrl('/media/logos/google-sheet.svg'),
        color: '#91dd47'
    },
    others: {
        key: 'uploadSource',
        name: 'Others',
        image: toAbsoluteUrl('/media/logos/google-sheet.svg'),
        color: '#91dd47'
    },
    yes24: {
        key: 'yes24',
        name: 'Yes 24',
        image: toAbsoluteUrl('/media/platform-logos/yes24.jpg'),
        color: '#91dd47'
    }
}

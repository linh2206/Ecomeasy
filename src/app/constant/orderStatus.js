export const ORDER_STATUS = {
    shopee: {
        CANCELLED: {
            code: 'CANCELLED'
        },
        TO_RETURN: {
            code: 'CANCELLED'
        },
        READY_TO_SHIP: {
            code: 'SHIPPING'
        },
        IN_CANCEL: {
            code: 'SHIPPING'
        },
        COMPLETED: {
            code: 'COMPLETED'
        },
        SHIPPED: {
            code: 'COMPLETED'
        }
    },
    sendo: {
        7: {
            code: 'COMPLETED'
        },
        8: {
            code: 'COMPLETED'
        },
        10: {
            code: 'COMPLETED'
        },
        2: {
            code: 'SHIPPING'
        },
        3: {
            code: 'SHIPPING'
        },
        6: {
            code: 'SHIPPING'
        },
        11: {
            code: 'SHIPPING'
        },
        12: {
            code: 'SHIPPING'
        },
        14: {
            code: 'SHIPPING'
        },
        15: {
            code: 'SHIPPING'
        },
        19: {
            code: 'SHIPPING'
        },
        23: {
            code: 'SHIPPING'
        },
        13: {
            code: 'CANCELLED'
        },
        21: {
            code: 'CANCELLED'
        },
        22: {
            code: 'CANCELLED'
        }
    },
    lazada: {
        canceled: {
            code: 'CANCELLED'
        },
        returned: {
            code: 'CANCELLED'
        },
        failed: {
            code: 'CANCELLED'
        },
        pending: {
            code: 'SHIPPING'
        },
        ready_to_ship: {
            code: 'SHIPPING'
        },
        delivered: {
            code: 'COMPLETED'
        },
        shipped: {
            code: 'SHIPPING'
        },
        INFO_ST_DOMESTIC_RETURN_AT_TRANSIT_HUB: {
            code: 'CANCELLED'
        }
    },
    googleSheet: {
        Canceled: {
            code: 'CANCELLED'
        },
        Done: {
            code: 'COMPLETED'
        },
        Shipping: {
            code: 'SHIPPING'
        }
    },
    tiki: {
        complete: {
            code: 'COMPLETED'
        },
        successful_delivery: {
            code: 'COMPLETED'
        },
        delivered: {
            code: 'COMPLETED'
        },
        closed: {
            code: 'COMPLETED'
        },
        queueing: {
            code: 'SHIPPING'
        },
        processing: {
            code: 'SHIPPING'
        },
        waiting_payment: {
            code: 'SHIPPING'
        },
        handover_to_partner: {
            code: 'SHIPPING'
        },
        packaging: {
            code: 'SHIPPING'
        },
        picking: {
            code: 'SHIPPING'
        },
        shipping: {
            code: 'SHIPPING'
        },
        paid: {
            code: 'SHIPPING'
        },
        hold: {
            code: 'SHIPPING'
        },
        ready_to_ship: {
            code: 'SHIPPING'
        },
        payment_review: {
            code: 'SHIPPING'
        },
        finished_packing: {
            code: 'SHIPPING'
        },
        canceled: {
            code: 'CANCELLED'
        },
        returned: {
            code: 'CANCELLED'
        },
    }
}

export const ORDER_CANCELLED_ORDER = {
    lazada: ['canceled', 'returned', 'failed'],
    shopee: ['CANCELLED', 'TO_RETURN'],
    others: ['Canceled'],
    tiki: ['returned', 'canceled'],
    sendo: [13, 21, 22]
}
import React from 'react';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2'
import 'chartjs-plugin-labels';
import { makeStyles } from '@material-ui/styles';
import { parseLocaleString } from '../../../../helpers/helper'
import { MARKET_PLACE } from '../../../../constant/marketplace'
import _ from "lodash"


DonutChart.propTypes = {

};

const useStyles = makeStyles({
    root: {
        height: '400px',
        maxWidth: '220px',
        padding: '20px 0',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    }
})

function DonutChart(props) {
    const classes = useStyles()
    const { revenueList } = props
    const shops = props.shops
    let donutChartData = {
        labels: [],
        datasets: [
            {
                label: "My First dataset",
                fill: false,
                lineTension: 0.1,
                backgroundColor: [],
                borderCapStyle: "butt",
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: "miter",
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: []
            }
        ]
    };

    if (revenueList && revenueList.length > 0) {
        revenueList.forEach(item => {
            donutChartData.labels.push((_.get(shops.find(shop => shop._id === item._id), 'name') || item._id).toUpperCase())
            donutChartData.datasets[0].data.push(item.totalAmount)
            donutChartData.datasets[0].backgroundColor.push(MARKET_PLACE[item._id] ? MARKET_PLACE[item._id].color : item.color)
        })
    }

    const donutChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            position: 'bottom',
            align: 'middle',
            fontSize: 18,
            labels: {
                fontColor: "#000a12",
                boxWidth: 10,
                padding: 15
            }
        },
        tooltips: {
            enabled: true,
            callbacks: {
                label: function (tooltipItem, data) {
                    var dataset = data.datasets[tooltipItem.datasetIndex];
                    var currentValue = dataset.data[tooltipItem.index];
                    return parseLocaleString(currentValue)
                },
                title: function (tooltipItem, data) {
                    return data.labels[tooltipItem[0].index];
                }
            }
        },
        plugins: {
            labels: {
                render: 'percentage',
                fontColor: '#FFF'
            }
        },
        elements: {
            arc: {
                borderWidth: 0
            }
        }
    }
    return (
        <div className={classes.root}>
            <Doughnut data={donutChartData} options={donutChartOptions} />
        </div>
    );
}

export default DonutChart;
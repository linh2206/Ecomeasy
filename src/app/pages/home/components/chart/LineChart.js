import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { makeStyles } from '@material-ui/styles';
import { parseLocaleString } from '../../../../helpers/helper'
import { MARKET_PLACE } from '../../../../constant/marketplace'
import _ from 'lodash'

LineChart.propTypes = {

};

const useStyles = makeStyles({
    root: {
        height: '350px',
        padding: '0 30px 30px 30px'
    }
})

function LineChart(props) {
    const classes = useStyles()
    const { revenueList } = props
    const format = _.get(props, 'groupBy.format')
    const shops = props.shops
    const [data, setData] = useState({})

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            position: 'top',
            align: 'end',
            fontSize: 18,
            labels: {
                fontColor: "#000a12",
                boxWidth: 12,
                padding: 15
            }
        },
        tooltips: {
            enabled: true,
            callbacks: {
                label: function (tooltipItem, data) {
                    var dataset = data.datasets[tooltipItem.datasetIndex];
                    var currentValue = dataset.data[tooltipItem.index];
                    return `${dataset.label}:  ${parseLocaleString(currentValue)}`;
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
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    padding: 25,
                    callback: function (value, index, values) {
                        return parseLocaleString(value);
                    }
                }
            }]
        }
    }
    const baseConfig = {
        fill: false,
        lineTension: 0.5,
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 5,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
    }

    useEffect(() => {
        let labels = []
        let datasets = []

        //Get labels
        if (revenueList && revenueList.length > 0) {
            revenueList.forEach(item => {
                labels = [...labels, ...item.date]
                datasets.push({
                    label: (_.get(shops.find(shop => shop._id === item._id), 'name') || item._id).toUpperCase(),
                    borderColor: MARKET_PLACE[item._id] ? MARKET_PLACE[item._id].color : item.color,
                    dataTemp: item.data,
                    data: [],
                    ...baseConfig
                })
            });
        }

        labels.sort((x, y) => x - y)
        labels = labels.map(item => item.format(format))
        labels = _.uniq(labels, 'id');

        //Custom data
        if (labels && labels.length > 0) {
            labels.forEach(item => {
                datasets.forEach(sItem => {
                    sItem.data.push(sItem.dataTemp[item] || 0)
                })
            })
        }
        setData({
            labels: labels,
            datasets: datasets
        })
    }, [revenueList])

    return (
        <div className={classes.root}>
            <Line data={data} options={options} />
        </div>
    );
}

export default LineChart;
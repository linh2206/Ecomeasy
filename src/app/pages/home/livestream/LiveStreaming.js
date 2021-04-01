import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { globalStyles } from '../../../styles/globalStyles'
import { toAbsoluteUrl } from "../../../../_metronic/utils/utils";
import { Avatar, Button } from '@material-ui/core';

LiveStreaming.propTypes = {

};

const useStyles = makeStyles({
    root: {
        color: '#65686a',
        fontSize: 16
    },
    informationSection: {
        maxWidth: 1200,
        margin: '0 auto'
    },
    downloadSection: {
        textAlign: 'center',
        margin: '50px 0'
    },
    downloadOptionsSection: {
        maxWidth: 1200,
        margin: '0 auto'
    },
    ...globalStyles
})

function LiveStreaming(props) {
    const classes = useStyles()
    const information = [
        {
            title: 'Simplified Global Cloud Video Streaming',
            image: toAbsoluteUrl('/media/bg/live-streaming-1.jpg'),
            content: [
                {
                    title: 'Configure Professional Streams in Minutes',
                    content: ['Configure streams easily with the Wowza Streaming Cloud GUI management portal.',
                        'Stream using a wide variety of protocols and codecs.', 'Transcode and transmux for a wide range of networks and devices.'
                        , 'Instantly create video-on-demand assets from your live streams.']
                },
                {
                    title: 'Stream to Any Size Audience, Anywhere',
                    content: ['Manage costs with pay-as-you-go, contract-free pricing.', 'Scale automatically to accommodate global audiences of any size.', 'Leverage industry-leading CDNs like Akamai and Fastly.']
                },
                {
                    title: 'Leverage Advanced Features',
                    content: ['4K streaming for UHD, virtual reality and augmented reality.', 'Stream customization for full control of your message and brand.',
                        'Wide range of security options, including CDN token authorization and geoblocking.', 'Near real-time visibility into bandwidth consumption and number of viewers by region.']
                }
            ]
        },
        {
            title: 'Built to Build On',
            image: toAbsoluteUrl('/media/bg/live-streaming-2.jpg'),
            content: [
                {
                    title: 'Comprehensive REST API and SDKs',
                    content: ['Programmable access to every aspect of stream processing.', 'Automatic monitoring and management of the entire workflow.',
                        'Advanced options to customize transcoding, sources, and targets.']
                },
                {
                    title: 'Proven App Development Framework',
                    content: ['Extensive developer tools including a REST API, Java and Ruby SDKs, and code samples.', 'Seamless integration with a broad ecosystem of streaming tools.']
                }
            ]
        },
        {
            title: 'Low-Latency Solutions for Every Use Case',
            image: toAbsoluteUrl('/media/bg/live-streaming-3.png'),
            content: [
                {
                    title: 'Stream From Your Browser, Broadcast to Thousands',
                    content: ['Wowza Streaming Cloud enables simple browser-based streaming powered by WebRTC. Easily capture video from any browser without complicated configuration or integration and broadcast it to any destination.']
                },
                {
                    title: 'Near-Real-Time Streaming Over Suboptimal Networks',
                    content: ['SRT (Secure Reliable Transport) can be used to transport high-quality live streams to Streaming Cloud for transcoding and redistribution, enabling the best-quality live video over the most unpredictable networks. Learn more about SRT.']
                },
                {
                    title: 'Tuning HLS for Low Latency',
                    content: ['When quality, affordability, and mass distribution are your highest priorities, Wowza Streaming Cloud can help tune HLS for reduced-latency streaming. Learn more about Tuning HLS.']
                }
            ]
        }
    ]

    const options = [
        {
            os: 'Windows',
            image: toAbsoluteUrl('/media/bg/windows.png'),
            url: 'https://www.wowza.com/downloads/WowzaStreamingEngine-4-8-5-05/WowzaStreamingEngine-4.8.5.05-windows-installer.exe',
            steps: ['Double-click the WowzaStreamingEngine-4.8.5.05-windows-installer.exe installer file and follow the onscreen instructions.',
                'To run Wowza™ Transcoder on Windows Server 2008 or 2012 the following components are required: .NET Framework 3.5.1, Desktop Experience']
        },
        {
            os: 'Mac',
            image: toAbsoluteUrl('/media/bg/mac.png'),
            url: 'https://www.wowza.com/downloads/WowzaStreamingEngine-4-8-5-05/WowzaStreamingEngine-4.8.5.05-osx-installer.dmg',
            steps: ['Open WowzaStreamingEngine-4.8.5.05-osx-installer.dmg',
                'Double-click the installer package icon and follow the onscreen instructions.']
        },
        {
            os: 'Linux 64-bit',
            image: toAbsoluteUrl('/media/bg/linux.png'),
            url: 'https://www.wowza.com/downloads/WowzaStreamingEngine-4-8-5-05/WowzaStreamingEngine-4.8.5.05-linux-x64-installer.run',
            steps: ['sudo chmod +x WowzaStreamingEngine-4.8.5.05-linux-x64-installer.run', 'sudo ./WowzaStreamingEngine-4.8.5.05-linux-x64-installer.run',
                'Follow the onscreen instructions.']
        }
    ]
    return (
        <div className={classes.root}>
            <div className={classes.informationSection}>
                <ul className="information__list">
                    {
                        information.map((item, index) => (
                            <li key={index} className="information__item">
                                <div className="information__container">

                                    <div className="information__image-section"><img src={item.image} /></div>
                                    <div className="information__text-section">
                                        <p className="information__text-section__title">{item.title}</p>
                                        <ul className="information__text-section__content">
                                            {
                                                item.content.map((subItem, subIndex) => (
                                                    <li key={subIndex} className="information__text-section__content__sub-text-section">
                                                        <p className="information__text-section__content__sub-text-section__title">{subItem.title}</p>
                                                        <ul className="information__text-section__content__sub-text-section__content">
                                                            {
                                                                subItem.content.map((c, cIndex) => (
                                                                    <li key={cIndex}>{c}</li>
                                                                ))
                                                            }
                                                        </ul>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
            <div className={classes.downloadSection}>
                <p style={{
                    fontSize: 30,
                    color: '#ff8400',
                    fontWeight: 500
                }}>Try Wowza Streaming Cloud for Free</p>
                <button className="live-streaming-btn">Free Trial</button>
            </div>
            <div className={classes.downloadOptionsSection}>
                <p style={{
                    fontSize: 30,
                    color: '#ff8400',
                    fontWeight: 500
                }}>Download the Wowza Streaming Engine Installer*</p>
                <p>The current version is Wowza Streaming Engine 4.8.5.05, build 20201006161917, released on October 8, 2020.</p>
                <p style={{
                    fontWeight: 700
                }}>*To update an existing installation of Wowza Streaming Engine with the latest features and enhancements, sign in to your Wowza account and go to My Downloads. After downloading the update, see How to update your Wowza Streaming Engine installation.</p>
                <ul className="option__list">
                    {
                        options.map((item, index) => (
                            <li key={index} className="option__item">
                                <div className="option__container">
                                    <p>{item.os}</p>
                                    <div style={{
                                        height: 80
                                    }}>
                                        <img src={item.image} />
                                    </div>
                                    <a href={item.url} className="live-streaming-btn live-streaming-btn--fullwidth">Download</a>
                                    <p style={{
                                        marginTop: 30,
                                        textAlign: 'left',
                                        fontSize: 20
                                    }}>To Install:</p>
                                    <ul className="option__tutorial">
                                        {
                                            item.steps.map((subItem, subIndex) => (
                                                <li key={subIndex}>{subItem}</li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    );
}

export default LiveStreaming;
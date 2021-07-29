import React, { Component, useEffect, useState } from 'react'
import gradeintLogo from '../../assets/images/backgroundDomains.png';
import classes from './domain.module.css'
import { API, BASE_API } from '../../Utils/backend.js';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CSSTransition, Transition } from 'react-transition-group';
import { ExploreEvents } from './ExploreEvents/ExploreEvents';
import axios from 'axios';
// import * as Scroll from "react-scroll";

class DomainPage extends Component {

    constructor(props) {
        super(props);
        this.eventRef = React.createRef();
    }
    settings = {
        dots: false,
        infinite: false,
        speed: 1000,
        slidesToShow: 4,
        slidesToScroll: 2,
        lazyLoad: 'progressive',
        swipeToSlide: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    swipeToSlide: true,
                }
            },
            {
                breakpoint: 580,
                settings: {
                    slidesToShow: 1,
                    swipeToSlide: true,
                    slidesToScroll: 1,
                }

            },
            {
                breakpoint: 980,
                settings: {
                    slidesToShow: 3,
                    swipeToSlide: true,
                    slidesToScroll: 1,
                }

            }
        ]
    }

    state = {
        domains: [],
        currentDomain: {
            domain: {
                domainName: 'Domains',
                domainDescription: 'Unleash your inner technocrat & Participate in numerous events',
                facultyCoordinator: [],
                studentCoordinator: []
            },
            events: []
        },

        currentSelected: -1,
        exploreEvents: false,
        animate: false,
        workshops: [],
        precula: false,

    }

    componentDidMount() {
        this.getDomains();        
    }

    getDomains = () => {
        axios.get(`${API}/domains`)
            .then(response => {
                this.setState({ domains: response.data })
                console.log(this.state.domains)

                if (this.props.detail.name == 'workshops') {
                    console.log(true)
                    this.state.domains.map((item, pos) => {
                        return (
                            item.domainName === 'Precula' ? this.getSingleDomain(item._id, pos) : null
                        )
                    })
                    setTimeout(() => {
                        window.location.replace(`${window.location.pathname}#${this.props.detail.id}`)
                    } , 3000)
                }
                if (this.props.detail.name == 'events') {
                    console.log(false)
                    // console.log(this.props)
                    this.state.domains.map((item, pos) => {
                        // console.log(this.props.detail.id , item._id)
                        return (
                            item._id == this.props.detail.id ? this.getSingleDomain(item._id, pos) : null
                        )
                    })
                    console.log(this.props)
                    setTimeout(() => {
                        window.location.replace(`${window.location.pathname}#${this.props.detail.secId}`)
                    } , 3000)
                }
                else {
                    // window.location.replace('/domain');
                }
                

            }).catch(err => {
            
                // alert(err.response)
                console.log(err)
            })
    }
    getSingleDomain = (id,pos) => {
        axios.get(`${API}/domain/${id}`)
            .then(response => {
                this.setState({ currentDomain: response.data, precula: false,exploreEvents:true,animate:true,currentSelected:pos })
                if (response.data.domain.domainName == 'Precula') {
                    this.getWorkshops();
                }
                console.log(this.state.currentDomain);
            }).catch(err => {
                // alert("error")
                console.log(err.response)
            })
    }

    getWorkshops = () => {
        axios.get(`${API}/workshops`)
            .then(response => {
                this.setState({ workshops: response.data, precula: true })
            }).catch(err => {
                console.log(err.response)
            })
    }


    render() {
        return (
            <div className={classes.container}>
                <img src={this.state.exploreEvents ? `${BASE_API}${this.state.currentDomain?.domain?.photo}` : gradeintLogo} alt='' className={classes.displayImage} />
                <div className={classes.content}>
                    <CSSTransition
                        in={this.state.animate}
                        timeout={500}
                        classNames={classes.animate}
                        onExit={() => this.setState({ animate: false })}
                    >
                        <div className={classes.text}>
                            <h1>{this.state.currentDomain.domain.domainName}</h1>
                            <p>
                                {this.state.currentDomain.domain.domainDescription}
                            </p>
                        </div>
                    </CSSTransition>
                    {this.state.exploreEvents ? <button className={classes.btnExploreEvents} onClick={() => { this.eventRef.current.scrollIntoView() }}>Explore Events</button> : null}
                    {this.state.exploreEvents ?
                        <div className={classes.coordinators}>
                            {this.state.currentDomain.domain.facultyCoordinator.map(item => {
                                return (
                                    <div className={classes.facultyCoordinator}>
                                        <img src={`${BASE_API}${item?.photo}`} alt='' className={classes.facultyCoordinatorImage} />
                                        <div>
                                            <h6>{item.coordinatorName}</h6>
                                            <p>{item.coordinatorDesignation}</p>
                                        </div>
                                    </div>
                                )
                            })}
                            <div className={classes.domainCoordinator}>
                                {this.state.currentDomain.domain.studentCoordinator.map((item, pos) => {
                                    return (
                                        <div className={classes.facultyCoordinator}>
                                            <div>
                                                <h6>{item.coordinatorName}</h6>
                                                <p>{item.coordinatorPhone}</p>
                                            </div>
                                            <img src={`${BASE_API}${item?.photo}`} alt='' className={classes.facultyCoordinatorImage} />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        : null}
                    <div className={classes.cardContainer}>
                        <div className={classes.cardHeadingContainer}>
                            <p>Domains</p>
                            <hr />
                        </div>

                        <Slider {...this.settings} >
                            {this.state.domains.map((item, pos) => {
                                return (
                                    <div className={classes.cardRoot} key={pos} onClick={() => {
                                        this.getSingleDomain(item._id,pos);
                                    }
                                    } >
                                        <div className={[classes.cardContent, this.state.currentSelected === pos ? classes.active : null].join(" ")}>
                                            <img src={`${BASE_API}${item.photo}`} alt='' className={classes.cardImage} />
                                            <div className={classes.cardData}>
                                                <h4>{item.domainName}</h4>
                                                <p>{item.domainDescription}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </Slider>
                    </div>
                </div>
                {this.state.exploreEvents ? <div ref={this.eventRef}>
                    <h1 className={classes.domainHeading}>{this.state.currentDomain.domain.domainName}</h1>
                    {

                        this.state.precula ? this.state.workshops.map(item => {
                            return (<ExploreEvents id={item._id} content={item} heading={this.state.currentDomain.domain.domainName} />)
                        }) :
                            this.state.currentDomain.events.map(item => {
                                return (<ExploreEvents id={item._id} content={item} heading={this.state.currentDomain.domain.domainName} />)
                            })
                    }
                </div> : null}

                {/* <img src={gradeintLogo} alt='' className='rightlogo1'/> */}
            </div>
        );
    }
}

export default DomainPage

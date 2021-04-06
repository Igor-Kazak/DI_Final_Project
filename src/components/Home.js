import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import TestChoose from './TestChoose'
import img4 from '../img/airplane.png'
import img5 from '../img/helicopter.png'
import img4c from '../img/airplane_c.png'
import img5c from '../img/helicopter_c.png'
import { TIMELIMIT, TOTALQUEST, PERCENTCORRECT } from '../config/config';

const Home = (props) => {

    function colourImg(event) {
        if (event.target.id === "4") {
            event.target.src = img4c;
        }
        else {
            event.target.src = img5c;
        }
    }

    function greyImg(event) {
        if (event.target.id === "4") {
            event.target.src = img4;
        }
        else {
            event.target.src = img5;
        }
    }

    const { signedIn } = props;

    if (signedIn) {
        return (
            <>
                <TestChoose />
            </>
        )
    }
    else {
        return (
            <>
                <div className="container px-5 pt-3">
                    <div className="row gx-5 mb-3">
                        <div className="col">
                            <div className="p-3 px-4 border bg-light">
                                <p className="mt-2">PPL test is the examination test for private pilots licenses, which is based on European
                                   regulations and standards and is also ICAO-compliant.</p>
                                <p>PPL test has two modes: test for aircraft licenses and test for helicopter licenses.</p>
                                <div className="row gx-5 mb-0">
                                    <div className="col tc">
                                        <img src={img4} width="200px" alt='' id="4"
                                            onMouseEnter={colourImg} onMouseLeave={greyImg} />
                                    </div>
                                    <div className="col tc">
                                        <img src={img5} width="200px" alt='' id="5"
                                            onMouseEnter={colourImg} onMouseLeave={greyImg} />
                                    </div>
                                </div>
                                <p>You have {TOTALQUEST} random questions and {TIMELIMIT} minutes. Answer correctly at least {PERCENTCORRECT}% of the questions to pass the test.</p>
                                <p>Please Log in or register for test.</p>
                                <Link to="/signin" className="btn btn-sm btn-outline-secondary">Sign in</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        signedIn: state.reducerOne.signedIn
    }
}

export default connect(mapStateToProps, null)(Home);

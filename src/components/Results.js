import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import React from 'react';
import { Link } from 'react-router-dom';
import { handleSignIn, handleAfterTest } from '../redux/actions'
import WrongAnswers from './WrongAnswers';
import { SERVERURL, TOTALQUEST, TIMELIMIT, PERCENTCORRECT } from '../config/config';

class Results extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            result: [],
            testTime: '',
            rating: '',
            wrong: []
        }
    }

    componentDidMount() {
        const { signedIn, user, afterTest } = this.props;
        if (signedIn) {
            fetch(`${SERVERURL}/getResult`, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: user[0]?.username, quantity: TOTALQUEST })
            })
                .then(res => res.json())
                .then(data => {
                    this.setState({ result: data });
                    this.resultAnalysis();
                })
                .catch(e => {
                    console.log(e);
                });
        }
        afterTest();
    }

    resultAnalysis = () => {
        const result = this.state.result;
        let end = new Date(result[0]?.date);
        let start = new Date(result[result.length - 1]?.date);
        let counter = 0;
        this.setState({ testTime: parseInt((end - start) / 1000) });
        for (let i = 0; i < result.length; i++) {
            if (result[i].userAnswer[0] === result[i].correctAnswer[0]) {
                counter++;
            }
        }
        this.setState({ rating: counter });
        this.emailResults();
    }

    emailResults = () => {
        let { user } = this.props;
        let { result, rating, testTime } = this.state;
        fetch(`${SERVERURL}/email`, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                firstname: user[0]?.firstname, 
                lastname: user[0]?.lastname,
                email: user[0]?.email,
                time: parseInt(testTime / 60) +' min '+ (testTime % 60) + ' sec',
                correct: rating,
                wrong: result.length - rating,
                percent: ((rating / result.length) * 100).toFixed(2),
                status: (((rating / result.length) * 100) >= PERCENTCORRECT) && ((testTime / 60) < TIMELIMIT) ? 'passed' : 'not passed' 
             })
        })
            .then(res => res.json())
            .then(data => {
                //console.log('email to user:' + data?.status);
            })
            .catch(e => {
                console.log(e);
            });
    }

    markWrong = (event) => {
        event.target.className = "p-3 border bg-info"
    }

    demarkWrong = (event) => {
        event.target.className = "p-3 border bg-light"
    }

    showWrong = () => {
        if (this.state.wrong.length === 0) {
            let { result }= this.state;
            var wrongData = [];
            for (let i = 0; i < result.length; i++) {
                if (result[i].userAnswer[0] !== result[i].correctAnswer[0]) {
                    wrongData.push(result[i]);
                }
            }
            this.setState({ wrong: wrongData })
        }
        else {
            this.setState({ wrong: [] })
        }
    }

    render() {
        const { signedIn, signInSwitch, user } = this.props;
        const { result, rating, testTime, wrong } = this.state;
        let percentCorrect = ((rating / result.length) * 100).toFixed(2);

        if (signedIn) {
            return (
                <>
                    <div className="container px-5 pt-2">
                        <div className="row gx-5">
                            <div className="col">
                                <div className="p-3 px-4 border bg-light">
                                    <p className="mt-2">{user[0]?.firstname}, here are your test results:</p>
                                    <div className="progress mb-4">
                                        <div className="progress-bar bg-success" role="progressbar"
                                            style={{ width: `${percentCorrect}%` }} aria-valuenow={percentCorrect}
                                            aria-valuemin="0" aria-valuemax="100">{rating}</div>
                                        <div className="progress-bar bg-danger" role="progressbar"
                                            style={{ width: `${100 - percentCorrect}%` }} aria-valuenow={100 - percentCorrect}
                                            aria-valuemin="0" aria-valuemax="100">{result.length - rating}</div>
                                    </div>
                                    <div className="row gx-5 mb-3">
                                        <div className="col">
                                            <div className="p-3 border">Status:
                                            <span style={{ color: `${percentCorrect >= PERCENTCORRECT ? 'green' : 'red'}` }}>
                                                    {(percentCorrect >= PERCENTCORRECT) && (parseInt(testTime / 60) < TIMELIMIT) ? ' passed' : ' not passed'}</span>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="p-3 border">Total questions: {result.length}</div>
                                        </div>
                                    </div>
                                    <div className="row gx-5 mb-3">
                                        <div className="col">
                                            <div className="p-3 border">Percentage: {percentCorrect}%</div>
                                        </div>
                                        <div className="col">
                                            <div className="p-3 border">Correct answers: {rating}</div>
                                        </div>
                                    </div>
                                    <div className="row gx-5 mb-3">
                                        <div className="col">
                                            <div className="p-3 border">Test duration: {parseInt(testTime / 60)} min {(testTime % 60)} sec</div>
                                        </div>
                                        <div className="col">
                                            <div className="p-3 border" style={{ cursor: "pointer" }}
                                                onClick={this.showWrong} onMouseEnter={this.markWrong} onMouseLeave={this.demarkWrong}>
                                                Wrong answers: {result.length - rating}</div>
                                        </div>
                                    </div>
                                    <div className="row gx-5">
                                        <div className="col">
                                            <div className="p-3 tc">
                                            <Link to='/' className="btn btn-sm btn-outline-secondary">Test again</Link>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="p-3 tc">
                                                <Link to='/signout' className="btn btn-sm btn-outline-secondary"
                                                    onClick={() => signInSwitch(false)}>Sign out</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <WrongAnswers data={wrong} />
                </>
            )
        }
        else {
            return (
                <Redirect to='/' />
            )
        }
    }
}

const mapStateToProps = (state) => {
    return {
        signedIn: state.reducerOne.signedIn,
        user: state.reducerOne.currentUser,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signInSwitch: (value) => dispatch(handleSignIn(value)),
        afterTest: () => dispatch(handleAfterTest()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Results);

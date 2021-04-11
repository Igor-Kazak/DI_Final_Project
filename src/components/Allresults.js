import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import React from 'react';
import { SERVERURL, TOTALQUEST, TIMELIMIT, PERCENTCORRECT } from '../config/config';

class TestResult {
    constructor(date, time, duration, status, percent) {
        this.date = date;
        this.time = time;
        this.duration = duration;
        this.status = status;
        this.percent = percent;
    }
}

class Allresults extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            allresult: [],
            resultToShow: [],
        }
    }

    componentDidMount() {
        const { signedIn, user } = this.props;
        if (signedIn) {
            fetch(`${SERVERURL}/getAllResult`, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: user[0]?.username })
            })
                .then(res => res.json())
                .then(data => {
                    this.setState({ allresult: data });
                    this.resultAnalysis();
                })
                .catch(e => {
                    console.log(e);
                });
        }
    }

    resultAnalysis = () => {
        const { allresult, resultToShow } = this.state;
        let testsQuant = parseInt(allresult.length / TOTALQUEST);
        for (let i = 0; i < testsQuant; i++) {
            let firstQuest = i * TOTALQUEST;
            let lastQuest = (((i + 1) * TOTALQUEST) - 1);
            let end = new Date(allresult[firstQuest]?.date);
            let start = new Date(allresult[lastQuest]?.date);
            let correct = 0;
            let testTime = parseInt((end - start) / 1000);
            let duration = parseInt(testTime / 60) + ' min ' + (testTime % 60) + ' sec';
            for (let j = firstQuest; j <= lastQuest; j++) {
                if (allresult[j].userAnswer[0] === allresult[j].correctAnswer[0]) {
                    correct++;
                }
            }
            let date = ('0' + start.getDate()).slice(-2) + '.' + ('0' + (start.getMonth() - (-1))).slice(-2) + '.' + start.getFullYear();
            let time = ('0' + start.getHours()).slice(-2) + ':' + ('0' + start.getMinutes()).slice(-2);
            let percent = Math.round((correct / TOTALQUEST) * 10000) / 100;
            let status = percent >= PERCENTCORRECT && (testTime / 60) < TIMELIMIT ? 'passed' : 'not passed';
            resultToShow.push(new TestResult(date, time, duration, status, percent + '%'));
        }
        this.setState({ resultToShow: resultToShow });
    }

    render() {

        const { signedIn, user } = this.props;
        const { resultToShow } = this.state;

        if (signedIn) {
            if (resultToShow.length !== 0) {
                return (
                    <>
                        <div className="container px-5 pt-3">
                            <div className="p-3 px-4 border bg-light">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">№</th>
                                            <th scope="col">Date</th>
                                            <th scope="col">Time</th>
                                            <th scope="col">Duration</th>
                                            <th scope="col">Correct</th>
                                            <th scope="col">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resultToShow.map((item, i) => {
                                            return (
                                                <tr key={i} className={item?.status === "passed" ? "table-success" : "table-danger"}>
                                                    <th scope="row">{i - (-1)}</th>
                                                    <td>{item?.date}</td>
                                                    <td>{item?.time}</td>
                                                    <td>{item?.duration}</td>
                                                    <td>{item?.percent}</td>
                                                    <td>{item?.status}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )
            }
            else {
                return (
                    <div className="container px-5 pt-3">
                        <div className="p-5 px-4 border bg-light tc">
                            {user[0]?.firstname}, you don't have any test results yet... <br />
                            Please, pass the test.
                    </div>
                    </div>
                )
            }
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

export default connect(mapStateToProps, null)(Allresults);

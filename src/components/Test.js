import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { userAsyncAnswer, incrementQuestion } from '../redux/actions';

const Test = (props) => {

    const { signedIn, user, db, nextQuestion, numQuestion, sendAnswer, IsOnAir } = props;
    let ticket = db[numQuestion];
    let progressBar = 0;
    progressBar = parseInt(numQuestion / db.length * 100);
    const [sec, setSec] = useState('00');
    const [min, setMin] = useState('00');

    useEffect(() => {
        var startTime = new Date();
        const timer = setInterval(() => {
            let now = new Date();
            let timeSpent = now - startTime;
            var timeCount = new Date(timeSpent - 7200000);
            setSec(('0' + timeCount.getSeconds()).slice(-2));
            setMin(('0' + timeCount.getMinutes()).slice(-2));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    function handleAnswer(event) {
        sendAnswer({
            username: user[0]?.username,
            number: numQuestion - (-1) + ' of ' + db.length,
            question: ticket?.question,
            userAnswer: event.target.id + ') ' + ticket?.[event.target.id],
            correctAnswer: ticket?.answer + ') ' + ticket?.[ticket?.answer]
        });
        nextQuestion();
    }

    function markAnswer(event) {
        event.target.className = "p-3 border bg-info"
    }

    function demarkAnswer(event) {
        event.target.className = "p-3 border bg-light"
    }

    if (signedIn && IsOnAir) {
        return (
            <>
                <div className="container px-5 pt-1">
                    <div className="mb-2 tr"
                        style={{ color: (min < 30 ? 'black' : "red") }}>{min}:{sec}
                    </div>
                    <div className="col progress mb-3">
                        <div className="progress-bar" role="progressbar"
                            style={{ width: `${progressBar}%` }} aria-valuenow={progressBar}
                            aria-valuemin="0" aria-valuemax="100">{numQuestion} of {db.length}</div>
                    </div>
                    <div className="row gx-5">
                        <div className="col">
                            <div className="p-3 px-4 border bg-warning" style={{ fontWeight: "bold" }}>{ticket?.question}</div>
                        </div>
                    </div>
                    <div className="row gx-5 mt-4">
                        <div className="col">
                            <div className="p-3 border bg-light" id='a' style={{ cursor: "pointer" }}
                                onClick={handleAnswer} onMouseEnter={markAnswer} onMouseLeave={demarkAnswer}>
                                <strong className="mx-2 me-3">A</strong>{ticket?.a}</div>
                        </div>
                    </div>
                    <div className="row gx-5 mt-4">
                        <div className="col">
                            <div className="p-3 border bg-light" id='b' style={{ cursor: "pointer" }}
                                onClick={handleAnswer} onMouseEnter={markAnswer} onMouseLeave={demarkAnswer}>
                                <strong className="mx-2 me-3">B</strong>{ticket?.b}</div>
                        </div>
                    </div>
                    <div className="row gx-5 mt-4">
                        <div className="col">
                            <div className="p-3 border bg-light" id='c' style={{ cursor: "pointer" }}
                                onClick={handleAnswer} onMouseEnter={markAnswer} onMouseLeave={demarkAnswer}>
                                <strong className="mx-2 me-3">C</strong>{ticket?.c}</div>
                        </div>
                    </div>
                    <div className="row gx-5 mt-4">
                        <div className="col">
                            <div className="p-3 border bg-light" id='d' style={{ cursor: "pointer" }}
                                onClick={handleAnswer} onMouseEnter={markAnswer} onMouseLeave={demarkAnswer}>
                                <strong className="mx-2 me-3">D</strong>{ticket?.d}</div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    else {
        if (signedIn && !IsOnAir) {
            return (
                <Redirect to='/results' />
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
        db: state.reducerOne.questions,
        numQuestion: state.reducerOne.currentQuestion,
        user: state.reducerOne.currentUser,
        IsOnAir: state.reducerOne.onAir
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        sendAnswer: (ticket) => dispatch(userAsyncAnswer(ticket)),
        nextQuestion: () => dispatch(incrementQuestion())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Test);

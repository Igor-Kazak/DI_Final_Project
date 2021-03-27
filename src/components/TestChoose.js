import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getAsyncQuestions } from '../redux/actions'
import img4 from '../img/airplane.png'
import img5 from '../img/helicopter.png'

const TestChoose = (props) => {

    const { getQuestions } = props;

    function markAnswer(event) {
        if (event.target.id === 'ia' || event.target.id === 'ih') {
            event.target.parentElement.className = "p-3 bg-info border mx-3 mb-2 tc"
        }
        else {
            event.target.className = "p-3 bg-info border mx-3 mb-2 tc"
        }
    }

    function demarkAnswer(event) {
        if (event.target.id === 'ia' || event.target.id === 'ih') {
            event.target.parentElement.className = "p-3 bg-light border mx-3 mb-2 tc"
        }
        else {
            event.target.className = "p-3 bg-light border mx-3 mb-2 tc"
        }
    }

    return (
        <>
            <div className="container px-5 pt-2">
                <div className="d-grid gap-3">

                    <Link to='/test' className="p-3 bg-light border mx-3 mb-2 tc"
                        onMouseEnter={markAnswer} onMouseLeave={demarkAnswer}
                        onClick={() => getQuestions('aircraft')} style={{ textDecoration: 'none', color: 'black' }}>
                        <img src={img4} width="200px" alt='' id="ia"/> <br />PPL test for aircraft license</Link>
                    <Link to='/test' className="p-3 bg-light border mx-3 mb-2 tc"
                        onMouseEnter={markAnswer} onMouseLeave={demarkAnswer}
                        onClick={() => getQuestions('helicopter')} style={{ textDecoration: 'none', color: 'black' }}>
                        <img src={img5} width="200px" alt='' id="ih"/> <br />PPL test for helicopter license</Link>

                </div>
            </div>
        </>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        getQuestions: (value) => dispatch(getAsyncQuestions(value))
    }
}

export default connect(null, mapDispatchToProps)(TestChoose);


import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { handleSignIn } from '../redux/actions'

const NavBar = (props) => {

    const { signedIn, signInSwitch, user, numQuestion } = props;

    return (
        <nav className="navbar navbar-expand navbar-light bg-light border-bottom mb-3">
            <div className="container-fluid">
                <Link to='/' className="navbar-brand">PPL TEST</Link>

                <div className="navbar-collapse navbar-expand" id="navbarText">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link to='/about' className="nav-link">About</Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/project' className="nav-link">Project</Link>
                        </li>
                    </ul>
                    <span className="navbar-text">
                        <Link to='/allresults' className="link mx-3" 
                        style={numQuestion!==0 ? {pointerEvents:"none"} : {fontWeight:"bold"}}>{user[0]?.firstname}</Link>
                        <Link to={signedIn ? '/signout' : '/signin'} className="btn btn-sm btn-outline-secondary"
                            onClick={() => signedIn ? signInSwitch(false) : null}>
                            {signedIn ? 'Sign out' : 'Sign in'}</Link>
                    </span>
                </div>
            </div>
        </nav>
    )
}

const mapStateToProps = (state) => {
    return {
        signedIn: state.reducerOne.signedIn,
        user: state.reducerOne.currentUser,
        numQuestion: state.reducerOne.currentQuestion,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signInSwitch: (value) => dispatch(handleSignIn(value))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);

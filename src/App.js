import React from 'react';
import './App.css';
import 'tachyons';
import Home from './components/Home';
import About from './components/About';
import Project from './components/Project';
import NavBar from './components/NavBar';
import SignIn from './components/SignIn';
import Test from './components/Test';
import Results from './components/Results';
import { Route, Switch, Redirect } from 'react-router-dom';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {

    return (
      <React.Fragment>
        <NavBar />
        <Switch>
          <Route path='/' exact><Home /></Route>
          <Route path='/about' render={() => <About />} />
          <Route path='/project' children={<Project />} />
          <Route path='/signin' children={<SignIn />} />
          <Route path='/signout' render={() => <Redirect to='/' />} />
          <Route path='/test' children={<Test />} />
          <Route path='/results' children={<Results />} />
          <Route ><h3 className="tc mt-5">404 <br /> PAGE NOT FOUND!</h3></Route>
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;

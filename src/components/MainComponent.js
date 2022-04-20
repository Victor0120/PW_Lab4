import React, { Component } from 'react';
import QuizDetails from "./QuizdetailComponent";
import Header from './MenuComponent';
import Home from './HomeComponent';
import QuizCreate from './QuizCreateComponent';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { fetchQuizes } from '../redux/ActionCreators';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { checkToken } from '../redux/ActionCreators';

import Sound from 'react-sound';

const mapDispatchToProps = dispatch => ({
    fetchQuizes: () => { dispatch(fetchQuizes()) }
});

const mapStateToProps = state => {
    return {
        quizes: state.quizes
    }
}

class Main extends Component {
    constructor(props) {
        super(props);
        this.props.fetchQuizes();
        checkToken();
    }

    render() {
        const HomePage = () => {
            return (
                <div>
                    <Home
                        quizes={this.props.quizes.quizes}
                        quizesLoading={this.props.quizes.isLoading}
                        quizesErrMess={this.props.quizes.errMess}
                    />
                </div>
            );
        }

        const QuizWithId = ({ match }) => {
            return (
                <QuizDetails
                    id={this.props.quizes.quizes.filter((quiz) => quiz.id === parseInt(match.params.quizId, 10))[0].id} />
            );
        };

        const Create = () => {
            return (<QuizCreate />)
        }
        return (
            <div className='main-container'>
                <Sound
                    url="https://file-examples.com/storage/fe8d415a4e625f28ea2bfd7/2017/11/file_example_MP3_700KB.mp3"
                    playStatus={Sound.status.PLAYING}
                    playFromPosition={300 /* in milliseconds */}
                    onLoading={this.handleSongLoading}
                    onPlaying={this.handleSongPlaying}
                    onFinishedPlaying={this.handleSongFinishedPlaying}
                />
                <Header />
                <TransitionGroup className="content-container" style={{ backgroundImage: `url(${process.env.PUBLIC_URL + '/background.jpg'})` }}>
                    <CSSTransition key={this.props.location.key} classNames="page" timeout={300}>
                        <Switch location={this.props.location}>
                            <Route exact path='/home' component={HomePage} />
                            <Route path='/home/:quizId' component={QuizWithId} />
                            <Route path='/create' component={Create} />
                            <Redirect to="/home" />
                        </Switch>
                    </CSSTransition>
                </TransitionGroup>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));

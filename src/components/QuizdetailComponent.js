import React, { Component } from "react";
import { Card, CardBody } from "reactstrap";
import { fetchQuiz } from '../redux/ActionCreators';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { checkToken } from "../redux/ActionCreators";


const mapDispatchToProps = dispatch => ({
    fetchQuiz: (id) => { dispatch(fetchQuiz(id)) }
});

const mapStateToProps = state => {
    return {
        quiz: state.quiz
    }
}

class QuizDetails extends Component {
    constructor(props) {
        super(props);
        this.props.fetchQuiz(this.props.id);
        this.selectAnswer = this.selectAnswer.bind(this)
        this.state = {
            questionIndex: 0,
            selectedOption: "",
            score: 0,
            submitingQuestion: false,
            quizEnded: false
        }

        checkToken();
    }

    selectAnswer(event) {
        this.setState({
            selectedOption: event.target.value
        });
    }

    proccesQuestion = () => {
        this.setState({
            submitingQuestion: true
        });
        fetch('https://pure-caverns-82881.herokuapp.com/api/v54/quizzes/' + this.props.quiz.quiz.id + '/submit', {
            method: "POST",
            body: JSON.stringify({
                "data": {
                    "question_id": this.props.quiz.quiz.questions[this.state.questionIndex].id,
                    "answer": this.state.selectedOption,
                    "user_id": localStorage.userId
                }
            }),
            headers: {
                'Content-Type': 'application/json',
                "Accept": "*/*",
                "Connection": "keep-alive",
                "X-Access-Token": localStorage.getItem("token")
            },
        })
            .then(response => {

                if (response.ok) {
                    return response;
                } else {
                    var error = new Error('Error ' + response.status + ': ' + response.statusText);
                    error.response = response;
                    throw error;
                }
            },
                error => {
                    throw error;
                })
            .then(response => response.json())
            .then(response => {
                if (this.state.questionIndex + 1 !== this.props.quiz.quiz.questions.length) {
                    this.setState({
                        questionIndex: this.state.questionIndex + 1,
                        selectedOption: "",
                        submitingQuestion: false,
                        score: response.correct ? this.state.score + 1 : this.state.score
                    });
                } else {
                    this.setState({
                        selectedOption: "",
                        submitingQuestion: false,
                        score: response.correct ? this.state.score + 1 : this.state.score,
                        quizEnded: true
                    });
                }
            })
            .catch(error => {
                console.log('post comments', error.message);
                alert('Your answer could not be verified\n' + error.message);
            });
    }

    renderQuestion() {
        if (this.state.quizEnded) {
            return (
                <div>
                    Score: {this.state.score} / {this.props.quiz.quiz.questions.length}
                </div>
            );
        }
        else if (this.props.quiz.quiz !== null) {
            return (
                <div className="container col-12 col-md m-1">
                    <div className="row col-12 col-md m-1">
                        <Card>
                            <CardBody>
                                <div className="row col-12 col-md m-1">
                                    <textarea disabled={true}>{this.props.quiz.quiz.questions[this.state.questionIndex].question}</textarea>

                                </div>
                                <div className="row col-12 col-md m-1">
                                    <ul>
                                        {
                                            this.props.quiz.quiz.questions[this.state.questionIndex].answers.map((a) => (
                                                <li>
                                                    <input
                                                        type="checkbox"
                                                        key={this.props.quiz.quiz.questions[this.state.questionIndex].id + a}
                                                        className="mr-2"
                                                        value={a}
                                                        checked={this.state.selectedOption == a}
                                                        onChange={this.selectAnswer} />{a}
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                    <button className="mt-2 btn btn-info"
                        onClick={this.proccesQuestion}
                        disabled={this.state.selectedOption === ""}>
                        {this.state.questionIndex + 1 === this.props.quiz.quiz.questions.length ? "End Quiz" : "Continue"}
                    </button>
                </div>
            );
        }
        else {
            return (<div></div>);
        }
    }

    render() {
        if (this.props.quiz.isLoading) {
            return (
                <div className="container">
                    <div className="row load-icon">
                        <div className='text-center'>
                            <span className="fa fa-spinner fa-pulse fa-3x fa-fw text-primary"></span>
                            <p>Loading . . .</p>
                        </div>
                    </div>
                </div>
            );
        }
        else if (this.props.quiz.errMess) {
            return (
                <div className="container">
                    <div className="row">
                        <h4>{this.props.errMess}</h4>
                    </div>
                </div>
            );
        }
        else if (this.props.quiz.quiz !== null && this.props.quiz.quiz !== undefined) {
            return (
                <div className="container">
                    <div className="row">
                        <div className="col-12 text-center">
                            <h3>{this.props.quiz.quiz.title}</h3>
                            <hr />
                        </div>
                    </div>
                    {
                        this.renderQuestion()
                    }
                </div>
            );
        }
        if (this.props.quiz === null || this.props.quiz === undefined) {
            return (<div></div>)
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(QuizDetails));
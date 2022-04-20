import React, { Component } from "react";
import { Input, Label, Button } from 'reactstrap';
import { checkToken } from '../redux/ActionCreators';

class QuizCreate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: "",
            question: "",
            ans1: "",
            ans2: "",
            ans3: "",
            ans4: "",
            corectAns: 0,
            questions: []
        };

        checkToken();
        this.addQuestion = this.addQuestion.bind(this);
        this.addQuiz = this.addQuiz.bind(this);
    }

    addQuestion() {
        var correct_answer = null;
        switch (this.state.corectAns) {
            case "1":
                correct_answer = this.state.ans1;
                break;
            case "2":
                correct_answer = this.state.ans2;
                break;
            case "3":
                correct_answer = this.state.ans3;
                break;
            case "4":
                correct_answer = this.state.ans4;
                break;
        }
        var qst = {
            question: this.state.question,
            answers: [this.state.ans1, this.state.ans2, this.state.ans3, this.state.ans4],
            correct_answer: correct_answer
        };

        this.setState({
            questions: [...this.state.questions, qst],
            question: "",
            ans1: "",
            ans2: "",
            ans3: "",
            ans4: "",
            corectAns: 0,
        });
    }

    addQuiz() {
        var correct_answer = null;
        switch (this.state.corectAns) {
            case "1":
                correct_answer = this.state.ans1;
                break;
            case "2":
                correct_answer = this.state.ans2;
                break;
            case "3":
                correct_answer = this.state.ans3;
                break;
            case "4":
                correct_answer = this.state.ans4;
                break;
        }
        var qst = null;
        if (this.state.question !== "") {
            qst = {
                question: this.state.question,
                answers: [this.state.ans1, this.state.ans2, this.state.ans3, this.state.ans4],
                correct_answer: correct_answer
            };
        }
        fetch('https://pure-caverns-82881.herokuapp.com/api/v54/quizzes/', {
            method: "POST",
            body: JSON.stringify({
                "data": {
                    "title": this.state.title,
                    "questions": qst ? [...this.state.questions, qst] : this.state.questions
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
                    window.location.href = "/home";
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
            .catch(error => {
                console.log('post comments', error.message);
                alert('Your answer could not be verified\n' + error.message);
            });
    }

    render() {
        return (
            <div className="container">
                <Label >Quiz Title</Label>
                <Input type="text" id="tile" name="title"
                    onChange={(input) => this.setState({
                        title: input.target.value
                    })} />

                <div className="col-10 p-0">
                    <Label>Question</Label>
                    <Input type="text" id="tile" name="title" value={this.state.question}
                        onChange={(input) => this.setState({
                            question: input.target.value
                        })} />
                    <div className="col-10 p-0">
                        <Label>Variant 1</Label>
                        <Input type="text" id="ans1" name="ans1" value={this.state.ans1}
                            onChange={(input) => this.setState({
                                ans1: input.target.value
                            })} />

                        <Label>Variant 2</Label>
                        <Input type="text" id="ans2" name="ans2" value={this.state.ans2}
                            onChange={(input) => this.setState({
                                ans2: input.target.value
                            })} />

                        <Label>Variant 3</Label>
                        <Input type="text" id="ans3" name="ans3" value={this.state.ans3}
                            onChange={(input) => this.setState({
                                ans3: input.target.value
                            })} />

                        <Label>Variant 4</Label>
                        <Input type="text" id="ans4" name="ans4" value={this.state.ans4}
                            onChange={(input) => this.setState({
                                ans4: input.target.value
                            })} />

                        <Label>Correct Variant</Label>
                        <Input type="number" min="1" max="4" id="corectAns" name="corectAns" value={this.state.corectAns}
                            onChange={(input) => this.setState({
                                corectAns: input.target.value
                            })} />

                        <Button
                            className="mt-2 mb-2"
                            color="grey"
                            onClick={this.addQuestion}>Add question
                        </Button>
                    </div>
                </div>

                <Button type="submit"
                    value="submit"
                    color="secondary"
                    onClick={this.addQuiz}>
                    Submit
                </Button>
            </div>
        );
    }
}

export default QuizCreate;
import React, { Component } from "react";
import
{
    Navbar, Nav, NavbarToggler, Collapse, NavItem,
    Button, Modal, ModalHeader, ModalBody, Input, Label
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import {checkToken} from '../redux/ActionCreators';



class Header extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            isNavOpen: false,
            isModalOpen: false,
            name: "",
            surname: ""
        }

        checkToken();
        this.toggleNav = this.toggleNav.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
        this.getElement = this.getElement.bind(this);
        this.logOut = this.logOut.bind(this);
    }

    toggleNav()
    {
        this.setState({
            isNavOpen: !this.state.isNavOpen
        });
    }

    toggleModal()
    {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleLogin()
    {
        fetch('https://pure-caverns-82881.herokuapp.com/api/v54/users', {
            headers: {
                "Accept": "*/*",
                "Connection": "keep-alive",
                "X-Access-Token": localStorage.getItem("token")
            },
        })
            .then(response =>
            {
                if (response.ok)
                {
                    return response;
                } else
                {
                    var error = new Error('Error ' + response.status + ': ' + response.statusText);
                    error.response = response;
                    throw error;
                }
            },
                error =>
                {
                    var errors = new Error(error.message);
                    throw errors;
                })
            .then(response => response.json())
            .then(response =>
            {
                
                var index = response.findIndex((e) =>
                {
                    return e.name === this.state.name && e.surname === this.state.surname
                });

                if (index === -1)
                {
                    throw new Error('Invalid credentials');
                }

                localStorage.setItem(
                    "username", response[index].name,
                );
                localStorage.setItem(
                    "userId", response[index].id
                );

                this.toggleModal();
                window.location.href ="/home";
            })
            .catch(error =>
            {
                alert(error.message);
            });
    }


    handleSignUp()
    {
        fetch('https://pure-caverns-82881.herokuapp.com/api/v54/users/', {
            method: "POST",
            body: JSON.stringify({
                "data": {
                    "name": this.state.name,
                    "surname": this.state.surname
                }
            }),
            headers: {
                'Content-Type': 'application/json',
                "Accept": "*/*",
                "Connection": "keep-alive",
                "X-Access-Token": localStorage.getItem("token")
            },
        })
            .then(response =>
            {
                if (response.ok)
                {
                    return response;
                } else
                {
                    var error = new Error('Error ' + response.status + ': ' + response.statusText);
                    error.response = response;
                    throw error;
                }
            },
                error =>
                {
                    throw error;
                })
            .then(response => response.json())
            .then(response =>
            {
                localStorage.setItem(
                    "username", response.name,
                );
                localStorage.setItem(
                    "userId", response.id
                )
                this.toggleModal();
                window.location.href ="/home";
            })
            .catch(error =>
            {
                alert(error.message);
            });
    }

    logOut()
    {
        this.setState({
            name: "",
            surname: ""
        });
        localStorage.removeItem("username");
        localStorage.removeItem("userId");
    }

    getElement()
    {
        let element;
        if (localStorage.getItem("userId"))
        {
            element = (
                <div>
                    <Button onClick={this.logOut}><span className="fa fa fa-lg"></span> LogOut </Button>
                </div>
            );
        } else
        {
            element = (<Button outline onClick={this.toggleModal}><span className="fa fa fa-lg"></span> Login</Button>);
        }
        return element;
    }

    render()
    {
        return (<>
            <Navbar dark expand="md">
                <div className="container">
                    <NavbarToggler onClick={this.toggleNav} />
                    <Collapse navbar isOpen={this.state.isNavOpen}>
                        <Nav navbar className='m-auto'>
                            <NavItem>
                                <NavLink className="nav-link" to="/home">
                                    <span className="fa fa fa-lg" ></span> Quizzes
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className="nav-link" to="/create">
                                    <span className="fa fa fa-lg" ></span> Add Quiz
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <Nav className="m-auto" navbar>
                            <NavItem>
                                {this.getElement()}
                            </NavItem>
                        </Nav>
                    </Collapse>
                </div>
            </Navbar>
            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>Login</ModalHeader>
                <ModalBody>
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input type="text" id="name" name="name"
                            onChange={(input) => this.setState({
                                name: input.target.value
                            })} />
                        <Label htmlFor="surname">Surname</Label>
                        <Input id="surname" name="surname"
                            onChange={(input) => this.setState({
                                surname: input.target.value
                            })} />
                        <Button disabled={this.state.name === "" || this.state.surname === ""} color="blue" className="mt-2 mb-2 mr-2" onClick={this.handleLogin}>Login</Button>
                        <Button disabled={this.state.name === "" || this.state.surname === ""} color="blue" className="mt-2 mb-2 ml-2" onClick={this.handleSignUp}>Sign Up</Button>
                    </div>
                </ModalBody>
            </Modal>
        </>)
    }
}

export default Header;
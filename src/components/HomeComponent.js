import React from "react";
import { Card, CardBody, CardTitle, Button, CardImg } from 'reactstrap';
import { Link } from 'react-router-dom';

function RenderCard({ item })
{
    if (item !== null && item !== undefined)
    {
        return (
            <div className="col-12 col-md m-1 quiz-container" >
                {
                    item.map((i, index) => (
                        <div className="quiz-item m-2" key={i.title + index}>
                            <Card >
                            <CardImg variant="top" src="mark.png" />
                                <CardBody>
                                    <CardTitle>{i.title}</CardTitle>
                                    <Link to={`/home/${i.id}`}>
                                    <Button variant="primary">Take Quiz</Button>
                                    </Link>
                                </CardBody>
                            </Card></div>
                    ))
                }
            </div>
        );
    } else return (<div></div>);
}

function Home(props)
{
    return (
        <div className="container">
                <div className="col-12 col-md m-1">
                    <RenderCard item={props.quizes} />
                </div>
        </div>
    );
}

export default Home;
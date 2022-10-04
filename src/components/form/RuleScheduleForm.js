import React, {useState} from 'react';
import {Button, Col, Container, Form, Row} from 'react-bootstrap';


export const RuleScheduleForm = (props) => {


    const onCancel = () => {
        console.log("Calling onCancel()");
        props.onCancel();
    }

    const onSubmit = () => {
        console.log("Calling onSubmit()");
        //props.onSubmit(studyArea);
    }

    return (
        <>
            <Container fluid="true" >
                <Row>
                    <Col className="pt-3 pb-0 pl-0 pr-0">
                        <Form>

                        </Form>
                    </Col>
                </Row>
                <Row><Col className="pt-3 pb-3 pl-3 pr-3">
                    <Button size="sm" variant="secondary" onClick={onCancel} className="m-1">Cancel</Button>
                    <Button size="sm" variant="secondary" onClick={onSubmit} className="m-1">Submit</Button>
                </Col></Row>
            </Container>
        </>
    );
}

export default RuleScheduleForm;
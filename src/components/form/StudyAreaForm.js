import React, {useState} from 'react';
import {Button, Col, Container, Form, Row} from 'react-bootstrap';


export const StudyAreaForm = (props) => {

    const [studyArea, setStudyArea] = useState(props.studyArea);

    const onFormFieldChange = (event) => {
        setStudyArea({
            ...studyArea,
            [event.target.name]: event.target.value
        });
    }

    const onCancel = () => {
        console.log("Calling onCancel()");
        props.onCancel();
    }

    const onSubmit = () => {
        console.log("Calling onSubmit()");
        props.onSubmit(studyArea);
    }

    return (
        <>
            <Container fluid="true" >
                <Row>
                    <Col className="pt-3 pb-0 pl-0 pr-0">
                        <Form>
                            <Form.Group className="mb-3" controlId="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    name="name"
                                    type="text"
                                    placeholder="Enter Name"
                                    value={studyArea.name}
                                    onChange={onFormFieldChange}
                                    size="sm"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="latitude">
                                <Form.Label>Latitude</Form.Label>
                                <Form.Control
                                    name="lat"
                                    type="text"
                                    placeholder="Enter Latitude"
                                    value={studyArea.lat}
                                    onChange={onFormFieldChange}
                                    size="sm"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="longitude">
                                <Form.Label>Longitude</Form.Label>
                                <Form.Control
                                    name="lon"
                                    type="text"
                                    placeholder="Enter Longitude"
                                    value={studyArea.lon}
                                    onChange={onFormFieldChange}
                                    size="sm"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="radius">
                                <Form.Label>Radius (km)</Form.Label>
                                <Form.Control
                                    name="radius"
                                    type="text"
                                    placeholder="Enter Radius in Kilometers"
                                    value={studyArea.radius}
                                    onChange={onFormFieldChange}
                                    size="sm"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="startDate">
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control
                                    name="startDate"
                                    type="date"
                                    placeholder="Enter Start Date"
                                    value={studyArea.startDate}
                                    onChange={onFormFieldChange}
                                    size="sm"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="endDate">
                                <Form.Label>End Date</Form.Label>
                                <Form.Control
                                    name="endDate"
                                    type="date"
                                    placeholder="Enter End Date"
                                    value={studyArea.endDate}
                                    onChange={onFormFieldChange}
                                    size="sm"
                                />
                            </Form.Group>
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

export default StudyAreaForm;
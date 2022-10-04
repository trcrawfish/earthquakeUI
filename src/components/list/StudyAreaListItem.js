import React from 'react';
import {Col, Container, ListGroup, Row} from 'react-bootstrap';

export const StudyAreaListItem = (props) => {

    return (
        <>
            <Container fluid="true">
                <Row>
                    <Col md={12}><h5>{props.studyArea.name}</h5></Col>
                </Row>
                <Row>
                    <Col md={6}><small>Latitude: {props.studyArea.lat}</small></Col>
                    <Col md={6}><small>Longitude: {props.studyArea.lon}</small></Col>
                </Row>
                <Row>
                    <Col md={12}><small>Radius (km): {props.studyArea.radius}</small></Col>
                </Row>
                <Row>
                    <Col md={6}><small>From: {props.studyArea.startDate}</small></Col>
                    <Col md={6}><small>To: {props.studyArea.endDate}</small></Col>
                </Row>
            </Container>
        </>
    );
}

export default StudyAreaListItem;
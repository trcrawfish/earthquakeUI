import React, {useState} from 'react';
import {StudyAreaForm} from '../form/StudyAreaForm'
import {Button, Col, Container, Row, ListGroup, Modal, Tab} from 'react-bootstrap';
import {WebMap} from '../map/WebMap';
import StudyAreaListItem from '../list/StudyAreaListItem';

export const StudyAreaView = () => {

    const [studyAreas, setStudyAreas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formState, setFormState] = useState("new");
    const [nextId, setNextId] = useState(0);
    const [selectedArea, setSelectedArea] = useState(null);

    const newStudyArea = () => {
        return {
            id : nextId,
            name: "",
            lat: "",
            lon: "",
            radius: "",
            startDate: "",
            endDate: ""
        };
    }

    const onSelectStudyArea = (target) => {
        console.log(target.name);
       //console.log("Calling onSelectStudyArea() for " + studyArea.name);
    }

    const getStudyAreaItems = () => {
        let items = [];
        studyAreas.forEach(element => items.push(
            <ListGroup.Item eventKey={element.id} key={element.id} action onClick={() => onSelectStudyArea(element)}>
                <StudyAreaListItem studyArea={element}/>
            </ListGroup.Item>
        ));
        return items;
    }

    const onCloseModal = () => setShowModal(false);

    const onSubmitStudyArea = (studyArea) => {
        onCloseModal();
        console.log("Calling onSubmitStudyArea()")
        console.log(studyArea);
        setStudyAreas([...studyAreas, studyArea]);
        WebMap.addGeoJsonLayer(studyArea);
    }

    const onCreateStudyArea = () => {
        console.log("Calling onCreateStudyArea()")
        let id = nextId;
        setNextId(++id); // increment next id
        setFormState("new");
        setShowModal(true);
    }

    const onEditStudyArea = () => {
        setFormState("edit");
        setShowModal(true);
    }

    const onDeleteStudyArea = () => {

    }

    return (
        <>
            <Modal
                size="lg"
                show={showModal}
                onHide={onCloseModal}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header>
                    <Modal.Title>{(formState === "new")?"Create Study Area":"Edit Study Area"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <StudyAreaForm studyArea={newStudyArea()} onCancel={onCloseModal} onSubmit={onSubmitStudyArea}/>
                </Modal.Body>
            </Modal>
            <Container fluid="true">
                <Row><Col className="pt-3 pb-3 pl-3 pr-3">
                    <ListGroup>
                        {getStudyAreaItems()}
                    </ListGroup>
                </Col></Row>
                <Row><Col>
                    <Button size="sm" variant="secondary" onClick={onCreateStudyArea} className="m-1">New</Button>
                    <Button size="sm" variant="secondary" onClick={onEditStudyArea} className="m-1" disabled>Edit</Button>
                    <Button size="sm" variant="secondary" onClick={onDeleteStudyArea} className="m-1" disabled>Delete</Button>
                </Col></Row>
            </Container>
        </>
    );
}

export default StudyAreaView;
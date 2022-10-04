import React from 'react';
import { WebMapView } from './map/WebMapView';
import {Container, Row, Col} from 'react-bootstrap'
import Navbar from 'react-bootstrap/Navbar'
import TabbedSidebar from './sidebar/TabbedSidebar'

export const MapDemoView = () => {


	return (   
        <>
              <Container fluid="true">
                    <Navbar bg="dark" variant="dark">
                        <Navbar.Brand>
                            &nbsp;&nbsp;<img alt="" src="/logo512.png" width="30" height="30" className="d-inline-block align-top"/>
                            &nbsp;&nbsp; USGS Earthquake Monitor
                        </Navbar.Brand>
                    </Navbar>
                    <Row>
                        <Col lg={3}>
                            <TabbedSidebar/>
                        </Col>
                        <Col lg={9}><WebMapView/></Col>
                    </Row>
              </Container>
        </>
	);	
};

export default MapDemoView;
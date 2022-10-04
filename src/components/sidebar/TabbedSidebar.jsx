import React from 'react';
import {Container, Tab, Tabs} from 'react-bootstrap';
import {StudyAreaView} from './StudyAreaView'


export const TabbedSidebar = () => {

	return (   
        <>
              <Container >
                    <Tabs defaultActiveKey="locations" id="uncontrolled-tab-example">
                        <Tab eventKey="study-area" title="Study Areas">
                            <StudyAreaView/>
                        </Tab>
                        <Tab eventKey="notifications" title="Notifications">

                        </Tab>
                    </Tabs>
              </Container>
        </>
	);	
}

export default TabbedSidebar;
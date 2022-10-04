import React, { useState } from 'react';
import {Container, Row, Col, Form, Button } from 'react-bootstrap'

export const LocationForm = (props) => {

	const [location, setLocation] = useState(props.location);
	
	const onFormFieldChange = (event) => {
		setLocation({
        ...location,
        [event.target.name]: event.target.value
    });
	}

	const onAddressChange = (event) => {
		setLocation({
        ...location, address : { ...location.address ,
        [event.target.name]: event.target.value }
    });
	}

	const onCancel = () => {
		props.cancel();
	}

	const onSubmit = () => {
		props.submit(location);
	}

	return (   
    <>
			<Container fluid className="pt-3 pb-3 pl-3 pr-3">
				<Row>
					<Col>
						<Form>
               <Form.Group controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    name="name"
                    type="text"
                    placeholder="Enter Name"
                    value={location.name}
										onChange={onFormFieldChange}
										size="sm"
                  />
                </Form.Group>
                <Form.Group controlId="street">
                  <Form.Label>Street</Form.Label>
                  <Form.Control
                    name="street"
                    type="text"
                    placeholder="Enter Street"
                    value={location.address.street}
										onChange={onAddressChange}
										size="sm"
                  />
                </Form.Group>
                <Form.Group controlId="city">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    name="city"
                    type="text"
                    placeholder="Enter City"
                    value={location.address.city}
										onChange={onAddressChange}
										size="sm"
                  />
                </Form.Group>
                <Form.Group controlId="state">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    name="state"
                    type="text"
                    placeholder="Enter State"
                    value={location.address.state}
										onChange={onAddressChange}
										size="sm"
                  />
                </Form.Group>
								<Form.Group controlId="zipcode">
                  <Form.Label>Zip</Form.Label>
                  <Form.Control
                    name="zipcode"
                    type="text"
                    placeholder="Enter Zip"
                    value={location.address.zipcode}
										onChange={onAddressChange}
										size="sm"
                  />
                </Form.Group>
								{/*
                <Form.Group controlId="latitude">
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control
                    name="latitiude"
                    type="text"
                    placeholder="Enter Latitude"
                    value={location.lat}
										onChange={onFormFieldChange}
										size="sm"
                  />
                </Form.Group>
								<Form.Group controlId="longitude">
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control
                    name="longitude"
                    type="text"
                    placeholder="Enter Longitude"
                    value={location.lon}
										onChange={onFormFieldChange}
										size="sm"
                  />
								</Form.Group> 
								*/}
						</Form>
					</Col>
				</Row>
				<Row><Col className="pt-3 pb-3 pl-3 pr-3">
					<Button size="sm" variant="secondary" onClick={onSubmit} className="mr-1">Submit</Button>
          <Button size="sm" variant="secondary" onClick={onCancel} className="mr-1">Cancel</Button>
				</Col></Row>
			</Container>   
    </>
	);	

}

export default LocationForm;
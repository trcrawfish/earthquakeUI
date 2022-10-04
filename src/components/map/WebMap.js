import { loadModules } from 'esri-loader';
import './webmap.scss'
import {zipTemplate, locationTemplate, drivetimeTemplate} from './PopupTemplates'


let publicFunctions; // set when loadModules returns

export const WebMap = {
	init,
	addFeatureLayer,
    addGeoJsonLayer,
	addMarker,
	removeMarker,
	getMarker, 
	getGraphicBuffer,
	addBuffer, 
	selectFeatures,
	selectFeaturesByDistance,
	clearSelection,
	addDrivetimeBuffer,
	geocodeAddress,
	getScreenshot,
    refreshGeoJsonLayer
};

function init(mapRef, center, zoom) {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(['esri/Map', 'esri/views/MapView', "esri/layers/FeatureLayer", "esri/layers/GraphicsLayer", "esri/Graphic",
        "esri/geometry/Extent", "esri/geometry/SpatialReference", "esri/geometry/support/webMercatorUtils", "esri/core/lang",
        "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/renderers/SimpleRenderer", "esri/geometry/Multipoint",
        "esri/Color", "dojo/number", "dojo/dom-style", "esri/geometry/Point", "esri/geometry/Polygon", "esri/geometry/geometryEngine",
        "dijit/TooltipDialog", "dijit/popup", "esri/views/ui/UI", "esri/core/promiseUtils", "esri/tasks/Locator", "esri/layers/GeoJSONLayer",
        "esri/widgets/TimeSlider", "esri/layers/support/TimeInfo", "esri/views/layers/LayerView", "esri/widgets/Expand",
        "dojo/domReady!"], {css: true})
    .then(([ArcGISMap, MapView, FeatureLayer, GraphicsLayer, Graphic,
               Extent, SpatialReference, webMercatorUtils, esriLang,
               SimpleFillSymbol, SimpleLineSymbol, SimpleRenderer, Multipoint,
               Color, number, domStyle, Point, Polygon, geometryEngine,
               TooltipDialog, dijitPopup, UI, promiseUtils, Locator, GeoJSONLayer,
               TimeSlider, TimeInfo, LayerView, Expand]) => {

        let layerView;

        function createGeojsonLayer(url, title) {
            return new GeoJSONLayer({
                url: url,
                copyright: "USGS Earthquakes",
                title: title,
                // set the CSVLayer's timeInfo based on the date field
                timeInfo: {
                    startField: "time", // name of the date field
                    interval: {
                        // set time interval to one day
                        unit: "days",
                        value: 1
                    }
                },
                renderer: {
                    type: "simple",
                    field: "mag",
                    symbol: {
                        type: "simple-marker",
                        color: "orange",
                        outline: {
                            color: "white"
                        }
                    },
                    visualVariables: [
                        {
                            type: "size",
                            field: "mag",
                            stops: [
                                {
                                    value: 1,
                                    size: "5px"
                                },
                                {
                                    value: 2,
                                    size: "15px"
                                },
                                {
                                    value: 3,
                                    size: "35px"
                                }
                            ]
                        },
                        {
                            type: "color",
                            field: "mag",
                            stops: [
                                {
                                    value: 2.5,
                                    color: "#F9C653",
                                    label: "< 3.5 mag"
                                },
                                {
                                    value: 3.5,
                                    color: "#F8864D",
                                    label: "> 3.5 mag"
                                },
                                {
                                    value: 5,
                                    color: "#C53C06",
                                    label: "> 5.0 mag"
                                }
                            ]
                        }
                    ]
                },
                popupTemplate: {
                    title: "{title}",
                    content: [
                        {
                            type: "fields",
                            fieldInfos: [
                                {
                                    fieldName: "place",
                                    label: "Location",
                                    visible: true
                                },
                                {
                                    fieldName: "time",
                                    label: "Time",
                                    format: {
                                        dateFormat: "short-date-short-time"
                                    }
                                },
                                {
                                    fieldName: "mag",
                                    label: "Magnitude",
                                    visible: true
                                }
                            ]
                        }
                    ]
                }
            });
        }

        const map = new ArcGISMap({
            basemap: 'topo-vector'
        });
        // load the map view at the ref's DOM node
        const view = new MapView({
            container: mapRef.current,
            map: map,
            center: center,
            zoom: zoom,
            highlightOptions: {
                color: "#424E56",
                fillOpacity: 0
            }
        });
        // the selected feature layer
        var selectedLayer;
        // the selected layer view
        var selectedLayerView;
        var selectedGraphic;
        // create a new time slider widget
        // set other properties when the layer view is loaded
        // by default timeSlider.mode is "time-window" - shows
        // data falls within time range
        /*
        const timeSlider = new TimeSlider({
            container: "timeSlider",
            playRate: 50,
            stops: {
                interval: {
                    value: 1,
                    unit: "hours"
                }
            }
        });
        view.ui.add(timeSlider, "bottom-left");
        // wait till the layer view is loaded
        view.whenLayerView(geojsonLayer).then((lv) => {
            layerView = lv;
            // start time of the time slider - 5/25/2019
            const start = new Date(2021, 8, 1);
            // set time slider's full extent to
            // 5/25/5019 - until end date of layer's fullTimeExtent
            timeSlider.fullTimeExtent = {
                start: start,
                end: geojsonLayer.timeInfo.fullTimeExtent.end
            };
            // We will be showing earthquakes with one day interval
            // when the app is loaded we will show earthquakes that
            // happened between 5/25 - 5/26.
            let end = new Date();
            // end of current time extent for time slider
            // showing earthquakes with one day interval
            //end.setDate(end.getDate() + 12);
            // timeExtent property is set so that timeslider
            // widget show the first day. We are setting
            // the thumbs positions.
            timeSlider.timeExtent = {start, end};
        });

        // watch for TimeSlider timeExtent change
        timeSlider.watch("timeExtent", () => {
            // gray out earthquakes that are outside of the current timeExtent
            layerView.effect = {
                filter: {
                    timeExtent: timeSlider.timeExtent,
                    geometry: view.extent
                },
                excludedEffect: "grayscale(20%) opacity(12%)"
            };
        });
        */

		// set up info display
		view.ui.add("info", "top-right");
		document.getElementById("info").style.opacity = "1";
		document.getElementById("info").style.backgroundColor = "white";

		view.ui.padding = { top: 50, left: 15, right: 15, bottom: 15 };

		view.popup = {
            dockEnabled: true,
            dockOptions: {
                // Disables the dock button from the popup
                buttonEnabled: false,
                // Ignore the default sizes that trigger responsive docking
                breakpoint: true
            }
		};

		// remove zoom action from popup
		view.popup.actions = {
			zoomTo: false
		};

		map.add(new GraphicsLayer({ id: "selectedLayer" }));
		//map.add(new GraphicsLayer({ id: "markerLayer" }));

		// Attach view event handlers
		view.on("immediate-click", function(event) {
			view.hitTest(event).then(onSelectGraphic);
		});

		view.on("pointer-down", function(event) {
			view.hitTest(event).then(getGraphic);
		});

		//view.on("pointer-up", function(event) {

		//});
        /*
		view.on("pointer-move", function(event) {
			view.hitTest(event).then(getGraphics);
		});
        */
		view.on("pointer-leave", function(event) {
			if (highlight) {
				highlight.remove();
			}	
			document.getElementById("info").style.visibility = "hidden"; 
		});

		view.on("drag", function(event) {			
			if (selectedGraphic && selectedGraphic.attributes.Type === 'radius') {		
				if (event.action === "start") {
					console.log("drag state", event.action);
					document.getElementById("webmap").style.cursor = "grabbing";
				} else if (event.action === "end") {
					document.getElementById("webmap").style.cursor = "default";
					clearSelectedFeatures();
					selectedGraphic = null;
					return;
				} 
				// prevent default panning
				event.stopPropagation()	;		
				onRadiusDrag(event, selectedGraphic);
			}			
		});
		
		// listen for layer added event 
		view.map.allLayers.on("change", function(event) {
			// change event fires after an item has been added, moved or removed from the collection.
			// event.moved - an array of moved layers
			// event.removed - an array of removed layers
			// event.added returns an array of added layers
			if (event.added.length === 1) {  // catch the first Feature layer loaded
				event.added.forEach(function(layer) {
					if ( layer instanceof FeatureLayer) {
						console.log("Layer added: " + layer.id);
						/*
						view.on("pointer-move", function(event) { 
							view.hitTest(event).then(getGraphics);
						}); */
					}
				});
			}
		});

		function removeGraphic(graphic) {
			view.graphics.forEach(g => {
				if (g.attributes.id === graphic.attributes.id && g.attributes.Type === 'radius') {
					view.graphics.remove(g);
				}
			});
		}

		function getGraphic(response) {
			if (response.results.length > 1) {
				const graphic = response.results.filter(function() {				
				return true; //result.graphic.layer === selectedLayer;
				})[0].graphic;

				selectedGraphic = graphic;
			}
		}

		function onRadiusDrag(event, graphic) {
			// convert screen coordinates to map coordinates
			const point = view.toMap({
				x: event.x,
				y: event.y,
			});
			const pointA = webMercatorUtils.webMercatorToGeographic(point);
			const pointB = graphic.geometry.extent.center;
			//console.log(point);
			const line = {
				type: "polyline", // autocasts as new Polyline()
				paths: [[
					[pointA.x, pointA.y],
					[pointB.x, pointB.y]
				]],
				spatialReference: { wkid: 4326 }
			}

			const distance = geometryEngine.geodesicLength(line, 'miles');
			//console.log(distance);
			graphic.attributes.Label = distance.toFixed(1) + " mile radius";
			//view.graphics.removeAll();
			removeGraphic(graphic);
			graphic.attributes.distance = distance;
			addBuffer(graphic.attributes.lat, graphic.attributes.lon, graphic.attributes, graphic.attributes.color, distance, graphic.attributes.units);
			document.getElementById("label").innerHTML = graphic.attributes.Label;				
		}

		function onSelectGraphic(response) {

		}

		/********************************************  handle highlight/info on hover  **********************************************/

	let highlight, currentId;

	function getGraphics(response) {
		// use the topmost graphic from the selected layer and display attribute values
		if (response.results.length > 1) {
			const graphic = response.results.filter(function(result) {				
				return true; //result.graphic.layer === selectedLayer;
			})[0].graphic;

			const attributes = graphic.attributes;
			const id = attributes.Id;
			const label = attributes.Label;

			if (highlight && (currentId !== id)) {
					highlight.remove();
					highlight = null;
					return;
			}

			if (highlight) {
					return;
			}

			document.getElementById("info").style.visibility = "visible";
			//document.getElementById("id").innerHTML = "Id: " + id;
			document.getElementById("label").innerHTML = label;

			if ( graphic.layer instanceof FeatureLayer) {
				view.popup.close();
				// highlight all features belonging to the feature returned from the hitTest
				const query = selectedLayer.createQuery();
				query.where = "Id = '" + id + "'"; // + " AND Name = '" + name + "'";
				selectedLayer.queryObjectIds(query).then(function(ids) {
						if (highlight) {
								highlight.remove(ids);
						}
						highlight = selectedLayerView.highlight(ids);
						currentId = id;
				});
			} else {
				/*
				if (graphic.attributes.Type === "marker") {
					view.popup.open({
					title: label,
					location: (graphic.geometry.type === 'point')?graphic.geometry:graphic.geometry.extent.center
				})}; */
			} 	
		} else {
			view.popup.close();
			// remove the highlight if no features are returned from the hitTest
			if (highlight) {
					highlight.remove();
			}
			highlight = null;
			if (selectedGraphic === null) document.getElementById("info").style.visibility = "hidden";
		}		
	}

		function setLayerSelected(layerId) {
			map.layers.forEach(element => {
				if (element instanceof FeatureLayer) {
					if (element.id === layerId.toString()) {
						element.visible = true;
						selectedLayer = element; // set as selected layer
						view.whenLayerView(selectedLayer)
						.then(function(layerView) {
								selectedLayerView = layerView;                       
						})
						.catch(function(error) {
								console.log(error);
						}); 
					} else {
						element.visible = false;
					}
				}
			});
		}

		/**
		 *  load feature layer if not previously loaded and set as selected layer
		 *  ex. addFeatureLayer("https://services8.arcgis.com/FgePhnf5o6dOTOMn/arcgis/rest/services/DenverZips/FeatureServer/0", "1", "#000000", callback);
		 */       
		function addFeatureLayer(url, layerId, outlineColor,visible, callback) {
			let layer = map.findLayerById(layerId.toString()) // look for layer = returns undefined if layer not found
			if (layer === undefined) { // add new layer
				const renderer = { // define renderer
					type: "simple",
					symbol: {
						type: "simple-fill",  
						style: "none", // transparent background
						outline: {  
						color: outlineColor,
						width: "0.50px"
						}
					}
				};
				layer = new FeatureLayer(url, { 
					id: layerId,        
					outFields: ["*"],
					renderer: renderer,
					popupTemplate: zipTemplate
				});
				// add layer to map
				map.add(layer);
				layer.visible = visible;
				layer.when( function(event) { // event is the event handle returned after the event fires.
					//console.log("Feature layer with layerId: " + layer.id + " has been sucessfully loaded");
					selectedLayer = layer;
					view.whenLayerView(selectedLayer)
					.then(function(layerView) {
						selectedLayerView = layerView; 
						if (visible) setLayerSelected(layerId); 
						if (callback) callback();                     
					})
					.catch(function(error) {
						console.log(error);
					}); 
				}, function(error) { // This function will execute if the promise is rejected due to an error
					console.log("Error loading feature layer with layerId: " + layer.id );
				});               
			} else { // set layer visible
				//console.log("Feature layer with layerId: " + layer.id + " has been previously loaded");
				if (visible) setLayerSelected(layerId);
				if (callback) callback();
			}
		}

		function addMarker(lat, lon, attributes, color, outlineColor) {
			const point = {
				type: "point", // autocasts as new Point()
				longitude: lon,
				latitude: lat
			};
			const markerSymbol = {
				type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
				color: color,
				size: 10,
				outline: {
					// autocasts as new SimpleLineSymbol()
					color: outlineColor,
					width: 2
				}
			};
			const textSymbol = {
				type: "text",  // autocasts as new TextSymbol()
				color: "black",
				haloColor: "white",
				haloSize: "5px",
				text: attributes.Label,
				xoffset: 3,
				yoffset: 10,
				font: {  // autocasts as new Font()
					size: 12,
					family: "sans-serif",
					weight: "normal"
				}
			};
			const graphic = new Graphic({
				geometry: point,
				symbol: markerSymbol,
				attributes: attributes,
				popupTemplate: locationTemplate
			});
			let modAttributes = {...attributes};
			modAttributes.Type = "label";
			const label = new Graphic({
				geometry: point,
				symbol: textSymbol,
				attributes: modAttributes
			});
			//const graphicsLayer = map.findLayerById("markerLayer");
			//graphicsLayer.add(graphic);
			view.graphics.add(graphic);
			view.graphics.add(label);
		}

		function removeMarker(id) {
			const graphics = [];
			view.graphics.forEach((g) => {
				if (g.attributes.id === id) {
					graphics.push(g)
				}
			});
			view.graphics.removeMany(graphics);
		}

		function getMarker(id) { 
			let marker = null;
			view.graphics.forEach((g) => {
				if (g.attributes.Type === "marker" && g.attributes.id === id) {
					marker =  g.attributes;
				}
			});
			return marker;
		}

		function getGraphicBuffer(id) {
			let buffer = null;
			view.graphics.forEach((g) => {
				if ((g.attributes.Type === "radius" || g.attributes.Type === "drivetime") && g.attributes.id === id) {
					buffer =  g.geometry;
				}
			});
			return buffer;
		}

		function getBuffer(lat, lon, distance, units) {
			const mapPoint = new Point(lon, lat, new SpatialReference({ wkid: 4326 }));
			return geometryEngine.geodesicBuffer(mapPoint, distance, units);
		}

		function addBuffer(lat, lon, attributes, color, distance, units) {				
			const buffer = getBuffer(lat, lon, distance, units);
			const polyline = {
				type: "polyline",
				paths: buffer.rings[0],
			}	
			const lineSymbol = {
				type: "simple-line",
				color: color,
				width: 2
			};
			const graphic = new Graphic({
				geometry: polyline,
				symbol: lineSymbol,
				attributes: attributes
			});
			//const graphicsLayer = map.findLayerById("markerLayer");
			//graphicsLayer.add(graphic);
			view.graphics.add(graphic);
		}

		function addDrivetimeBuffer(attributes, geometry, color) {
			const polyline = {
				type: "polyline",
				paths: geometry.rings[0],
			}	
			const lineSymbol = {
				type: "simple-line",
				color: color,
				width: 2
			};
			const graphic = new Graphic({
				geometry: polyline,
				symbol: lineSymbol,
				attributes: attributes,
				popupTemplate: drivetimeTemplate
			});
			//const graphicsLayer = map.findLayerById("markerLayer");
			//graphicsLayer.add(graphic);
			view.graphics.add(graphic);	
		}

		function queryFeatures(layerId, locations, buffers) {
			const layer = map.findLayerById(layerId);
			if (layer) {
				const polygons = [];
				buffers.forEach(buffer => { // convert to polygon
					const poly = {
						type:"polygon",
						rings: buffer.paths,
						spatialReference: { wkid: 4326 }
					}
					polygons.push(poly);
				});
				const union = geometryEngine.union(polygons);				
				selectedLayer.queryFeatures({
					//query object
					geometry: union,
					spatialRelationship: "intersects",
					returnGeometry: true,
					outFields: ["*"],
				}).then(function(featureSet) {
					featureSet.features.map(feature => {
						const loc = findClosestLocation(feature, locations);
						var color = new Color(loc.color);
						color.a = .25; // set alpha value
						const symbol = {
							type: "simple-fill",  // autocasts as new SimpleFillSymbol()
							color: color,
							style: "solid",
							outline: {  // autocasts as new SimpleLineSymbol()
								color: "black",
								width: 1
							}
						};
						const graphic = new Graphic({
							geometry: feature.geometry,
							symbol: symbol, 
							attributes: feature.attributes
						});
						const graphicsLayer = map.findLayerById("selectedLayer");
						graphicsLayer.add(graphic);
						return feature;
					}); 
				});
			}
		}

		function queryFeaturesByDistance(layerId, locations, distance, units) {
			const layer = map.findLayerById(layerId); // get feature layer
			if (layer) {
				let multipoint = new Multipoint();
				locations.forEach(location => {
					const point = new Point(location.lon, location.lat, new SpatialReference({ wkid: 4326 }));
					multipoint.addPoint(point);
				});
				selectedLayer.queryFeatures({
					//query object
					geometry: multipoint,
					distance: distance,
					units: units,
					spatialRelationship: "intersects",
					returnGeometry: true,
					outFields: ["*"],
				}).then(function(featureSet) {
					featureSet.features.map(feature => {
						const loc = findClosestLocation(feature, locations);
						var color = new Color(loc.color);
						color.a = .25; // set alpha value
						const symbol = {
							type: "simple-fill",  // autocasts as new SimpleFillSymbol()
							color: color,
							style: "solid",
							outline: {  // autocasts as new SimpleLineSymbol()
								color: "black",
								width: 1
							}
						};
						const graphic = new Graphic({
							geometry: feature.geometry,
							symbol: symbol, 
							attributes: feature.attributes
						});
						const graphicsLayer = map.findLayerById("selectedLayer");
						graphicsLayer.add(graphic);
						return feature;
					}); 
				});
			}
		}

		function findClosestLocation(feature, locations) {
			let result = null;
			let distance = 0;
			locations.forEach((location) => {
				if (result === null) { // first time 
					distance = getGeodesicDistance({x:location.lon,y:location.lat}, {x:feature.attributes.CLon,y:feature.attributes.CLat});
					result = location;
				} else {
					const dist = getGeodesicDistance({x:location.lon,y:location.lat}, {x:feature.attributes.CLon,y:feature.attributes.CLat})
					if (dist < distance) {
						distance = dist;
						result = location;
					}
				}
			});
			return result;
		}

		function getGeodesicDistance(pointA, pointB) {
			const line = {
				type: "polyline",
				paths: [[
					[pointA.x, pointA.y],
					[pointB.x, pointB.y]
				]],
				spatialReference: { wkid: 4326 }
			}
			return geometryEngine.geodesicLength(line, 'miles');
		}

		function clearSelectedFeatures() {
			const layer = map.findLayerById("selectedLayer");
			if (layer) {
				layer.removeAll();
			}
		}

		function geocodeAddress(address, callback) {
			 // Set up a locator task using the world geocoding service
      const locatorTask = new Locator({
        url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
			});
			locatorTask.addressToLocations({address}).then(function(response) {
				view.popup.content = response.address;
				callback(response);
			});
		}

		function getScreenshot(callback) {
			view.takeScreenshot().then(function(screenshot) {
  		//var imageElement = document.getElementById("screenshotImage");
  		callback(screenshot.dataUrl);
			});
		}

        function addGeoJsonLayer(studyArea) {
            let url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&maxradiuskm=" + studyArea.radius
                      + "&latitude=" + studyArea.lat + "&longitude=" + studyArea.lon + "&starttime=" + studyArea.startDate;
            map.add(createGeojsonLayer(url, studyArea.name));
            addMarker(studyArea.lat, studyArea.lon, {Label:studyArea.name,name:studyArea.name,lat:studyArea.lat,lon:studyArea.lon}, "#6699FF", "#000000");
            addBuffer(studyArea.lat, studyArea.lon, {Label:studyArea.name}, "#6699FF", studyArea.radius, "kilometers");
        }

        function refreshGeoJsonLayer(studyArea) {
            console.log("Calling refreshGeoJsonLayer()");
            const layer = map.layers.find(function(layer) {
                return layer.title === studyArea.name;
            });
            map.remove(layer);
            addGeoJsonLayer(studyArea);
        }

		return publicFunctions = {addFeatureLayer:addFeatureLayer,
                                addGeoJsonLayer:addGeoJsonLayer,
                                addMarker:addMarker,
                                removeMarker:removeMarker,
                                getMarker:getMarker,
                                getGraphicBuffer:getGraphicBuffer,
                                addBuffer:addBuffer,
                                getBuffer:getBuffer,
                                queryFeatures:queryFeatures,
                                queryFeaturesByDistance:queryFeaturesByDistance,
                                clearSelectedFeatures:clearSelectedFeatures,
                                addDrivetimeBuffer:addDrivetimeBuffer,
                                geocodeAddress:geocodeAddress,
                                getScreenshot:getScreenshot,
                                refreshGeoJsonLayer:refreshGeoJsonLayer};
		});


}

/*************************************************************   export functions  ************************************************************/

function addFeatureLayer(url, layerId, outlineColor,visible, callback) {
	if (publicFunctions) {
		publicFunctions.addFeatureLayer(url, layerId, outlineColor, visible, callback);
	}
}

function addMarker(lat, lon, attributes, color, outlineColor) {
	if (publicFunctions) {
		publicFunctions.addMarker(lat, lon, attributes, color, outlineColor);
	}
}

function removeMarker(id) {
	if (publicFunctions) {
		publicFunctions.removeMarker(id);
	}
}

function addBuffer(lat, lon, attributes, color, distance, units) {
	if (publicFunctions) {
		publicFunctions.addBuffer(lat, lon, attributes, color, distance, units);
	}
}

function selectFeatures(layerId, locations, buffers) {
	if (publicFunctions) {
		publicFunctions.queryFeatures(layerId, locations, buffers);
	}
}

function selectFeaturesByDistance(layerId, locations, distance, units) {
	if (publicFunctions) {
		publicFunctions.queryFeaturesByDistance(layerId, locations, distance, units);
	}
}

function clearSelection() {
	if (publicFunctions) {
		publicFunctions.clearSelectedFeatures();
	}
}

function addDrivetimeBuffer(attributes, geometry, color) {
	if (publicFunctions) {
		publicFunctions.addDrivetimeBuffer(attributes, geometry, color);
	}
}

function geocodeAddress(address, callback) {
	if (publicFunctions) {
		publicFunctions.geocodeAddress(address, callback);
	}
}

function getMarker(id) {
	if (publicFunctions) {
		return publicFunctions.getMarker(id);
	}
}

function getGraphicBuffer(id) {
	if (publicFunctions) {
		return publicFunctions.getGraphicBuffer(id);
	}
}

function getScreenshot(callback) {
	if (publicFunctions) {
		return publicFunctions.getScreenshot(callback);
	}
}

function refreshGeoJsonLayer(studyArea) {
    if (publicFunctions) {
        return publicFunctions.refreshGeoJsonLayer(studyArea);
    }
}

function addGeoJsonLayer(studyArea) {
    if (publicFunctions) {
        return publicFunctions.addGeoJsonLayer(studyArea);
    }
}


import React, { useEffect, useRef} from 'react';
import { WebMap } from './WebMap';
import './webmapview.css'

export const WebMapView = () => {
    const mapRef = useRef();

    useEffect(() => {
        WebMap.init(mapRef, [-112.00, 36.00], 6);
    }, []); // only run once

    return (
        <>
            <div id="webmap" className="webmap" ref={mapRef} />
            <div id={"info"}></div>
        </>
    );
};

export default WebMapView;
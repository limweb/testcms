import React, { useEffect } from 'react'
import * as THREE from 'three/build/three';
import { FroalaView } from './FroalaView';

const hideContainer = {
    display: 'none'
}

function PanoView(props) {

    const { style, className, id, imgSrc, onClick = ()=>{}, infoSpots = [
        {
            html: (<div style></div>),
            id: '',
            coordinate: [-5000.00, -1825.25, 197.56],
            scale: 300,
            delta: 40
        },
    ] } = props
    const containerId = `panorama-container-${id}`
    const hideContainerId = `panorama-hide-container-${id}`


    useEffect(() => {

        const PANOLENS = require('../static/js/panolens/panolens')

        var panorama, viewer, container;
        container = document.getElementById(containerId)
        panorama = new PANOLENS.ImagePanorama(imgSrc)

        infoSpots.forEach(el => {
            const spot = new PANOLENS.Infospot(el.scale, PANOLENS.DataImage.Info)
            spot.position.set(...el.coordinate)
            spot.addHoverElement(document.getElementById(el.id), el.delta)
            panorama.add(spot)
        })

        viewer = new PANOLENS.Viewer({ output: "console", container })
        viewer.add(panorama)

        panorama.addEventListener('click', e => {
            const position = viewer.getPosition()
            onClick({ position, panorama, viewer, PANOLENS })

            // infospot = new PANOLENS.Infospot(2000, 'https://images-na.ssl-images-amazon.com/images/I/91nELBuo3kL._RI_SX200_.jpg');
            // infospot.position.set(viewer.getPosition().x, viewer.getPosition().y, viewer.getPosition().z)
            // panorama.add(infospot);
            // viewer.update()
        })

    }, [])

    return (
        <div>
            <div id={containerId} className={className} style={style}>

            </div>
            <div style={hideContainer} id={hideContainerId}>
                {infoSpots.map(info => (<FroalaView key={info.id} spotId={info.id} html={info.html}/>))}
            </div>
        </div>
    )
}

export default PanoView

import React, { useEffect } from 'react'
import Mapplics from '../lib/mapplic/mapplic'
function PreviewFloorPlan(props) {

    const { src, sidebar, hovertip, mapId = 'new-floor', previewId = 'mapplic-preview', locations = [], mapName = "new-map", onClickMap, onClickLocation, isEditing, categories=[], defaultSidebarLogo } = props

    useEffect(() => {
        const data = {
            mapwidth:   '2000px',
            mapheight: '1200px',
            levels: [
                {
                    id: mapId,
                    title: "New Floor",
                    map: src,
                    locations
                },
            ],
            categories,
            editing: isEditing
        }
        new Mapplics(mapName).init($('#' + previewId), {
            source: data,
            height: 'auto',
            sidebar,
            minimap: false,
            markers: true,
            fullscreen: true,
            hovertip,
            developer: false,
            maxscale: 10,
            onClickMap,
            onClickLocation,
            defaultSidebarLogo
        })
    }, [])


    return (
        <section >

            <div className="map-container border rounded" style={{overflow:'hidden'}}>
                <div id={previewId} />
            </div>

        </section>
    )
}

export { PreviewFloorPlan }



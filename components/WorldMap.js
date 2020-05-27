import React, { useEffect, useState } from 'react'
import jq from 'jquery'

function WorldMap(props) {

    const { hovertip, locations = [], onClickMap, onClickLocation, isEditing, categories = [], defaultSidebarLogo, data } = props



    const colors = {}
    data.visitorCountryList.forEach(c => {
        colors[c.countryCode.toLowerCase()] = '#ee3235'
    });

    useEffect(() => {
        jQuery(document).ready(function () {

            $('#vmap').remove()
            $('.jqvmap-label').remove()
            $('#vmap-container').append('<div id="vmap" style="height:260px;" />');
            $('#vmap').vectorMap(
                {
                    map: 'world_en',
                    backgroundColor: '#a5bfdd',
                    borderColor: '#818181',
                    borderOpacity: 0.25,
                    borderWidth: 1,
                    color: '#f4f3f0',
                    enableZoom: true,
                    hoverColor: '#818181',
                    hoverOpacity: null,
                    normalizeFunction: 'linear',
                    scaleColors: ['#b6d6ff', '#005ace'],
                    selectedColor: '#c9dfaf',
                    selectedRegions: null,
                    showTooltip: true,
                    colors,
                    onRegionClick: function (element, code, region) {
                        // var message = 'You clicked "'
                        //     + region
                        //     + '" which has the code: '
                        //     + code.toUpperCase();

                        // alert(message);
                    },
                    onLabelShow: function (event, label, code) {
                        const find = data.visitorCountryList.find(c => {
                            return c.countryCode.toLowerCase() === code
                        })
                        label.prepend(`
                        <img src="../static/img/flag/${code.toUpperCase()}.svg" alt="${code}" style="height:30px; width:30px"/>
                    `)
                        if (find) {
                            label.append(`
                            <span className="ml-2">(${find.total})</span>
                        `)
                        }
                    }
                })
                
        })
       
    }, [data])


    return (
        <section className="py-2">
            <div id="vmap-container" className="border rounded" style={{ overflow: 'hidden' }}>
                <div id={'vmap'} style={{ height: '260px' }} />
            </div>
        </section>
    )
}

export { WorldMap }



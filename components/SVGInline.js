import React, { useEffect, useState } from 'react';

const SvgInline = props => {
    const [svg, setSvg] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isErrored, setIsErrored] = useState(false);

    useEffect(() => {
        fetch(props.url)
            .then(res => res.text())
            .then(setSvg)
            .catch(setIsErrored)
            .then(() => setIsLoaded(true))
    }, [props.url]);

    return (
        <div 
            className="mr-3 border list-img"
            dangerouslySetInnerHTML={{ __html: svg }}
        
        />
    );
}

export { SvgInline }
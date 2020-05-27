import React, { useState, useEffect } from 'react'

var playView = null

const Product360 = (props) => {

    const [isFullScreen, setIsFullScreen] = useState(false)

    useEffect(() => {
        $(".product-gallery img").ready(function () {
           
            
            var pageX = '';
            var sliding = false;

            $('.gal-next').click(() => {
                goToNext();
            })

            $('.gal-prev').click(function () {
                goToPrev();
            });

            $('.gal-play').click(function () {
               
                if (playView) {
                    clearInterval(playView);
                }

                playView = setInterval(function () {
                    goToNext();
                }, 60);
            });

            $('.gal-stop').click(function () {
                if (playView) {
                    clearInterval(playView);
                }
            });


            $('.product-gallery .loader').hide();
            $(".constainer-360").mousedown(function (event) {
                sliding = true;
            });
            $(".constainer-360").mouseup(function (event) {
                sliding = false;
            });
            $(".constainer-360").mousemove(function (event) {
                if (sliding) {
                    if (pageX == '') {
                        pageX = event.pageX;
                    } else {
                        var difference = event.pageX - pageX;
                        if (difference > 0) {
                            pageX = event.pageX;
                            goToNext();



                        } else if (difference < 0) {
                            pageX = event.pageX;
                            goToPrev();


                        }

                        if (event.pageX > pageX) {
                            pageX = event.pageX;
                            goToNext();
                        } else if (event.pageX < pageX) {
                            pageX = event.pageX;
                            goToPrev();
                        }

                    }
                }
            });

        });
    }, [])


    return (
        <div id="product360" className="constainer-360" >
            <div className={`product-gallery constainer-image`} >
                <div className="loader row justify-content-center align-items-center">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>

                <div className="images">
                    {props.images.map((element, index) => {

                        return (
                            <div key={index} className={`${index === 0 && 'current'} product-image`} onClick={() => {
                                console.log("Click")
                            }}>
                                <img src={element.fileUrl} className="img-preview-product360" />
                                {/* <img src={element.fileUrl} className="img-preview" /> */}
                            </div>
                        )
                    })}

                </div>
                <div className="row justify-content-center">
                    <div>
                        <button className="btn btn-control-360 gal-prev" ><i className="fas fa-step-backward" /></button>
                        <button className="btn btn-control-360 gal-next" ><i className="fas fa-step-forward" /></button>
                        <button className="btn btn-control-360 gal-play" ><i className="fas fa-play" /></button>
                        <button className="btn btn-control-360 gal-stop" ><i className="fas fa-stop" /></button>
                        <button className="btn btn-control-360 rq" onClick={requestOrExitFullScreen}><i className="fas fa-expand" /></button>
                    </div>
                </div>
            </div>
        </div>

    )

    function goToNext() {
        var currentElement = $('.product-gallery .images .product-image.current').first();
        if (currentElement.is(':last-child')) {
            $('.product-gallery .images .product-image').first().addClass('current');
            currentElement.removeClass('current');
        } else {
            currentElement.next().addClass('current');
            currentElement.removeClass('current');
        }
    }
    function goToPrev() {
        var currentElement = $('.product-gallery .images .product-image.current').first();
        if (currentElement.is(':first-child')) {
            $('.product-gallery .images .product-image:last-child').addClass('current');
            currentElement.removeClass('current');
        } else {
            currentElement.prev().addClass('current');
            currentElement.removeClass('current');
        }
    }


    function requestOrExitFullScreen() {

        const elem = document.getElementById("product360");

        var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
        const full = fullscreenElement ? true : false
        console.log("Full", full)

        if (full) {

            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
            }

        } else {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) { /* Firefox */
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE/Edge */
                elem.msRequestFullscreen();
            }
        }

        setIsFullScreen(!isFullScreen)


    }

  
}

export { Product360 }
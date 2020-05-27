import Document, { Html, Head, Main, NextScript } from 'next/document'
import dynamic from 'next/dynamic'

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html>
                <Head>

                    <meta charSet="utf-8" />
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width,initial-scale=1" />

                    {/* chat */}
                    <link href="https://fonts.googleapis.com/css?family=Rubik:300,300i,400,400i,500,500i,700,700i,900,900i&display=swap" rel="stylesheet" />
                    <link rel="stylesheet" type="text/css" href="/static/chat/css/date-picker.css" />
                    <link rel="stylesheet" type="text/css" href="/static/chat/css/magnific-popup.css" />
                    {/* <link rel="stylesheet" type="text/css" href="/static/chat/css/style.css" media="screen" id="color" />
                    <link href="/static/css/chat.css" rel="stylesheet" /> */}

                    {/* Style Sheets */}
                    <link href="/static/css/sb-admin-2.css" rel="stylesheet" />
                    <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet"></link>
                    <link href="/static/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css"></link>
                    <link href="/static/css/froala_style.css" rel="stylesheet" type="text/css"></link>
                    <link href="/static/css/froala_editor.min.css" rel="stylesheet" type="text/css"></link>
                    <link href="/static/css/plugins.pkgd.min.css" rel="stylesheet" type="text/css"></link>
                    <link href="/static/css/custom.css" rel="stylesheet" type="text/css"></link>
                    <link href="/static/css/DatePicker.css" rel="stylesheet" type="text/css"></link>
                    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" crossOrigin="anonymous" />

                    {/* Flipbook StyleSheet */}
                    <link href="/static/dflip/css/dflip.css" rel="stylesheet" type="text/css" />
                    {/* Icons Stylesheet */}
                    <link href="/static/dflip/css/themify-icons.css" rel="stylesheet" type="text/css" />

                    {/* maplic */}
                    <link rel="stylesheet" type="text/css" href="/static/maplic/css/style.css" />
                    <link rel="stylesheet" type="text/css" href="/static/maplic/css/map.css" />
                    <link rel="stylesheet" type="text/css" href="/static/maplic/mapplic/mapplic.css" />

                    {/* JqVmap */}
                    <link href="/static/jqvmap/jqvmap.css" media="screen" rel="stylesheet" type="text/css"></link>

                    <script src="/static/js/jquery.min.js"></script>


                </Head>
                <body>

                    <Main />
                    <NextScript />



                    {/* Script */}
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js" integrity="sha384-b/U6ypiBEHpOf/4+1nzFpr53nxSS+GLCkfwBdFNTxtclqqenISfwAzpKaMNFNmj4" crossOrigin="anonymous"></script>
                    <script src="/static/js/jquery.easing.min.js"></script>
                    <script src="/static/js/bootstrap.min.js"></script>
                    {/* <script src="/static/js/sb-admin-2.js"></script> */}


                    {/* /* dflip */}
                    {/* <script src="/static/dflip/js/libs/jquery.min.js" type="text/javascript"></script> */}
                    <script src="https://code.jquery.com/ui/1.8.5/jquery-ui.min.js" integrity="sha256-fOse6WapxTrUSJOJICXXYwHRJOPa6C1OUQXi7C9Ddy8=" crossOrigin="anonymous"></script>
                    <script src="/static/dflip/js/dflip.min.js" type="text/javascript"></script>
                    <script src="/static/js/pdfthumbnail/pdf.worker.js" type="text/javascript"></script>
                    {/* <script src="/static/js/pdfthumbnail/pdfthumb.js" type="text/javascript"></script> */}

                    {/* JqVmap */}
                    <script type="text/javascript" src="/static/jqvmap/jquery.vmap.js"></script>
                    <script type="text/javascript" src="/static/jqvmap/maps/jquery.vmap.world.js" charSet="utf-8"></script>

                    <div id="upload-progress-bar" style={{ height: '10px', position: 'fixed', width: '0%', bottom: '0px', left: '0px', backgroundColor: 'red' }}></div>
                </body>
            </Html>
        )
    }

}

export default MyDocument

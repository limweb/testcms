import React from 'react'
import { getDocument } from '../lib/pdf'

class PdfThumbnail extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            thumbUrl: "../static/img/emptypdf.jpg"
        }
    }

    componentDidMount() {

        const { imgWidth, imgHeight, fileUrl } = this.props

       try {
           
           getDocument(fileUrl).then(pdf => {

               pdf.getPage(1).then(( async page => {

                   console.log("page", page)

                   var canvas = document.createElement("canvas");
                   var viewport = page.getViewport(1.0);
                   var context = canvas.getContext('2d');

                   if (imgWidth) {
                       viewport = page.getViewport(imgWidth / viewport.width);
                   } else if (imgHeight) {
                       viewport = page.getViewport(imgHeight / viewport.height);
                   }

                   canvas.height = viewport.height;
                   canvas.width = viewport.width;

                  try {
                      
                    //   page.render({
                    //       canvasContext: context,
                    //       viewport: viewport
                    //   }).then(function () {

                    //       this.setState({
                    //           thumbUrl: canvas.toDataURL()
                    //       })
                    //   }.bind(this));
                      
                      await page.render({
                          canvasContext: context,
                          viewport: viewport
                      }) 

                      this.setState({
                          thumbUrl: canvas.toDataURL()
                      })
                      
                  } catch (error) {
                      
                  }

               }).bind(this))
           })
           
       } catch (error) {
           
       }
    }

    render() {
        const { fileUrl, fileName } = this.props
        return (
            <div>
                <div style={{ maxWidth: '100%' }} className="_df_custom" webgl="true" id="df_book_custom" source={fileUrl} >
                    <img style={{ width: '100%', }} src={this.state.thumbUrl} className="thumb-pdf"></img>
                </div>
                <div className="text-center mt-2">{fileName}</div>
            </div>
        )
    }
}



export { PdfThumbnail }
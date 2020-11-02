import * as React from "react"
import ReactDOM from 'react-dom';


export default class HtmlReport extends React.Component{
    
    iframe() {
        return {
            __html: '<iframe src="./report.html" width="1920" height="1080"></iframe>'
        }
    }
      
    render() {
      return (
        <div>
            <div dangerouslySetInnerHTML={this.iframe()} />
        </div>)
    }
}

/*jshint esversion: 6 */
import React from "react";
import Dropzone from 'react-dropzone'
import {
    Form,
    Button
  } from 'react-bootstrap';

    let fileReader;
    let upload;
    
    const handleFileRead = (e) => {
        const content = fileReader.result;
        console.dir(content);
        upload.setState({data: content});
        upload.setState({message: "data uploaded"});
    };

    const handleFileChosen = (file, upload) => {
        var name_split = file.name.split('.');
        console.log(name_split[name_split.length-1]);

        if (name_split[name_split.length-1] === "txt") {
            fileReader = new FileReader();
            fileReader.onloadend = handleFileRead;
            fileReader.readAsText(file);
            upload.setState({upload_bad: false, upload_good: true});
        } else {
            console.log("bad");
            upload.setState({upload_bad: true, upload_good: false, data:""});
        }

    };

    export default ({...props}) => {
        upload = props.upload;
        return (
                <div className="uploadbox_phrase">
                    <div className={upload.state.upload_good ? "uploadbox-inner uploadbox-inner-good" : "uploadbox-inner"}>
                <Dropzone onDrop={acceptedFiles => handleFileChosen(acceptedFiles[0], upload)}>
                      {({getRootProps, getInputProps}) => (
                        <section>
                          <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <div className={
                              upload.state.upload_good ? 
                              "glyphicon glyphicon-cloud-upload upload-cloud upload-cloud-good" : 
                              "glyphicon glyphicon-cloud-upload upload-cloud "
                              }></div>
                            <p>Drag 'n' drop the .txt file here<br/>
                        <span style={{fontSize:"9.5pt"}}>Maximum file size: 128Mb</span></p>
                          </div>
                        </section>
                      )}
                </Dropzone>
                <div className="uploadbox-button">
                <Form.Control type="file" placeholder="Upload text file"
                id='file'
                className='input-file'
                accept='.txt'
                onChange={e => handleFileChosen(e.target.files[0], upload)}
                hidden
                />
                <Button variant="primary" type="button" onClick={() => {document.getElementById('file').click()}} className="submit-request">Upload Text File</Button>
                </div>
                </div>
                </div>
            )
        };

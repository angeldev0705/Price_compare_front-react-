import React from "react";
import {
    Alert
  } from 'react-bootstrap';

export default ({
    messages
}) => {
        return [].concat(messages).map(
            (message, i) =>
                (
                <Alert key={i} variant={message.level} visible="true">{message.message}</Alert>
                )
        );

}
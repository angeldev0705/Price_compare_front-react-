import React from "react";
import { Button, Spinner } from "react-bootstrap";
import "./LoaderButton.css";

export default ({
  isLoading,
  text,
  loadingText,
  className = "",
  disabled = false,
  ...props
}) =>
  <Button
    className={`LoaderButton ${className}`}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading && <Spinner animation="border" size="sm" className="loading" as="span"
      role="status"
      aria-hidden="true" />}
    {!isLoading ? text : loadingText}
  </Button>;
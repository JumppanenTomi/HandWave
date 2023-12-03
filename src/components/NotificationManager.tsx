import {Alert} from "react-bootstrap";
import React, {useState} from "react";

export default function NotificationManager() {
    const [show, setShow] = useState(true);

    const [title, setTitle] = useState<string | undefined>()
    const [message, setMessage] = useState<string | undefined>()
    const [additionalContent, setAdditionalContent] = useState<React.JSX.Element | undefined>()

    const [variant, setVariant] = useState<"danger" | "success" | "warning">("success")

    const giveFeedback = (title?: string, message?: string, additionalElement?: React.JSX.Element) => {
        setMessage(title)
        setTitle(message)
        setAdditionalContent(additionalElement)
        setVariant("success")
        setShow(true)
    }

    const reportError = (title?: string, message?: string, additionalElement?: React.JSX.Element) => {
        setMessage(title)
        setTitle(message)
        setAdditionalContent(additionalElement)
        setVariant("danger")
        setShow(true)
    }

    const reportWarning = (title?: string, message?: string, additionalElement?: React.JSX.Element) => {
        setMessage(title)
        setTitle(message)
        setAdditionalContent(additionalElement)
        setVariant("warning")
        setShow(true)
    }

    const close = () => {
        setShow(false)
    }

    const element = (
        <Alert show={show} variant={variant}>
            {title && (
                <Alert.Heading>{title}</Alert.Heading>
            )}
            {message && (
                <p>{message}</p>
            )}
            <hr/>
            {additionalContent && additionalContent}
        </Alert>
    )

    return {
        close,
        element,
        reportError,
        reportWarning,
        giveFeedback,
    }
}
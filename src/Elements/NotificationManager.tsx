import {Alert} from "react-bootstrap";
import React, {useState} from "react";

/**
 * Creates a NotificationManager object that can be used to display different types of notifications.
 * @returns {{
 *   closeNotification: function,
 *   notificationElement: React.Element,
 *   reportError: function,
 *   reportWarning: function,
 *   reportSuccess: function
 * }} Returns an object with methods for managing notifications.
 */
export default function NotificationManager() {
    const [show, setShow] = useState(false);
    const [dismissable, setDismissable] = useState<boolean>(false)

    const [title, setTitle] = useState<string | undefined>()
    const [message, setMessage] = useState<string | undefined>()
    const [additionalContent, setAdditionalContent] = useState<React.JSX.Element | undefined>()

    const [variant, setVariant] = useState<"danger" | "success" | "warning">("success")

    const reportSuccess = (title?: string, message?: string, additionalElement?: React.JSX.Element, dismissible?: boolean, durationMs: number = 3000) => {
        setTitle(title)
        setMessage(message)
        setAdditionalContent(additionalElement)
        setVariant("success")
        setShow(true)
        setDismissable(dismissible ? dismissible : false)
        setTimeout(() => {
            setShow(false);
        }, durationMs);
    }

    const reportError = (title?: string, message?: string, additionalElement?: React.JSX.Element, dismissible?: boolean, durationMs: number = 3000) => {
        setTitle(title)
        setMessage(message)
        setAdditionalContent(additionalElement)
        setVariant("danger")
        setShow(true)
        setDismissable(dismissible ? dismissible : false)
        setTimeout(() => {
            setShow(false);
        }, durationMs);
    }

    const reportWarning = (title?: string, message?: string, additionalElement?: React.JSX.Element, dismissible?: boolean, durationMs: number = 3000) => {
        setTitle(title)
        setMessage(message)
        setAdditionalContent(additionalElement);
        setVariant("warning");
        setShow(true);
        setDismissable(dismissible ? dismissible : false)
        setTimeout(() => {
            setShow(false);
        }, durationMs);
    }


    const close = () => {
        setShow(false)
    }

    const element = (
        <Alert show={show} variant={variant} dismissible={dismissable} style={{position: "absolute", top: 25, left: 0, zIndex: 999, width: "fit-content"}}>
            {title && (
                <Alert.Heading>{title}</Alert.Heading>
            )}
            {message && (
                <p style={{margin: 0, padding: 0}}>{message}</p>
            )}
            {additionalContent && (
                <>
                    <hr/>
                    {additionalContent}
                </>
            )}
        </Alert>
    )

    return {
        closeNotification: close,
        notificationElement: element,
        reportError,
        reportWarning,
        reportSuccess,
    }
}
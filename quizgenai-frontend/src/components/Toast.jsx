import { useEffect } from "react";

/**
 * Small inline toast used in place of window.alert() so error and
 * success messages match the rest of the UI.
 *
 * Usage:
 *   const [toast, setToast] = useState(null); // { type: "error" | "success", message: string }
 *   <Toast toast={toast} onClose={() => setToast(null)} />
 */
function Toast({ toast, onClose }) {
    useEffect(() => {
        if (!toast) return undefined;

        const timer = setTimeout(() => {
            onClose();
        }, 3600);

        return () => clearTimeout(timer);
    }, [toast, onClose]);

    if (!toast) return null;

    return (
        <div className={`qg-toast qg-toast--${toast.type}`} role="alert">
            <span>{toast.type === "error" ? "⚠️" : "✅"}</span>
            <span>{toast.message}</span>
        </div>
    );
}

export default Toast;

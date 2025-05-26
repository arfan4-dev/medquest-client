// hooks/useTrackUniqueVisitor.js
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function useTrackUniqueVisitor() {
    useEffect(() => {
        if (!Cookies.get("unique_visitor_id")) {
            const visitorId = crypto.randomUUID();
            Cookies.set("unique_visitor_id", visitorId, {
                expires: 365,
                secure: true,
                sameSite: "Lax",
            });

            window.gtag?.("event", "new_unique_user", {
                visitor_id: visitorId,
            });
        }
    }, []);
}

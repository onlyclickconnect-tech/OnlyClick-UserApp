import { useEffect, useState } from "react";
import { getSession } from "../../../utils/sessionStorage";
import { router } from "expo-router";
import LoadingScreen from "../../../components/common/LoadingScreen";
import { saveSession } from "../../../utils/sessionStorage";



export default function App() {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);

    const sessiontoken = {
        "access_token": "eyJhbGciOiJIUzI1NiIsImtpZCI6IkF1NTNicEhvaVVEVXhvTXMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3FxaHVkd2xibWJwd2tqemd0cHNkLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI1ZTVhN2UxNy05NGFhLTQ3ZTctOTc0OS05ZDZhZjhkMmRmYWYiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU2OTI2NjQwLCJpYXQiOjE3NTY5MjMwNDAsImVtYWlsIjoiIiwicGhvbmUiOiI5MTk4MzYzNzA4ODEiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJwaG9uZSIsInByb3ZpZGVycyI6WyJwaG9uZSJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiNWU1YTdlMTctOTRhYS00N2U3LTk3NDktOWQ2YWY4ZDJkZmFmIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib3RwIiwidGltZXN0YW1wIjoxNzU2OTIzMDQwfV0sInNlc3Npb25faWQiOiIxMDQ5ZGQ3MS1iMmZiLTQ4ZWQtODIzMS1jZmM4OTI5ZjlmZTgiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.YEF-KBcnTJYlBCywiSbVSJDiLcnAd3xYB5KQlcnf5_g",
        "expires_at": 1756926640,
        "expires_in": 3600,
        "refresh_token": "gmn7tb3ytfrs",
        "token_type": "bearer",
        "user": {
            "app_metadata": [
                Object
            ],
            "aud": "authenticated",
            "confirmation_sent_at": "2025-09-03T18:10:27.410104Z",
            "confirmed_at": "2025-09-03T18:10:40.636021Z",
            "created_at": "2025-09-02T06:44:30.93132Z",
            "email": "",
            "id": "5e5a7e17-94aa-47e7-9749-9d6af8d2dfaf",
            "identities": [
                Array
            ],
            "is_anonymous": false,
            "last_sign_in_at": "2025-09-03T18:10:40.645905215Z",
            "phone": "919836370881",
            "phone_confirmed_at": "2025-09-03T18:10:40.636021Z",
            "role": "authenticated",
            "updated_at": "2025-09-03T18:10:40.664084Z",
            "user_metadata": [
                Object
            ]
        }
    }

    
    useEffect(() => {
        const initAuth = async () => {
            await saveSession(sessiontoken);
            const storedSession = await getSession();
            console.log("stored session", storedSession);
            if (storedSession?.access_token) {
                try {
                    // Verify with your backend
                    const res = await fetch("https://your-backend.com/auth/verify", {
                        headers: {
                            Authorization: `Bearer ${storedSession.access_token}`,
                        },
                    });

                    if (res.ok) {
                        setSession(storedSession);
                    } else {
                        await clearSession();
                        setSession(null);
                    }
                } catch (err) {
                    console.error("Error verifying session:", err);
                    setSession(null);
                }
            } else {
                setSession(null);
            }

            setLoading(false);
        };

        initAuth();
    }, []);

    useEffect(() => {
        const redirect = () => {
            if (session) {
                setLoading(false);
                router.replace('/auth/loading');
            }
            else {
                setLoading(false);
                router.replace('/auth/sign-in');
            }
        }

        redirect();
    }, [loading, session])


    if (loading) return <LoadingScreen />;

    return session ? (
        <></>
    ) : (
        <></>
    );
}
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Home = () => {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const status = params.get("status");

        if (status === "approved") {
            setShowSuccessModal(true);

            // Limpia la URL (sin recargar)
            window.history.replaceState({}, "", "/home");
        }
    }, [location]);

    return (
        <div>
            <h1>Home</h1>

            {/* Modal Bootstrap */}
            <div
                className={`modal fade ${showSuccessModal ? "show" : ""}`}
                tabIndex="-1"
                style={{ display: showSuccessModal ? "block" : "none" }}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">¡Donación realizada!</h5>
                            <button className="btn-close" onClick={() => setShowSuccessModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <p>Gracias por apoyar a la fundación ❤️</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;

import { useNavigate } from "react-router-dom";


const Proximente = () => {
    const navigate = useNavigate();
const handleClick = () => {
    navigate("/gestiones");
};
    return (
        <div className="proximamente">
        <h1>Proximamente</h1>
        <p>Esta sección estará disponible pronto.</p>
        <button
            onClick={handleClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-md transition"
            >
            Regresar
        </button>
        </div>
    );
    }
export default Proximente;
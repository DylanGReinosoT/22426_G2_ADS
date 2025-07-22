import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Proximamente = () => {
    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate("/gestiones");
    };

    // Animaciones
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.8,
                when: "beforeChildren",
                staggerChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const buttonVariants = {
        hover: {
            scale: 1.05,
            boxShadow: "0px 5px 15px rgba(220, 38, 38, 0.3)",
            transition: {
                duration: 0.3
            }
        },
        tap: {
            scale: 0.98
        }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col items-center justify-center p-6 text-center"
        >
            <motion.div 
                variants={itemVariants}
                className="mb-8"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-red-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                
                <motion.h1 
                    variants={itemVariants}
                    className="text-4xl md:text-5xl font-bold text-white mb-4"
                >
                    Próximamente
                </motion.h1>
                
                <motion.p 
                    variants={itemVariants}
                    className="text-xl text-gray-300 max-w-md mx-auto"
                >
                    Esta sección está en desarrollo y estará disponible muy pronto.
                </motion.p>
            </motion.div>

            <motion.div variants={itemVariants}>
                <motion.button
                    onClick={handleClick}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 border border-red-900 flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Volver al panel
                </motion.button>
            </motion.div>

            <motion.div 
                variants={itemVariants}
                className="mt-16 text-gray-500 text-sm"
            >
                © {new Date().getFullYear()} PintAuto - Todos los derechos reservados
            </motion.div>
        </motion.div>
    );
};

export default Proximamente;
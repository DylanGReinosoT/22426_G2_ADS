import{useContext} from 'react';
import { AuthContext } from '../contexts/AuthContext';

const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth mdebe ser usado de dentro de AuthProvider');
    }

    return context;
};

export default useAuth;
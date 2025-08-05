import api from './api';

const authService = {
    login: async(email, password) => {
        try{
            const response = await api.post('/auth/login', {email, password});

            const responseData = response.data;

            if (!responseData.success) {
                return {
                    success: false,
                    message: responseData.message || 'Error en el servidor, inicio de sesion'
                };
            }

            if (responseData.datos && responseData.datos.usuario && responseData.datos.token){
                return {
                    success: true,
                    message: 'Inicio de sesión exitoso',
                    usuario: responseData.datos.usuario,
                    token: responseData.datos.token
                };
            }else{
                console.error('Estructura de respuesta inesperada:', responseData);
                return {
                    success: false,
                    message: 'Error en la respuesta del servidor, no tiene el formato esperado'
                };
            }
        }catch(error){
            console.error('Error en la solicitud de login:', error);

            if(error.response && error.response.status === 401){
                const errorMsg = error.response.data && error.response.data.mensaje;
                if (errorMsg === 'Correo electronico no resgistrado') {
                    return {
                        success: false,
                        message: 'Correo electronico no resgistrado',
                        errorType: 'email'
                    };
                }else if (errorMsg === 'Contraseña incorrecta') {
                    return {
                        success: false,
                        message: 'Contraseña incorrecta',
                        errorType: 'password'
                    };
                }else{
                    return {
                        success: false,
                        message: 'Credenciales incorrectas',
                        errorType: 'both'
                    };
                }
            }else if (error.response && error.response.data && error.response.data.mensaje) {
                return {
                    success: false,
                    message: error.response.data.mensaje
                };
            }else{
                return {
                    success: false,
                    message: 'Error de conexion, en el servidor'
                };
            }
        }
    },
    setUserData: (user, token) => {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
    },

    getUserData: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    getToken: () => {
        return localStorage.getItem('token');
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },
}

export default authService;
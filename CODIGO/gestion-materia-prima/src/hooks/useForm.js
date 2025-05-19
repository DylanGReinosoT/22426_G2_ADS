import {useState} from 'react';

const useForm = (initialValues, onSubmit, validate) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setValues({
            ...values,
            [name]: type === 'checkbox' ? checked : value
        });
    }

    const setValue = (name, value) => {
        setValues({
            ...values,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(validate){
            const validationErrors = validate(values);
            setErrors(validationErrors);
            if (Object.keys(validationErrors).length > 0) {
                return;
            }
        }

        setIsSubmitting(true);
        try {
            await onSubmit(values);
            setErrors({});
        } catch (error) {
            console.error('Error en el envío del formulario:', error);
            if(error.response?.data?.errores){
                setErrors(error.response.data.errores);
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    const resetForm = () => {
        setValues(initialValues);
        setErrors({});
    };

    return {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
        setValue,
        resetForm
    };
};

export default useForm;
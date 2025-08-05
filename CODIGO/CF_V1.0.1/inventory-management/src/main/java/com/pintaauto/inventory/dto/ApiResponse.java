package com.pintaauto.inventory.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean success;
    private String mensaje;
    private T datos;
    private String error;

    // Constructores privados
    private ApiResponse(boolean success, String mensaje, T datos, String error) {
        this.success = success;
        this.mensaje = mensaje;
        this.datos = datos;
        this.error = error;
    }

    // Métodos estáticos para crear respuestas exitosas
    public static <T> ApiResponse<T> success(String mensaje, T datos) {
        return new ApiResponse<>(true, mensaje, datos, null);
    }

    public static <T> ApiResponse<T> success(String mensaje) {
        return new ApiResponse<>(true, mensaje, null, null);
    }

    // Métodos estáticos para crear respuestas de error
    public static <T> ApiResponse<T> error(String error) {
        return new ApiResponse<>(false, null, null, error);
    }

    public static <T> ApiResponse<T> error(String mensaje, T datos) {
        return new ApiResponse<>(false, mensaje, datos, null);
    }

    // Getters
    public boolean isSuccess() { return success; }
    public String getMensaje() { return mensaje; }
    public T getDatos() { return datos; }
    public String getError() { return error; }
}
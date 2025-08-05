package com.pintaauto.inventory.dto;

public class AuthResponseDTO {

    private UsuarioResponseDTO usuario;
    private String token;

    // Constructores
    public AuthResponseDTO() {}

    public AuthResponseDTO(UsuarioResponseDTO usuario, String token) {
        this.usuario = usuario;
        this.token = token;
    }

    // Getters y Setters
    public UsuarioResponseDTO getUsuario() { return usuario; }
    public void setUsuario(UsuarioResponseDTO usuario) { this.usuario = usuario; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}

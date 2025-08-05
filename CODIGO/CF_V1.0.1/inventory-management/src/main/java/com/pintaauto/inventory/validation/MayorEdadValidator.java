package com.pintaauto.inventory.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.Calendar;
import java.util.Date;

public class MayorEdadValidator implements ConstraintValidator<MayorEdad, Date> {

    @Override
    public boolean isValid(Date fechaNacimiento, ConstraintValidatorContext context) {
        if (fechaNacimiento == null) return false;

        Calendar hoy = Calendar.getInstance();
        hoy.set(Calendar.HOUR_OF_DAY, 0);
        hoy.set(Calendar.MINUTE, 0);
        hoy.set(Calendar.SECOND, 0);
        hoy.set(Calendar.MILLISECOND, 0);

        if (fechaNacimiento.after(hoy.getTime())) {
            return false;
        }

        Calendar fecha18 = Calendar.getInstance();
        fecha18.add(Calendar.YEAR, -18);

        return !fechaNacimiento.after(hoy.getTime()) && !fechaNacimiento.after(fecha18.getTime());
    }
}
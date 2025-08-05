package com.pintaauto.inventory.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = MayorEdadValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface MayorEdad {
    String message() default "La fecha de nacimiento debe indicar al menos 18 años y no ser futura";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

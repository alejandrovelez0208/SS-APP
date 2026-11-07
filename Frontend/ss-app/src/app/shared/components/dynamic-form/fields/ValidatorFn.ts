import { Validators } from "@angular/forms";

campos: [
    {
        tipo: 'text', nombre: 'name', etiqueta: 'Name',
        validators: [Validators.minLength(3), Validators.maxLength(10)],
    },

]
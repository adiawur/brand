import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
providedIn: 'root'
})
export class AlertService {

success(title: string, text?: string): void {
Swal.fire({
icon: 'success',
title,
text,
timer: 1500,
showConfirmButton: false
});
}

error(title: string, text?: string): void {
Swal.fire({
icon: 'error',
title,
text,
confirmButtonText: 'OK'
});
}

warning(title: string, text?: string): void {
Swal.fire({
icon: 'warning',
title,
text,
confirmButtonText: 'OK'
});
}

info(title: string, text?: string): void {
Swal.fire({
icon: 'info',
title,
text,
confirmButtonText: 'OK'
});
}

confirm(title: string, text?: string, confirmText = 'Yes'): Promise<boolean> {
return Swal.fire({
icon: 'question',
title,
text,
showCancelButton: true,
confirmButtonText: confirmText,
cancelButtonText: 'Cancel'
}).then(result => result.isConfirmed);
}

}